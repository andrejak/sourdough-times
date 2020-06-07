import {
  FullConfig,
  BooleanFieldType,
  BasicSection,
  BakingSection,
  ShapingSection,
  PrefermentSection,
  Method,
  RangeFieldType,
  ProvingSection,
  FoldingSection,
  SectionId,
  Section,
} from "../types";
import moment from "moment";

export const minsInH = 60;

const fridgeField = (value: boolean): BooleanFieldType => ({
  label: "in the fridge",
  type: "boolean",
  value,
});

const hourRangeField = (from: number, to: number): RangeFieldType => ({
  label: "hours",
  type: "range",
  value: { from: from * minsInH, to: to * minsInH },
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
    instruction: "Eat the bread!",
  },
  numFeedsPerDay: {
    label: "How many times a day you usually feed it",
    help: "",
    type: "number",
    value: 1,
    min: 1,
    max: 4,
    instruction: "Feed the starter and leave it outside the fridge",
  },
  method,
});

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
    value: 2 * minsInH,
    min: 1 * minsInH,
    max: 24 * minsInH,
    step: 1 * minsInH,
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
    value: null,
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
    value: null,
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
  [SectionId.Basic]: initBasicSection("noKnead"),
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
  basicSection: initBasicSection("noKnead"),
  prefermentSection: initPrefermentSection,
  foldingSection: initFoldingSection(2),
  provingSection: initProvingSection(true, 8, 24),
  shapingSection: initShapingSection,
  bakingSection: initBakingSection,
};

export const initKneadConfig: FullConfig = {
  basicSection: initBasicSection("knead"),
  prefermentSection: initPrefermentSection,
  provingSection: initProvingSection(false, 1, 3),
  shapingSection: initShapingSection,
  bakingSection: initBakingSection,
};

export const initFoldConfig: FullConfig = {
  basicSection: initBasicSection("fold"),
  prefermentSection: initPrefermentSection,
  foldingSection: initFoldingSection(4),
  provingSection: initBulkFermentSection,
  bakingSection: initBakingSection,
};
