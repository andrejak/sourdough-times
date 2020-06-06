import React from "react";
import { FieldType, ProofFieldType, OtherFieldType, Method } from "../../types";
import NumberField from "./NumberField";
import DatetimeField from "./DatetimeField";

const CheckboxField = ({
  field,
  setValue,
}: {
  field: OtherFieldType;
  setValue: (newValue: boolean) => void;
}): JSX.Element => (
  <>
    <label>{field.label}</label>
    <input
      type="checkbox"
      checked={field.value === true}
      onChange={(e) => setValue(!e.target.checked)}
    ></input>
  </>
);

const MethodField = ({
  field,
  setValue,
}: {
  field: OtherFieldType;
  setValue: (newValue: Method) => void;
}): JSX.Element => (
  <>
    <label>{field.label}</label>
    <input
      type="checkbox"
      checked={field.value === true}
      onChange={() => setValue("knead")}
    ></input>
  </>
);

const ProofField = ({
  field,
  setValue,
}: {
  field: ProofFieldType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (newValue: any) => void;
}): JSX.Element => (
  <>
    <label>{field.label}</label>
    <input
      type="checkbox"
      checked={field.value.inFridge.value === true}
      onChange={(e) => setValue(!e.target.value)}
    ></input>
  </>
);

const mapTypeToComponent = {
  datetime: DatetimeField,
  number: NumberField,
  range: NumberField,
  duration: NumberField,
  boolean: CheckboxField,
  method: MethodField,
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
