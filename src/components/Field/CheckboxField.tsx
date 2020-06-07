import React from "react";
import { BooleanFieldType } from "../../types";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding-right: 0.4rem;
`;

const Label = styled.label``;

const Input = styled.input`
  width: 20px;
`;

const CheckboxField = ({
  field,
  setValue,
}: {
  field: BooleanFieldType;
  setValue: (newValue: boolean) => void;
}): JSX.Element => (
  <Container>
    <Input
      type="checkbox"
      checked={field.value === true}
      onChange={() => setValue(!field.value)}
    ></Input>
    <Label>{field.label}</Label>
  </Container>
);

export default CheckboxField;
