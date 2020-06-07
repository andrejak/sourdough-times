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
    console.log("hello");
    const body: FullConfig = JSON.parse(event.body);
    const eatingTime = moment(body.basicSection.target.value.toString());
    console.log("test", eatingTime);

    const coolingTime = subtractMinutes(
      eatingTime,
      body.bakingSection.cooling.value
    );
    const bakingTime = subtractMinutes(
      coolingTime,
      body.bakingSection.baking.value
    );
    const preheatTime = subtractMinutes(
      bakingTime,
      body.bakingSection.preheat.value
    );

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

    console.log("before");
    switch (body.basicSection.method) {
      case "fold": {
        const folds = generateFoldInstructions(
          body.foldingSection.numFolds.value as number,
          body.foldingSection.timeBetweenFolds.value as number,
          methodStepTime
        );
        methodStepTime = folds.methodStepTime;
        steps = steps.concat(folds.steps);
        const coldFermentationTime = subtractMinutes(
          methodStepTime,
          body.provingSection.firstProof.value
        );
        steps.push({
          when: coldFermentationTime.toString(),
          instruction: "Put it in the fridge to cold ferment",
        });
        const bulkFermentationTime = subtractMinutes(
          coldFermentationTime,
          body.provingSection.secondProof.value
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
          body.foldingSection.numFolds.value as number,
          body.foldingSection.timeBetweenFolds.value as number,
          methodStepTime
        );
        methodStepTime = folds.methodStepTime;
        steps = steps.concat(folds.steps);
        const proofs = generateProvingInstructions(
          body.provingSection.firstProof,
          body.provingSection.secondProof,
          methodStepTime
        );
        methodStepTime = proofs.methodStepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
      case "knead": {
        const proofs = generateProvingInstructions(
          body.provingSection.firstProof,
          body.provingSection.secondProof,
          methodStepTime
        );
        methodStepTime = proofs.methodStepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
    }
    console.log("after");

    if (body.prefermentSection.levain.value != null) {
      const levainTime = subtractMinutes(
        methodStepTime,
        body.prefermentSection.levain.value
      );
      steps.push({
        when: levainTime.toString(),
        instruction: "Mix flour and water and leave to autolyse",
      });
      methodStepTime = levainTime.clone();
    }
    if (body.prefermentSection.autolyse.value != null) {
      const autolyseTime = subtractMinutes(
        methodStepTime,
        body.prefermentSection.autolyse.value
      );
      steps.push({
        when: autolyseTime.toString(),
        instruction: "Mix flour and water and leave to autolyse",
      });
      methodStepTime = autolyseTime.clone();
    }

    const feedTime = subtractMinutes(
      methodStepTime,
      (24 / (body.basicSection.numFeedsPerDay.value as number)) * 60
    );
    steps.push({
      when: feedTime.toString(),
      instruction: `Feed the starter ${
        body.basicSection.inFridge.value && "after taking it out of the fridge"
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
