import moment from "moment";

type Range<T> = {
  from: T;
  to: T;
};

type Method = "fold" | "knead" | "noKnead";
export type BakeConfig = NoKneadConfig | KneadConfig | FoldConfig;

type Proof = {
  inFridge: boolean;
  length: moment.Duration | Range<number> | Range<moment.Duration>;
};

export type Field = {
  label: string;
  help?: string;
  optional?: boolean;
  type:
    | "boolean"
    | "number"
    | "datetime"
    | "duration"
    | "range"
    | "method"
    | "proof";
  value:
    | boolean
    | number
    | moment.Moment
    | moment.Duration
    | Range<number>
    | Method
    | Proof
    | null;
};

type BaseConfig = {
  inFridge: Field;
  numFeedsPerDay: Field;
  target: Field;
  autolyse: Field;
  shaping: Field;
  preheat: Field;
  baking: Field;
  cooling: Field;
  method: Field;
};

interface FoldConfig extends BaseConfig {
  numFolds: Field;
  timeBetweenFolds: Field;
  bulkFermentation: Field;
  coldFermentation: Field;
}

interface KneadConfig extends BaseConfig {
  firstProof: Field;
  secondProof: Field;
}

interface NoKneadConfig extends BaseConfig {
  numFolds: Field;
  timeBetweenFolds: Field;
  firstProof: Field;
  secondProof: Field;
}

const initMethod: Field = {
  label: "Method",
  type: "method",
  value: "noKnead",
};

const initBaseConfig: BaseConfig = {
  method: initMethod,
  inFridge: { label: "", help: "", type: "boolean", value: true },
  numFeedsPerDay: { label: "", help: "", type: "number", value: 1 },
  target: {
    label: "When do you want to eat the bread?",
    help: "",
    type: "datetime",
    value: moment().add(3, "d").set({ hour: 12, minute: 0 }),
  },
  autolyse: {
    label: "Autolyse",
    help: "Mixing flour and water before adding salt",
    type: "duration",
    value: null,
    optional: true,
  },
  shaping: {
    label: "Rest time after shaping",
    help: "If you're not going straight from the fridge to the oven.",
    type: "duration",
    optional: true,
    value: moment.duration(15, "minute"),
  },
  preheat: {
    label: "Time to preheat the oven",
    type: "duration",
    value: moment.duration(20, "minute"),
  },
  baking: {
    label: "Baking time",
    type: "duration",
    value: moment.duration(35, "minute"),
  },
  cooling: {
    label: "Cooling time",
    type: "duration",
    value: moment.duration(2, "hour"),
  },
};

export const initNoKneadConfig: NoKneadConfig = {
  method: { ...initMethod, value: "noKnead" },
  numFolds: { label: "Number of folds", type: "number", value: 2 },
  timeBetweenFolds: {
    label: "Time between folds",
    type: "duration",
    value: moment.duration(30, "minute"),
  },
  firstProof: {
    label: "First proof",
    help: "",
    type: "proof",
    value: { inFridge: true, length: { from: 12, to: 24 } },
  },
  secondProof: {
    label: "Second proof",
    help: "",
    type: "proof",
    value: { inFridge: false, length: moment.duration(2, "hour") },
  },
  ...initBaseConfig,
};

export const initKneadConfig: KneadConfig = {
  method: { ...initMethod, value: "knead" },
  firstProof: {
    label: "First proof",
    help: "",
    type: "duration",
    value: moment.duration(3, "hour"),
  },
  secondProof: {
    label: "Second proof",
    help: "",
    type: "duration",
    value: moment.duration(3, "hour"),
  },
  ...initBaseConfig,
};

export const initFoldConfig: FoldConfig = {
  method: { ...initMethod, value: "fold" },
  numFolds: { label: "Number of folds", type: "number", value: 4 },
  timeBetweenFolds: {
    label: "Time between folds",
    type: "duration",
    value: moment.duration(1, "hour"),
  },
  bulkFermentation: {
    label: "Bulk fermentation",
    help: "Range in hours",
    type: "proof",
    optional: true,
    value: { inFridge: false, length: { from: 1, to: 8 } },
  },
  coldFermentation: {
    label: "Cold fermentation",
    help: "Range in hours",
    type: "proof",
    value: { inFridge: true, length: { from: 8, to: 24 } },
  },
  ...initBaseConfig,
};

export const initState: BakeConfig = initKneadConfig;
