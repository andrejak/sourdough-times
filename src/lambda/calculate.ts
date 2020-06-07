import { APIGatewayEvent } from "aws-lambda";
import {
  FormResponse,
  FullConfig,
  Step,
  ProofFieldType,
  Range,
} from "../types";
import moment from "moment";
import { minsInH } from "../state";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subtractMinutes = (time: moment.Moment, value: any) =>
  time.clone().subtract(value, "minutes");

type Info = { methodStepTime: moment.Moment; steps: Step[] };

const generateFoldInstructions = (
  numFolds: number,
  timeBetweenFolds: number,
  methodStepTime: moment.Moment
): Info => {
  const steps = [];
  for (let i = 0; i < numFolds; i++) {
    const foldTime = subtractMinutes(methodStepTime, timeBetweenFolds);
    steps.push({
      when: foldTime.toString(),
      instruction: "Perform another fold",
    });
    methodStepTime = foldTime.clone();
  }
  return {
    methodStepTime,
    steps,
  };
};

const generateProvingInstructions = (
  firstProof: ProofFieldType,
  secondProof: ProofFieldType,
  methodStepTime: moment.Moment
): Info => {
  const secondFrom =
    (secondProof.value.duration.value as Range<number>).from * minsInH;
  const secondProofTime = subtractMinutes(methodStepTime, secondFrom);
  const steps = [
    {
      when: secondProofTime.toString(),
      instruction: `Start the second proving ${
        secondProof.value.inFridge.value ? " in the fridge" : ""
      }`,
    },
  ];
  const firstFrom = (firstProof.value.duration.value as Range<number>).from;
  const firstProofTime = subtractMinutes(secondProofTime, firstFrom);
  steps.push({
    when: firstProofTime.toString(),
    instruction: `Start the first proving ${
      firstProof.value.inFridge.value ? " in the fridge" : ""
    }`,
  });
  return {
    methodStepTime: firstProofTime.clone(),
    steps,
  };
};

const handler = async (event: APIGatewayEvent): Promise<FormResponse> => {
  try {
    const body: FullConfig = JSON.parse(event.body);
    const eatingTime = moment(body.basic.target.value.toString());
    const coolingTime = subtractMinutes(eatingTime, body.baking.cooling.value);
    const bakingTime = subtractMinutes(coolingTime, body.baking.baking.value);
    const preheatTime = subtractMinutes(bakingTime, body.baking.preheat.value);
    let steps: Step[] = [
      { when: eatingTime.toString(), instruction: "Eat the bread!" },
      {
        when: coolingTime.toString(),
        instruction: "Take it out and let it cool",
      },
      { when: bakingTime.toString(), instruction: "Put the bread in the oven" },
      { when: preheatTime.toString(), instruction: "Preheat the oven" },
    ];
    let methodStepTime = preheatTime.clone();
    switch (body.basic.method) {
      case "fold": {
        const folds = generateFoldInstructions(
          body.folding.numFolds.value as number,
          body.folding.timeBetweenFolds.value as number,
          methodStepTime
        );
        methodStepTime = folds.methodStepTime;
        steps = steps.concat(folds.steps);
        const coldFermentationTime = subtractMinutes(
          methodStepTime,
          body.proving.coldFermentation.value
        );
        steps.push({
          when: coldFermentationTime.toString(),
          instruction: "Put it in the fridge to cold ferment",
        });
        const bulkFermentationTime = subtractMinutes(
          coldFermentationTime,
          body.proving.bulkFermentation.value
        );
        steps.push({
          when: bulkFermentationTime.toString(),
          instruction: "Leave it out to bulk ferment",
        });
        methodStepTime = bulkFermentationTime.clone();
        break;
      }
      case "noKnead": {
        const folds = generateFoldInstructions(
          body.folding.numFolds.value as number,
          body.folding.timeBetweenFolds.value as number,
          methodStepTime
        );
        methodStepTime = folds.methodStepTime;
        steps = steps.concat(folds.steps);
        const proofs = generateProvingInstructions(
          body.proving.firstProof,
          body.proving.secondProof,
          methodStepTime
        );
        methodStepTime = proofs.methodStepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
      case "knead": {
        const proofs = generateProvingInstructions(
          body.proving.firstProof,
          body.proving.secondProof,
          methodStepTime
        );
        methodStepTime = proofs.methodStepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
    }
    if (body.preferment.autolyse.value != null) {
      const autolyseTime = subtractMinutes(
        methodStepTime,
        body.preferment.autolyse.value
      );
      steps.push({
        when: autolyseTime.toString(),
        instruction: "Mix flour and water and leave to autolyse",
      });
      methodStepTime = autolyseTime.clone();
    }
    const feedTime = subtractMinutes(
      methodStepTime,
      (24 / (body.basic.numFeedsPerDay.value as number)) * 60
    );
    steps.push({
      when: feedTime.toString(),
      instruction: `Feed the starter ${
        body.basic.inFridge.value && "after taking it out of the fridge"
      }`,
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
