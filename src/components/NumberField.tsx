import React from "react";
import styled from "styled-components";
import { Field } from "../types";

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
  field: Field;
  setValue: (newValue: number) => void;
}): JSX.Element => (
  <Container>
    <label>{field.label}</label>
    <Input
      type="text"
      value={field.value.toString()}
      onChange={(e) => {
        const parsed = parseInt(e.target.value);
        if (parsed) {
          setValue(parsed);
        }
      }}
    ></Input>
  </Container>
);

export default NumberField;
