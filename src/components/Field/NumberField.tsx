import React from "react";
import styled from "styled-components";
import { NumericalFieldType } from "../../types";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 30px;
`;

const NumberField = ({
  field,
  setValue,
}: {
  field: NumericalFieldType;
  setValue: (newValue: number) => void;
}): JSX.Element => (
  <Container>
    <label>{field.label}</label>
    <Input
      type="number"
      min={field.min}
      max={field.max}
      step={field.step}
      value={field.value?.toString()} // TODO
      onChange={(e) => setValue(parseInt(e.target.value))}
    ></Input>
  </Container>
);

export default NumberField;
