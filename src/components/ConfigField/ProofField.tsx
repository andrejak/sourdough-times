import React from "react";
import styled from "styled-components";
import { ProofFieldType } from "../../types";
import CheckboxField from "./CheckboxField";
import RangeField from "./RangeField";

const HorizontalContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 4px;
`;

const ProofField = ({
  id,
  field,
}: {
  id: string;
  field: ProofFieldType;
}): JSX.Element => (
  <HorizontalContainer>
    <RangeField
      id={`${id}.duration.value`}
      label={field.value.duration.label}
      field={field.value.duration}
    />
    <CheckboxField
      id={`${id}.inFridge.value`}
      label={field.value.inFridge.label}
    />
  </HorizontalContainer>
);

export default ProofField;
