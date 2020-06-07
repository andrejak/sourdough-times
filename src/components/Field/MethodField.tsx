import React from "react";
import { Method } from "../../types";
import styled from "styled-components";

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 0.5rem;
`;

const Label = styled.label`
  font-size: 13px;
`;

const methodOptions: { [key in Method]: string } = {
  fold: "Fold",
  noKnead: "No knead",
  knead: "Knead",
};

const Option = styled.span<{ selected: boolean }>`
  cursor: pointer;
  border: 1px solid black;
  padding: 0.2rem;
  ${(props) => props.selected && "font-weight: bold"}
`;

const MethodField = ({
  field,
  setValue,
}: {
  field: Method;
  setValue: (newValue: Method) => void;
}): JSX.Element => (
  <VerticalContainer>
    <Label>{field}</Label>
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
  </VerticalContainer>
);

export default MethodField;
