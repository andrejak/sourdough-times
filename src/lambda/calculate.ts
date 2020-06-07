import { APIGatewayEvent } from "aws-lambda";
import {
  FormResponse,
  FullConfig,
  Step,
  ProofFieldType,
  Range,
  NumberFieldType,
} from "../types";
import moment from "moment";
import { minsInH } from "../state";

const subtractMinutes = (time: moment.Moment, value: number) =>
  time.clone().subtract(value, "minutes");

type Info = { stepTime: moment.Moment; steps: Step[] };

const generateFoldInstructions = (
  numFolds: number,
  timeBetweenFolds: number,
  stepTime: moment.Moment
): Info => {
  const steps = [];
  for (let i = 0; i < numFolds; i++) {
    const foldTime = subtractMinutes(stepTime, timeBetweenFolds);
    steps.push({
      when: foldTime.toISOString(),
      instruction: "Perform another fold",
    });
    stepTime = foldTime.clone();
  }
  return {
    stepTime,
    steps,
  };
};

const generateProvingInstructions = (
  firstProof: ProofFieldType,
  secondProof: ProofFieldType,
  stepTime: moment.Moment
): Info => {
  const secondFrom =
    (secondProof.value.duration.value as Range<number>).from * minsInH;
  const secondProofTime = subtractMinutes(stepTime, secondFrom);
  const steps = [
    {
      when: secondProofTime.toISOString(),
      instruction: secondProof.instruction,
    },
  ];
  const firstFrom = (firstProof.value.duration.value as Range<number>).from;
  const firstProofTime = subtractMinutes(secondProofTime, firstFrom);
  steps.push({
    when: firstProofTime.toISOString(),
    instruction: firstProof.instruction,
  });
  return {
    stepTime: firstProofTime.clone(),
    steps,
  };
};

const generateStep = (field: NumberFieldType, stepTime: moment.Moment) => {
  const newTime = subtractMinutes(stepTime, field.value);
  return {
    stepTime: newTime.clone(),
    step: {
      when: newTime.toISOString(),
      instruction: field.instruction,
    },
  };
};

const handler = async (event: APIGatewayEvent): Promise<FormResponse> => {
  try {
    const body: FullConfig = JSON.parse(event.body);
    const eatingTime = moment(body.basicSection.target.value.toString());
    let steps: Step[] = [
      {
        when: eatingTime.toISOString(),
        instruction: body.basicSection.target.instruction,
      },
    ];

    const { stepTime: coolingTime, step: coolingStep } = generateStep(
      body.bakingSection.cooling,
      eatingTime
    );
    steps.push(coolingStep);
    const { stepTime: bakingTime, step: bakingStep } = generateStep(
      body.bakingSection.baking,
      coolingTime
    );
    steps.push(bakingStep);
    // eslint-disable-next-line prefer-const
    let { stepTime, step: preheatStep } = generateStep(
      body.bakingSection.preheat,
      bakingTime
    );
    steps.push(preheatStep);

    switch (body.basicSection.method) {
      case "fold": {
        const folds = generateFoldInstructions(
          body.foldingSection.numFolds.value as number,
          body.foldingSection.timeBetweenFolds.value as number,
          stepTime
        );
        stepTime = folds.stepTime;
        steps = steps.concat(folds.steps);
        const proofs = generateProvingInstructions(
          body.provingSection.firstProof,
          body.provingSection.secondProof,
          stepTime
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
      case "noKnead": {
        const folds = generateFoldInstructions(
          body.foldingSection.numFolds.value as number,
          body.foldingSection.timeBetweenFolds.value as number,
          stepTime
        );
        stepTime = folds.stepTime;
        steps = steps.concat(folds.steps);
        const proofs = generateProvingInstructions(
          body.provingSection.firstProof,
          body.provingSection.secondProof,
          stepTime
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
      case "knead": {
        const proofs = generateProvingInstructions(
          body.provingSection.firstProof,
          body.provingSection.secondProof,
          stepTime
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
    }

    if (body.prefermentSection.levain.value != null) {
      const { stepTime: levainTime, step: levainStep } = generateStep(
        body.prefermentSection.levain,
        stepTime
      );
      steps.push(levainStep);
      stepTime = levainTime.clone();
    }
    if (body.prefermentSection.autolyse.value != null) {
      const { stepTime: autolyseTime, step: autolyseStep } = generateStep(
        body.prefermentSection.levain,
        stepTime
      );
      steps.push(autolyseStep);
      stepTime = autolyseTime.clone();
    }

    const feedTime = subtractMinutes(
      stepTime,
      (24 / (body.basicSection.numFeedsPerDay.value as number)) * 60
    );
    steps.push({
      when: feedTime.toISOString(),
      instruction: body.basicSection.numFeedsPerDay.instruction,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(steps.reverse()),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

export { handler };
