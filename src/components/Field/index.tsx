import React from "react";
import { FieldType, ProofFieldType } from "../../types";
import NumberField, { DatetimeField } from "./NumberField";
import styled from "styled-components";
import CheckboxField from "./CheckboxField";

const HorizontalContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
`;

const ProofField = ({
  field,
  setValue,
}: {
  field: ProofFieldType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (newValue: any) => void;
}): JSX.Element => (
  <HorizontalContainer>
    <CheckboxField
      field={field.value.inFridge}
      setValue={(newValue) =>
        setValue({
          ...field.value,
          inFridge: { ...field.value.inFridge, value: newValue },
        })
      }
    />
    {field.value.inFridge.value && (
      <NumberField
        field={field.value.duration}
        setValue={(newValue) =>
          setValue({
            ...field.value,
            duration: { ...field.value.duration, value: newValue },
          })
        }
      />
    )}
  </HorizontalContainer>
);

const mapTypeToComponent = {
  datetime: DatetimeField,
  number: NumberField,
  range: NumberField,
  duration: NumberField,
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
