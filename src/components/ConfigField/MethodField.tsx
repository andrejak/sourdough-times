import React from "react";
import styled from "styled-components";
import { Method } from "../../types";
import { Label } from "./Common";

const Container = styled.div`
  display: flex;
  align-items: baseline;
  padding: 8px 0;
`;

const methodOptions: { [key in Method]: string } = {
  fold: "Fold",
  noKnead: "No knead",
  knead: "Knead",
};

const Option = styled.span<{ selected: boolean; index: number }>`
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "lightgray" : "white")};
  border: 1px solid lightgray;
  padding: 4px 8px;
  ${(props) => props.index === 0 && "border-radius: 4px 0 0 4px;"}
  ${(props) =>
    props.index === Object.keys(methodOptions).length - 1 &&
    "border-radius: 0 4px 4px 0;"}

  &:hover {
    cursor: pointer;
    background-color: lightblue;
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
      {Object.keys(methodOptions).map((method: Method, index) => (
        <Option
          key={method}
          selected={field === method}
          onClick={() => setValue(method)}
          index={index}
        >
          {methodOptions[method]}
        </Option>
      ))}
    </div>
  </Container>
);

export default MethodField;
