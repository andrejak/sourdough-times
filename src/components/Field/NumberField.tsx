import React from "react";
import styled from "styled-components";
import { NumberFieldType } from "../../types";
import CheckboxField from "./CheckboxField";
import { minsInH } from "../../state";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 40px;
`;

const Label = styled.label`
  padding: 0 0.5rem;
`;

const Input = styled.input`
  width: 40px;
  margin: 0 0.5rem;
`;

const convertToUnit = (value: number, unit: "min" | "h" | undefined) => {
  if (unit === "h") {
    return value / minsInH;
  }
  return value;
};

const NumberField = ({
  field,
  setValue,
}: {
  field: NumberFieldType;
  setValue: (newValue: number) => void;
}): JSX.Element => {
  const [show, setShow] = React.useState(
    !field.optional || field.value !== null
  );
  const value = convertToUnit(field.value || field.min || 0, field.displayUnit);
  const multiplier = field.displayUnit === "h" ? 60 : 1;
  console.log("rerender", value);

  return (
    <Container>
      {field.optional && (
        <CheckboxField
          field={{ type: "boolean", value: show, label: field.label }}
          setValue={(checked) => {
            if (show) {
              setValue(null);
            } else {
              setValue(value * multiplier);
            }
            setShow(checked);
          }}
        />
      )}
      {show && (
        <Container>
          {field.optional && "for"}
          <Input
            type={"number"}
            min={convertToUnit(field.min, field.displayUnit)}
            max={convertToUnit(field.max, field.displayUnit)}
            step={convertToUnit(field.step, field.displayUnit)}
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value) * multiplier)}
          ></Input>
          {!field.optional && <Label>{field.label}</Label>}
          {field.optional && (field.displayUnit || "minutes")}
        </Container>
      )}
    </Container>
  );
};

export default NumberField;
