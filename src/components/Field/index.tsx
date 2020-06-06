import React from "react";
import styled from "styled-components";
import { FieldType } from "../../types";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 30px;
`;

const Field = ({
  field,
  setValue,
}: {
  field: FieldType;
  setValue: (newValue: number) => void;
}): JSX.Element => (
  <Container>
    <label>{field.label}</label>
    <Input
      type="text"
      value={field.value ? field.value.toString() : "Missing"}
      onChange={(e) => {
        const parsed = parseInt(e.target.value);
        if (parsed) {
          setValue(parsed);
        }
      }}
    ></Input>
  </Container>
);

export default Field;
