import {
  FullConfig,
  BooleanFieldType,
  NumericalFieldType,
  BasicSection,
  BakingSection,
  PrefermentSection,
  Method,
} from "../types";
import moment from "moment";

export const minsInH = 60;

const fridgeField = (value: boolean): BooleanFieldType => ({
  label: "prove in fridge",
  type: "boolean",
  value,
});

const hourRangeField = (from: number, to: number): NumericalFieldType => ({
  label: "hours",
  type: "range",
  value: { from, to },
  min: 1 * minsInH,
  max: 48 * minsInH,
  step: minsInH,
  displayUnit: "h",
});

const initBasicSection = (method: Method): BasicSection => ({
  target: {
    label: "When do you want to eat the bread?",
    help: "",
    type: "datetime",
    value: moment().add(3, "d").set({ hour: 12, minute: 0 }),
  },
  inFridge: fridgeField(true),
  numFeedsPerDay: {
    label: "feeds per day",
    help: "",
    type: "number",
    value: 1,
    min: 1,
    max: 4,
  },
  method,
});

const initBakingSection: BakingSection = {
  preheat: {
    label: "minutes to preheat the oven",
    type: "duration",
    value: 20,
    min: 5,
    max: 60,
    step: 5,
  },
  baking: {
    label: "minutes to bake",
    type: "duration",
    value: 35,
    min: 20,
    max: 60,
  },
  cooling: {
    label: "minutes to cool",
    type: "duration",
    value: 120,
    min: 0,
    step: 30,
    optional: true,
  },
};

const initPrefermentSection: PrefermentSection = {
  autolyse: {
    label: "autolyse",
    help: "Mixing flour and water before adding salt",
    type: "duration",
    value: null,
    optional: true,
    min: 15,
    max: 60,
    step: 5,
  },
  levain: {
    label: "levaiin",
    help: "Mixing flour, water and starter before adding salt",
    type: "duration",
    value: null,
    optional: true,
    min: 15,
    max: 60,
    step: 5,
  },
};

const initShapingSection: ShapingSection = {
  shaping: {
    label: "minutes rest after shaping",
    help: "If you're not going straight from the fridge to the oven.",
    type: "duration",
    optional: true,
    value: 20,
    min: 10,
    max: 180,
    step: 10,
  },
};

export const initNoKneadConfig: FullConfig = {
  basic: initBasicSection("noKnead"),
  preferment: initPrefermentSection,
  shaping: initShapingSection,
  baking: initBakingSection,
  folding: {
    numFolds: { label: "folds", type: "number", value: 2 },
    timeBetweenFolds: {
      label: "minutes between folds",
      type: "duration",
      value: 30,
      min: 15,
      max: 60,
      step: 15,
    },
  },
  proving: {
    firstProof: {
      label: "First proof",
      help: "",
      type: "proof",
      value: { inFridge: fridgeField(true), duration: hourRangeField(12, 24) },
    },
    secondProof: {
      label: "Second proof",
      help: "",
      type: "proof",
      value: {
        inFridge: fridgeField(false),
        duration: hourRangeField(1, 3),
      },
    },
  },
};

export const initKneadConfig: FullConfig = {
  basic: initBasicSection("knead"),
  preferment: initPrefermentSection,
  shaping: initShapingSection,
  baking: initBakingSection,
  proving: {
    firstProof: {
      label: "First proof",
      help: "",
      type: "proof",
      value: { inFridge: fridgeField(false), duration: hourRangeField(1, 3) },
    },
    secondProof: {
      label: "Second proof",
      help: "",
      type: "proof",
      value: { inFridge: fridgeField(false), duration: hourRangeField(1, 3) },
    },
  },
};

export const initFoldConfig: FullConfig = {
  basic: initBasicSection("fold"),
  preferment: initPrefermentSection,
  baking: initBakingSection,
  folding: {
    numFolds: { label: "folds", type: "number", value: 4 },
    timeBetweenFolds: {
      label: "minutes between folds",
      type: "duration",
      value: 30,
      min: 15,
      max: 60,
      step: 15,
    },
  },
  proving: {
    bulkFermentation: {
      label: "Bulk fermentation",
      help: "Range in hours",
      type: "proof",
      optional: true,
      value: { inFridge: fridgeField(false), duration: hourRangeField(1, 8) },
    },
    coldFermentation: {
      label: "Cold fermentation",
      help: "Range in hours",
      type: "proof",
      value: { inFridge: fridgeField(true), duration: hourRangeField(8, 24) },
    },
  },
};
