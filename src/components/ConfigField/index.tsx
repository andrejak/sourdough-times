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

const ConfigField = ({
  id,
  label,
  type,
  field,
}: {
  id: string;
  label: string;
  type: string;
  field?: FieldType;
}): JSX.Element => {
  const Component = mapTypeToComponent[type];
  return <Component id={id} label={label} field={field} />;
};

export default ConfigField;
