import { APIGatewayEvent } from "aws-lambda";
import {
  FormResponse,
  BakeConfig,
  KneadConfig,
  NoKneadConfig,
  FoldConfig,
  Step,
  ProofFieldType,
} from "../types";
import moment from "moment";

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
  const secondProofTime = subtractMinutes(
    methodStepTime,
    secondProof.value.duration.value
  );
  const steps = [
    {
      when: secondProofTime.toString(),
      instruction: `Start the second proving ${
        secondProof.value.inFridge.value ? " in the fridge" : ""
      }`,
    },
  ];
  const firstProofTime = subtractMinutes(
    secondProofTime,
    firstProof.value.duration.value
  );
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
    const body: BakeConfig = JSON.parse(event.body);
    const eatingTime = moment(body.target.value as string);
    const coolingTime = subtractMinutes(eatingTime, body.cooling.value);
    const bakingTime = subtractMinutes(coolingTime, body.baking.value);
    const preheatTime = subtractMinutes(bakingTime, body.preheat.value);
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
    switch (body.method.value) {
      case "fold": {
        const folds = generateFoldInstructions(
          (body as FoldConfig).numFolds.value as number,
          (body as FoldConfig).timeBetweenFolds.value as number,
          methodStepTime
        );
        methodStepTime = folds.methodStepTime;
        steps = steps.concat(folds.steps);
        const coldFermentationTime = subtractMinutes(
          methodStepTime,
          (body as FoldConfig).coldFermentation.value
        );
        steps.push({
          when: coldFermentationTime.toString(),
          instruction: "Put it in the fridge to cold ferment",
        });
        const bulkFermentationTime = subtractMinutes(
          coldFermentationTime,
          (body as FoldConfig).bulkFermentation.value
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
          (body as NoKneadConfig).numFolds.value as number,
          (body as NoKneadConfig).timeBetweenFolds.value as number,
          methodStepTime
        );
        methodStepTime = folds.methodStepTime;
        steps = steps.concat(folds.steps);
        const proofs = generateProvingInstructions(
          (body as KneadConfig).firstProof,
          (body as KneadConfig).secondProof,
          methodStepTime
        );
        methodStepTime = proofs.methodStepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
      case "knead": {
        const proofs = generateProvingInstructions(
          (body as KneadConfig).firstProof,
          (body as KneadConfig).secondProof,
          methodStepTime
        );
        methodStepTime = proofs.methodStepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
    }
    if (body.autolyse.value != null) {
      const autolyseTime = subtractMinutes(methodStepTime, body.autolyse.value);
      steps.push({
        when: autolyseTime.toString(),
        instruction: "Mix flour and water and leave to autolyse",
      });
      methodStepTime = autolyseTime.clone();
    }
    const feedTime = subtractMinutes(
      methodStepTime,
      (24 / (body.numFeedsPerDay.value as number)) * 60
    );
    steps.push({
      when: feedTime.toString(),
      instruction: `Feed the starter ${
        body.inFridge.value && "after taking it out of the fridge"
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
