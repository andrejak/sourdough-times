import React from "react";
import { BooleanFieldType } from "../../types";
import styled from "styled-components";

const HorizontalContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
`;

const Label = styled.label``;

const Input = styled.input`
  width: 40px;
`;

const CheckboxField = ({
  field,
  setValue,
}: {
  field: BooleanFieldType;
  setValue: (newValue: boolean) => void;
}): JSX.Element => (
  <HorizontalContainer>
    <Input
      type="checkbox"
      checked={field.value === true}
      onChange={() => setValue(!field.value)}
    ></Input>
    <Label>{field.label}</Label>
  </HorizontalContainer>
);

export default CheckboxField;
