import moment from "moment";

export type Range<T> = {
  from: T;
  to: T;
};

export type Method = "fold" | "knead" | "noKnead";

export type FieldType = NumericalFieldType | BooleanFieldType | ProofFieldType;

type BaseFieldType = {
  label: string;
  help?: string;
  optional?: boolean;
};

export interface NumericalFieldType extends BaseFieldType {
  type: "number" | "duration" | "range" | "datetime";
  value: number | moment.Moment | Range<number> | null;
  min?: number;
  max?: number;
  step?: number;
  displayUnit?: "min" | "h";
}

export interface ProofFieldType extends BaseFieldType {
  type: "proof";
  value: {
    inFridge: BooleanFieldType;
    duration: NumericalFieldType;
  };
}

export interface BooleanFieldType extends BaseFieldType {
  type: "boolean";
  value: boolean;
}

export type BasicSection = {
  method: Method;
  target: FieldType;
  numFeedsPerDay: NumericalFieldType;
};

export type PrefermentSection = {
  autolyse: NumericalFieldType;
  levain: NumericalFieldType;
};

export type BakingSection = {
  preheat: NumericalFieldType;
  baking: NumericalFieldType;
  cooling: NumericalFieldType;
};

export type ShapingSection = {
  shaping: NumericalFieldType;
};

export type ProvingSection = {
  firstProof: ProofFieldType;
  secondProof: ProofFieldType;
};

export interface FoldingSection {
  numFolds: NumericalFieldType;
  timeBetweenFolds: NumericalFieldType;
}

export type FullConfig = {
  basicSection: BasicSection;
  prefermentSection?: PrefermentSection;
  foldingSection?: FoldingSection;
  provingSection: ProvingSection;
  shapingSection?: ShapingSection;
  bakingSection: BakingSection;
};
