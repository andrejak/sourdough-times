import moment from "moment";

type Range<T> = {
  from: T;
  to: T;
};

type Method = "knead" | "noKnead";
export type BakeConfig = NoKneadConfig | KneadConfig;

export type Field = {
  label: string;
  help?: string;
  optional?: boolean;
  type: "boolean" | "number" | "datetime" | "duration" | "range" | "method";
  value:
    | boolean
    | number
    | moment.Moment
    | moment.Duration
    | Range<number>
    | Method
    | null;
};

type BaseConfig = {
  isFridged: Field;
  numFeedsPerDay: Field;
  target: Field;
  autolyse: Field;
  preheat: Field;
  baking: Field;
  cooling: Field;
  method: Field;
};

interface NoKneadConfig extends BaseConfig {
  numFolds: Field;
  coldFermentRange: Field;
  timeBetweenFolds: Field;
}

interface KneadConfig extends BaseConfig {
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
  isFridged: { label: "", help: "", type: "boolean", value: true },
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

export const initNoKneadConfig: NoKneadConfig = {
  method: { ...initMethod, value: "noKnead" },
  numFolds: { label: "Number of folds", type: "number", value: 4 },
  timeBetweenFolds: {
    label: "Time between folds",
    type: "duration",
    value: moment.duration(1, "hour"),
  },
  coldFermentRange: {
    label: "Cold fermentation",
    help: "Range in hours",
    type: "range",
    value: {
      from: 8,
      to: 24,
    },
  },
  ...initBaseConfig,
};

export const initState: BakeConfig = initKneadConfig;
