import React from "react";
import { FieldType, ProofFieldType, OtherFieldType, Method } from "../../types";
import NumberField, { DatetimeField } from "./NumberField";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
`;

const Input = styled.input`
  width: 40px;
`;

const CheckboxField = ({
  field,
  setValue,
}: {
  field: OtherFieldType;
  setValue: (newValue: boolean) => void;
}): JSX.Element => (
  <Container>
    <label>{field.label}</label>
    <Input
      type="checkbox"
      checked={field.value === true}
      onChange={(e) => setValue(!e.target.checked)}
    ></Input>
  </Container>
);

const MethodField = ({
  field,
  setValue,
}: {
  field: OtherFieldType;
  setValue: (newValue: Method) => void;
}): JSX.Element => (
  <Container>
    <label>{field.label}</label>
    <select
      id="method"
      value={field.value as Method}
      onChange={(e) => setValue(e.target.value as Method)}
    >
      <option value="noKnead">No knead</option>
      <option value="fold">Fold</option>
      <option value="knead">Knead</option>
    </select>
  </Container>
);

const ProofField = ({
  field,
  setValue,
}: {
  field: ProofFieldType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (newValue: any) => void;
}): JSX.Element => (
  <Container>
    <CheckboxField field={field.value.inFridge} setValue={setValue} />
    <NumberField field={field.value.duration} setValue={setValue} />
  </Container>
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
