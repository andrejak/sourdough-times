import moment from "moment";

type Range<T> = {
  from: T;
  to: T;
};

export type Method = "fold" | "knead" | "noKnead";
export type BakeConfig = NoKneadConfig | KneadConfig | FoldConfig;

export type FieldType = NumericalFieldType | OtherFieldType | ProofFieldType;

type BaseFieldType = {
  label: string;
  help?: string;
  optional?: boolean;
};

export interface NumericalFieldType extends BaseFieldType {
  type: "number" | "duration" | "range" | "datetime";
  value:
    | number
    | moment.Duration
    | moment.Moment
    | Range<number | moment.Duration>
    | null;
  min?: number;
  max?: number;
  step?: number;
}

export interface ProofFieldType extends BaseFieldType {
  type: "proof";
  value: {
    inFridge: OtherFieldType;
    duration: NumericalFieldType;
  };
}

export interface OtherFieldType extends BaseFieldType {
  type: "boolean" | "method";
  value: boolean | Method;
}

type BaseConfig = {
  inFridge: FieldType;
  numFeedsPerDay: FieldType;
  target: FieldType;
  autolyse: FieldType;
  shaping: FieldType;
  preheat: FieldType;
  baking: FieldType;
  cooling: FieldType;
  method: FieldType;
};

interface FoldConfig extends BaseConfig {
  numFolds: FieldType;
  timeBetweenFolds: FieldType;
  bulkFermentation: FieldType;
  coldFermentation: FieldType;
}

interface KneadConfig extends BaseConfig {
  firstProof: FieldType;
  secondProof: FieldType;
}

interface NoKneadConfig extends BaseConfig {
  numFolds: FieldType;
  timeBetweenFolds: FieldType;
  firstProof: FieldType;
  secondProof: FieldType;
}

const initMethod: FieldType = {
  label: "Method",
  type: "method",
  value: "noKnead",
};

const fridgeField = (value: boolean): OtherFieldType => ({
  label: "Proof in fridge?",
  type: "boolean",
  value,
});

const hourRangeField = (from: number, to: number): NumericalFieldType => ({
  label: "How many hours?",
  type: "range",
  value: { from, to },
});

const initBaseConfig: BaseConfig = {
  method: initMethod,
  inFridge: fridgeField(true),
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
    value: { inFridge: fridgeField(false), duration: hourRangeField(1, 8) },
  },
  coldFermentation: {
    label: "Cold fermentation",
    help: "Range in hours",
    type: "proof",
    value: { inFridge: fridgeField(true), duration: hourRangeField(8, 24) },
  },
  ...initBaseConfig,
};

export const initState: BakeConfig = initKneadConfig;
