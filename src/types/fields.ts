import moment from "moment";

export type Range<T> = {
  from: T;
  to: T;
};

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
