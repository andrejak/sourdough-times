import React from "react";
import { FieldType } from "../../types";
import NumberField from "./NumberField";
import CheckboxField from "./CheckboxField";
import RangeField from "./RangeField";
import DateTimeField from "./DateTimeField";
import ProofField from "./ProofField";

const mapTypeToComponent = {
  datetime: DateTimeField,
  number: NumberField,
  range: RangeField,
  boolean: CheckboxField,
  proof: ProofField,
};

const Field = ({
  field,
  setValue,
}: {
  field: FieldType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (newValue: any) => void;
}): JSX.Element => {
  const Component = mapTypeToComponent[field.type];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Component field={field as any} setValue={setValue} />;
};

export default Field;
