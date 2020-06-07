import React from "react";
import styled from "styled-components";
import { ProofFieldType } from "../../types";
import CheckboxField from "./CheckboxField";
import RangeField from "./RangeField";

const HorizontalContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
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
    <RangeField
      field={field.value.duration}
      setValue={(newValue) =>
        setValue({
          ...field.value,
          duration: { ...field.value.duration, value: newValue },
        })
      }
    />
    <CheckboxField
      field={field.value.inFridge}
      setValue={(newValue) =>
        setValue({
          ...field.value,
          inFridge: { ...field.value.inFridge, value: newValue },
        })
      }
    />
  </HorizontalContainer>
);

export default ProofField;
