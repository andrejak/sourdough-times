import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 30px;
`;

const NumberField = ({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (newValue: number) => void;
}): JSX.Element => (
  <Container>
    <label>{label}</label>
    <Input
      type="text"
      value={value}
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
