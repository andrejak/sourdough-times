import moment from "moment";
import {
  BakingSection,
  BasicSection,
  BooleanFieldType,
  FoldingSection,
  FullConfig,
  Method,
  PrefermentSection,
  ProvingSection,
  RangeFieldType,
  Section,
  SectionId,
  ShapingSection,
} from "../types";

export const dateFormat = "YYYY-MM-DD";
export const timeFormat = "HH:mm";
export const datetimeFormat = `${dateFormat} ${timeFormat}`;

const fridgeField = (value: boolean): BooleanFieldType => ({
  label: "in the fridge",
  type: "boolean",
  value,
});

const hourRangeField = (from: number, to: number): RangeFieldType => ({
  label: "hours",
  type: "range",
  value: { from: from, to: to },
  min: 1,
  max: 48,
  step: 1,
  displayUnit: "h",
});

const initBasicSection: BasicSection = {
  target: {
    label: "When do you want to eat the bread?",
    help: "",
    type: "datetime",
    value: moment().add(3, "d").set({ hour: 12, minute: 0 }),
    instruction: "Eat the bread!",
  },
  numFeedsPerDay: {
    label: "feedings per day",
    help: "",
    type: "number",
    value: 1,
    min: 1,
    max: 4,
    instruction: "Feed the starter and leave it outside the fridge.",
  },
  restrictedPeriods: [
    {
      type: "range",
      label: "Work",
      value: {
        from: moment("13:00", timeFormat),
        to: moment("15:00", timeFormat),
      },
    },
    {
      label: "Sleep",
      type: "range",
      value: {
        from: moment("23:00", timeFormat).subtract(1, "day"),
        to: moment("07:00", timeFormat),
      },
    },
  ],
};

const initBakingSection: BakingSection = {
  preheat: {
    label: "minutes to preheat the oven",
    type: "number",
    value: 20,
    min: 5,
    max: 60,
    step: 5,
    instruction: "Preheat the oven",
  },
  baking: {
    label: "minutes to bake",
    type: "number",
    value: 35,
    min: 20,
    max: 60,
    instruction: "Put the bread in the oven",
  },
  cooling: {
    label: "wait for it to cool",
    type: "number",
    value: 2,
    min: 1,
    max: 24,
    step: 1,
    optional: true,
    instruction: "Take it out and let it cool",
    displayUnit: "h",
  },
};

const initPrefermentSection: PrefermentSection = {
  autolyse: {
    label: "autolyse",
    help: "Mixing flour and water before adding salt",
    type: "number",
    value: ("" as unknown) as number,
    optional: true,
    min: 15,
    max: 60,
    step: 5,
    instruction: "Mix flour and water and leave to autolyse",
  },
  levain: {
    label: "levain",
    help: "Mixing flour, water and starter before adding salt",
    type: "number",
    value: ("" as unknown) as number,
    optional: true,
    min: 15,
    max: 60,
    step: 5,
    instruction: "Mix flour, water and starter for the levain",
  },
};

const initShapingSection: ShapingSection = {
  shaping: {
    label: "rest after shaping",
    help: "If you're not going straight from the fridge to the oven.",
    type: "number",
    optional: true,
    value: 20,
    min: 10,
    max: 180,
    step: 10,
  },
};

const initFoldingSection = (num: number): FoldingSection => ({
  numFolds: { label: "folds", type: "number", value: num, min: 0, max: 10 },
  timeBetweenFolds: {
    label: "minutes between folds",
    type: "number",
    value: 30,
    min: 15,
    max: 60,
    step: 15,
    instruction: "Perform another fold",
  },
});

const initProvingSection = (
  fridge: boolean,
  from: number,
  to: number
): ProvingSection => ({
  firstProof: {
    label: "First proof",
    help: "",
    type: "proof",
    value: {
      inFridge: fridgeField(fridge),
      duration: hourRangeField(from, to),
    },
    instruction: "Start the first proving",
  },
  secondProof: {
    label: "Second proof",
    help: "",
    type: "proof",
    value: {
      inFridge: fridgeField(false),
      duration: hourRangeField(1, 3),
    },
    instruction: "Start the second proving",
  },
});

const initBulkFermentSection: ProvingSection = {
  firstProof: {
    label: "Bulk fermentation",
    help: "Range in hours",
    type: "proof",
    value: { inFridge: fridgeField(false), duration: hourRangeField(1, 8) },
    instruction: "Leave it out to bulk ferment",
  },
  secondProof: {
    label: "Cold fermentation",
    help: "Range in hours",
    type: "proof",
    value: { inFridge: fridgeField(true), duration: hourRangeField(8, 24) },
    instruction: "Put it in the fridge to cold ferment",
  },
};

export const initSections: { [key in SectionId]: Section } = {
  [SectionId.Basic]: initBasicSection,
  [SectionId.Preferment]: initPrefermentSection,
  [SectionId.Folding]: initFoldingSection(2),
  [SectionId.Proving]: initProvingSection(true, 8, 24),
  [SectionId.Shaping]: initShapingSection,
  [SectionId.Baking]: initBakingSection,
  [SectionId.BulkFerment]: initBulkFermentSection,
};

const pre = [SectionId.Basic, SectionId.Preferment];
const post = [SectionId.Shaping, SectionId.Baking];
export const sectionsPerMethod: { [key in Method]: SectionId[] } = {
  noKnead: [...pre, SectionId.Folding, SectionId.Proving, ...post],
  knead: [...pre, SectionId.Proving, ...post],
  fold: [...pre, SectionId.Folding, SectionId.BulkFerment, SectionId.Baking],
};

export const initNoKneadConfig: FullConfig = {
  method: "noKnead",
  basicSection: initBasicSection,
  prefermentSection: initPrefermentSection,
  foldingSection: initFoldingSection(2),
  provingSection: initProvingSection(true, 8, 24),
  shapingSection: initShapingSection,
  bakingSection: initBakingSection,
};

export const initKneadConfig: FullConfig = {
  method: "knead",
  basicSection: initBasicSection,
  prefermentSection: initPrefermentSection,
  provingSection: initProvingSection(false, 1, 3),
  shapingSection: initShapingSection,
  bakingSection: initBakingSection,
};

export const initFoldConfig: FullConfig = {
  method: "fold",
  basicSection: initBasicSection,
  prefermentSection: initPrefermentSection,
  foldingSection: initFoldingSection(4),
  provingSection: initBulkFermentSection,
  bakingSection: initBakingSection,
};
