import moment from "moment";

export type Range<T> = {
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
  label: "Prove in fridge",
  type: "boolean",
  value,
});

const hourRangeField = (from: number, to: number): NumericalFieldType => ({
  label: "How many hours?",
  type: "range",
  value: { from, to },
  min: 1,
  max: 48,
});

const initBaseConfig: BaseConfig = {
  target: {
    label: "When do you want to eat the bread?",
    help: "",
    type: "datetime",
    value: moment().add(3, "d").set({ hour: 12, minute: 0 }),
  },
  inFridge: fridgeField(true),
  numFeedsPerDay: {
    label: "Feeds per day",
    help: "",
    type: "number",
    value: 1,
    min: 1,
    max: 4,
  },
  method: initMethod,
  autolyse: {
    label: "Autolyse",
    help: "Mixing flour and water before adding salt",
    type: "duration",
    value: null,
    optional: true,
    min: 15,
    max: 60,
    step: 5,
  },
  shaping: {
    label: "Rest time after shaping",
    help: "If you're not going straight from the fridge to the oven.",
    type: "duration",
    optional: true,
    value: moment.duration(20, "minute"),
    min: 10,
    max: 180,
    step: 10,
  },
  preheat: {
    label: "minutes to preheat the oven",
    type: "duration",
    value: moment.duration(20, "minute"),
    min: 5,
    max: 60,
    step: 5,
  },
  baking: {
    label: "minutes to bake",
    type: "duration",
    value: moment.duration(35, "minute"),
    min: 20,
    max: 60,
  },
  cooling: {
    label: "hours to cool",
    type: "duration",
    value: moment.duration(2, "hour"),
    optional: true,
  },
};

export const initNoKneadConfig: NoKneadConfig = {
  method: { ...initMethod, value: "noKnead" },
  numFolds: { label: "Number of folds", type: "number", value: 2 },
  timeBetweenFolds: {
    label: "Time between folds",
    type: "duration",
    value: moment.duration(30, "minute"),
    min: 15,
    max: 60,
    step: 15,
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
    type: "proof",
    value: { inFridge: fridgeField(false), duration: hourRangeField(1, 3) },
  },
  secondProof: {
    label: "Second proof",
    help: "",
    type: "proof",
    value: { inFridge: fridgeField(false), duration: hourRangeField(1, 3) },
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
    min: 15,
    max: 60,
    step: 15,
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
