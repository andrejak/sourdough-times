import {
  FieldType,
  NumberFieldType,
  ProofFieldType,
  RangeFieldType,
} from "./fields";

export type Method = "fold" | "knead" | "noKnead";

export enum SectionId {
  Basic = "Basic",
  Preferment = "Preferment",
  Folding = "Folding",
  Proving = "Proving",
  BulkFerment = "Bulk Ferment",
  Shaping = "Shaping",
  Baking = "Baking",
}

export type Section =
  | BasicSection
  | PrefermentSection
  | BakingSection
  | ShapingSection
  | ProvingSection
  | FoldingSection;

export type BasicSection = {
  target: FieldType;
  numFeedsPerDay: NumberFieldType;
  restrictedPeriods: RangeFieldType<moment.Moment>[];
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
  method: Method;
  basicSection: BasicSection;
  prefermentSection?: PrefermentSection;
  foldingSection?: FoldingSection;
  provingSection: ProvingSection;
  shapingSection?: ShapingSection;
  bakingSection: BakingSection;
};
