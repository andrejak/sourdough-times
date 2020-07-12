import { APIGatewayEvent } from "aws-lambda";
import {
  FormResponse,
  FullConfig,
  Step,
  ProofFieldType,
  NumberFieldType,
  SectionId,
  RangeFieldType,
} from "../types";
import moment from "moment";
import * as _ from "lodash";
import { timeFormat, dateFormat, datetimeFormat } from "../state";

type Period = { from: moment.Moment; to: moment.Moment };
type Info = { stepTime: moment.Moment; steps: Step[] };

const midnight = moment("24:00", timeFormat).subtract(1, "day");

const subtractMinutes = (time: moment.Moment, value: number) =>
  time.clone().subtract(value, "minutes");

const nextValidTarget = (
  target: moment.Moment,
  restrictedPeriods: Period[]
) => {
  let result = target;
  const justTime = moment(target.format(timeFormat), timeFormat);
  for (const period of restrictedPeriods) {
    if (justTime.isBetween(period.from, period.to)) {
      const justDate = midnight.isBetween(period.from, period.to)
        ? moment(target.subtract(1, "day")).format(dateFormat)
        : target.format(dateFormat);
      result = moment(
        justDate + " " + subtractMinutes(period.from, 5).format(timeFormat),
        datetimeFormat
      );
    }
  }
  return result;
};

const generateStep = (
  field: NumberFieldType,
  stepTime: moment.Moment,
  restrictedPeriods: Period[]
) => {
  const target = nextValidTarget(
    subtractMinutes(stepTime, field.value),
    restrictedPeriods
  );
  return {
    stepTime: target.clone(),
    step: {
      when: target.toISOString(),
      instruction: field.instruction,
    },
  };
};

const getValidSequence = (
  stepTime: moment.Moment,
  spacings: number[],
  restrictedPeriods: Period[]
) => {
  let times: moment.Moment[] = spacings.map((item: number) =>
    subtractMinutes(stepTime, item)
  );
  let invalidTime: moment.Moment | undefined = _.find(
    times,
    (time: moment.Moment) => nextValidTarget(time, restrictedPeriods) != time
  );
  while (invalidTime) {
    const stepTime = nextValidTarget(invalidTime, restrictedPeriods).add(
      spacings[0],
      "minute"
    );
    times = spacings.map((item: number) => subtractMinutes(stepTime, item));
    invalidTime = _.find(
      times,
      (time: moment.Moment) => nextValidTarget(time, restrictedPeriods) != time
    );
  }
  return times;
};

const generateFoldInstructions = (
  numFolds: number,
  timeBetweenFolds: number,
  stepTime: moment.Moment,
  restrictedPeriods: Period[]
): Info => {
  const foldTimes = getValidSequence(
    stepTime,
    _.range(numFolds).map((idx: number) => idx * timeBetweenFolds),
    restrictedPeriods
  );

  const steps = foldTimes.map((foldTime: moment.Moment) => ({
    when: foldTime.toISOString(),
    instruction: "Perform another fold",
  }));
  stepTime = foldTimes[foldTimes.length - 1].clone();

  return {
    stepTime,
    steps,
  };
};

const generateProvingStep = (
  proof: ProofFieldType,
  stepTime: moment.Moment,
  restrictedPeriods: Period[]
): Step => {
  const proofFrom = proof.value.duration.value.from;
  const proofTime = nextValidTarget(
    subtractMinutes(stepTime, proofFrom),
    restrictedPeriods
  );
  const limit = subtractMinutes(stepTime, proof.value.duration.value.to);
  let instruction = proof.instruction;
  if (proof.value.inFridge.value || proofTime.isBefore(limit)) {
    instruction += " (in the fridge)";
  }
  return {
    when: proofTime.toISOString(),
    instruction,
  };
};

const generateProvingInstructions = (
  firstProof: ProofFieldType,
  secondProof: ProofFieldType,
  stepTime: moment.Moment,
  restrictedPeriods: Period[]
): Info => {
  const secondStep = generateProvingStep(
    secondProof,
    stepTime,
    restrictedPeriods
  );
  const firstStep = generateProvingStep(
    firstProof,
    moment(secondStep.when),
    restrictedPeriods
  );
  return {
    stepTime: moment(firstStep.when),
    steps: [secondStep, firstStep],
  };
};

const handler = async (event: APIGatewayEvent): Promise<FormResponse> => {
  try {
    const body: FullConfig = JSON.parse(event.body);
    const restrictedBoundaries = body[SectionId.Basic].restrictedPeriods.map(
      (period: RangeFieldType<moment.Moment>) => ({
        from: moment(period.value.from).format(timeFormat),
        to: moment(period.value.to).format(timeFormat),
      })
    );
    const restrictedPeriods: Period[] = restrictedBoundaries.map(
      ({ from, to }) => ({
        from:
          from > to
            ? moment(from, timeFormat).subtract(1, "day")
            : moment(from, timeFormat),
        to: moment(to, timeFormat),
      })
    );
    // TODO: make sure restrictions apply for all relevant days, not just one

    const eatingTime = moment(body[SectionId.Basic].target.value.toString());
    let steps: Step[] = [
      {
        when: eatingTime.toISOString(),
        instruction: body[SectionId.Basic].target.instruction,
      },
    ];

    const coolingTime = body[SectionId.Baking].cooling.value;
    const bakingTime = body[SectionId.Baking].baking.value;
    // TODO: for noKnead,include folding times
    const times = getValidSequence(
      eatingTime,
      [
        coolingTime,
        coolingTime + bakingTime,
        coolingTime + bakingTime + body[SectionId.Baking].preheat.value,
      ],
      restrictedPeriods
    );
    steps.push({
      when: times[0].toISOString(),
      instruction: body[SectionId.Baking].cooling.instruction,
    });
    steps.push({
      when: times[1].toISOString(),
      instruction: body[SectionId.Baking].baking.instruction,
    });
    steps.push({
      when: times[2].toISOString(),
      instruction: body[SectionId.Baking].preheat.instruction,
    });
    // eslint-disable-next-line prefer-const
    let stepTime = times[2];

    switch (body.method) {
      case "fold": {
        const proofs = generateProvingInstructions(
          body[SectionId.BulkFerment].firstProof,
          body[SectionId.BulkFerment].secondProof,
          stepTime,
          restrictedPeriods
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        const folds = generateFoldInstructions(
          body[SectionId.Folding].numFolds.value as number,
          body[SectionId.Folding].timeBetweenFolds.value as number,
          stepTime,
          restrictedPeriods
        );
        stepTime = folds.stepTime;
        steps = steps.concat(folds.steps);
        break;
      }
      case "noKnead": {
        const folds = generateFoldInstructions(
          body[SectionId.Folding].numFolds.value as number,
          body[SectionId.Folding].timeBetweenFolds.value as number,
          stepTime,
          restrictedPeriods
        );
        stepTime = folds.stepTime;
        steps = steps.concat(folds.steps);
        const proofs = generateProvingInstructions(
          body[SectionId.Proving].firstProof,
          body[SectionId.Proving].secondProof,
          stepTime,
          restrictedPeriods
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
      case "knead": {
        const proofs = generateProvingInstructions(
          body[SectionId.Proving].firstProof,
          body[SectionId.Proving].secondProof,
          stepTime,
          restrictedPeriods
        );
        stepTime = proofs.stepTime;
        steps = steps.concat(proofs.steps);
        break;
      }
    }

    if (body[SectionId.Preferment].levain.value !== "") {
      const { stepTime: levainTime, step: levainStep } = generateStep(
        body[SectionId.Preferment].levain,
        stepTime,
        restrictedPeriods
      );
      steps.push(levainStep);
      stepTime = levainTime.clone();
    }
    if (body[SectionId.Preferment].autolyse.value !== "") {
      const { stepTime: autolyseTime, step: autolyseStep } = generateStep(
        body[SectionId.Preferment].autolyse,
        stepTime,
        restrictedPeriods
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
