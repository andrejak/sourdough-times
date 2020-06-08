import { APIGatewayEvent } from "aws-lambda";
import {
  FormResponse,
  FullConfig,
  Step,
  ProofFieldType,
  NumberFieldType,
  SectionId,
} from "../types";
import moment from "moment";

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
  const secondFrom = secondProof.value.duration.value.from;
  const secondProofTime = subtractMinutes(stepTime, secondFrom);
  const steps = [
    {
      when: secondProofTime.toISOString(),
      instruction: secondProof.instruction,
    },
  ];
  const firstFrom = firstProof.value.duration.value.from;
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
    const eatingTime = moment(body[SectionId.Basic].target.value.toString());
    let steps: Step[] = [
      {
        when: eatingTime.toISOString(),
        instruction: body[SectionId.Basic].target.instruction,
      },
    ];

    const { stepTime: coolingTime, step: coolingStep } = generateStep(
      body[SectionId.Baking].cooling,
      eatingTime
    );
    steps.push(coolingStep);
    const { stepTime: bakingTime, step: bakingStep } = generateStep(
      body[SectionId.Baking].baking,
      coolingTime
    );
    steps.push(bakingStep);
    // eslint-disable-next-line prefer-const
    let { stepTime, step: preheatStep } = generateStep(
      body[SectionId.Baking].preheat,
      bakingTime
    );
    steps.push(preheatStep);

    switch (body[SectionId.Basic].method) {
      case "fold": {
        const proofs = generateProvingInstructions(
          body[SectionId.BulkFerment].firstProof,
          body[SectionId.BulkFerment].secondProof,
          stepTime
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        const folds = generateFoldInstructions(
          body[SectionId.Folding].numFolds.value as number,
          body[SectionId.Folding].timeBetweenFolds.value as number,
          stepTime
        );
        stepTime = folds.stepTime;
        steps = steps.concat(folds.steps);
        break;
      }
      case "noKnead": {
        const folds = generateFoldInstructions(
          body[SectionId.Folding].numFolds.value as number,
          body[SectionId.Folding].timeBetweenFolds.value as number,
          stepTime
        );
        stepTime = folds.stepTime;
        steps = steps.concat(folds.steps);
        const proofs = generateProvingInstructions(
          body[SectionId.Proving].firstProof,
          body[SectionId.Proving].secondProof,
          stepTime
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
      case "knead": {
        const proofs = generateProvingInstructions(
          body[SectionId.Proving].firstProof,
          body[SectionId.Proving].secondProof,
          stepTime
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
    }

    if (body[SectionId.Preferment].levain.value != null) {
      const { stepTime: levainTime, step: levainStep } = generateStep(
        body[SectionId.Preferment].levain,
        stepTime
      );
      steps.push(levainStep);
      stepTime = levainTime.clone();
    }
    if (body[SectionId.Preferment].autolyse.value != null) {
      const { stepTime: autolyseTime, step: autolyseStep } = generateStep(
        body[SectionId.Preferment].levain,
        stepTime
      );
      steps.push(autolyseStep);
      stepTime = autolyseTime.clone();
    }

    const feedTime = subtractMinutes(
      stepTime,
      (24 / (body[SectionId.Basic].numFeedsPerDay.value as number)) * 60
    );
    steps.push({
      when: feedTime.toISOString(),
      instruction: body[SectionId.Basic].numFeedsPerDay.instruction,
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
