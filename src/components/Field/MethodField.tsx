import React from "react";
import { Method } from "../../types";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: baseline;
  padding: 0.5rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
`;

const methodOptions: { [key in Method]: string } = {
  fold: "Fold",
  noKnead: "No knead",
  knead: "Knead",
};

const Option = styled.span<{ selected: boolean }>`
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "gray" : "lightgray")};
  border: 1px solid gray;
  padding: 0.2rem 0.5rem;

  &:hover {
    cursor: pointer;
    background-color: gray;
    transition: all 100ms ease;
  }
`;

const MethodField = ({
  field,
  setValue,
}: {
  field: Method;
  setValue: (newValue: Method) => void;
}): JSX.Element => (
  <Container>
    <Label>Method: </Label>
    <div>
      {Object.keys(methodOptions).map((method: Method) => (
        <Option
          key={method}
          selected={field === method}
          onClick={() => setValue(method)}
        >
          {methodOptions[method]}
        </Option>
      ))}
    </div>
  </Container>
);

export default MethodField;
