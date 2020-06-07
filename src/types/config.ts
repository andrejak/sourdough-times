import moment from "moment";

export type Range<T> = {
  from: T;
  to: T;
};

export type Method = "fold" | "knead" | "noKnead";

export type FieldType =
  | DateTimeFieldType
  | NumberFieldType
  | BooleanFieldType
  | ProofFieldType;

type BaseFieldType = {
  label: string;
  help?: string;
  optional?: boolean;
  instruction?: string;
};

export interface DateTimeFieldType extends BaseFieldType {
  type: "datetime";
  value: moment.Moment;
}

export interface NumberFieldType extends BaseFieldType {
  type: "number";
  value: number | null;
  min?: number;
  max?: number;
  step?: number;
  displayUnit?: "min" | "h";
}

export interface RangeFieldType extends BaseFieldType {
  type: "range";
  value: Range<number>;
  min?: number;
  max?: number;
  step?: number;
  displayUnit?: "min" | "h";
}

export interface ProofFieldType extends BaseFieldType {
  type: "proof";
  value: {
    inFridge: BooleanFieldType;
    duration: RangeFieldType;
  };
}

export interface BooleanFieldType extends BaseFieldType {
  type: "boolean";
  value: boolean;
}

export type BasicSection = {
  method: Method;
  target: FieldType;
  numFeedsPerDay: NumberFieldType;
};

export type PrefermentSection = {
  autolyse: NumberFieldType;
  levain: NumberFieldType;
};

export type BakingSection = {
  preheat: NumberFieldType;
  baking: NumberFieldType;
  cooling: NumberFieldType;
};

export type ShapingSection = {
  shaping: NumberFieldType;
};

export type ProvingSection = {
  firstProof: ProofFieldType;
  secondProof: ProofFieldType;
};

export interface FoldingSection {
  numFolds: NumberFieldType;
  timeBetweenFolds: NumberFieldType;
}

export type FullConfig = {
  basicSection: BasicSection;
  prefermentSection?: PrefermentSection;
  foldingSection?: FoldingSection;
  provingSection: ProvingSection;
  shapingSection?: ShapingSection;
  bakingSection: BakingSection;
};
