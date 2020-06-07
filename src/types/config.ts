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
  displayUnit?: "min" | "h";
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

export type BaseConfig = {
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

export interface FoldConfig extends BaseConfig {
  numFolds: FieldType;
  timeBetweenFolds: FieldType;
  bulkFermentation: FieldType;
  coldFermentation: FieldType;
}

export interface KneadConfig extends BaseConfig {
  firstProof: ProofFieldType;
  secondProof: ProofFieldType;
}

export interface NoKneadConfig extends BaseConfig {
  numFolds: FieldType;
  timeBetweenFolds: FieldType;
  firstProof: ProofFieldType;
  secondProof: ProofFieldType;
}
