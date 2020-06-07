import React from "react";
import styled from "styled-components";
import { RangeFieldType, Range, NumberFieldType } from "../../types";
import NumberField from "./NumberField";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 40px;
`;
const RangeField = ({
  field,
  setValue,
}: {
  field: RangeFieldType;
  setValue: (newValue: Range<number>) => void;
}): JSX.Element => {
  const fromField: NumberFieldType = {
    type: "number",
    value: field.value.from,
    min: field.min,
    max: field.value.to,
    step: field.step,
    displayUnit: field.displayUnit,
    label: "to",
  };
  const toField: NumberFieldType = {
    type: "number",
    value: field.value.to,
    min: field.value.from,
    max: field.max,
    step: field.step,
    displayUnit: field.displayUnit,
    label: field.label,
  };

  return (
    <Container>
      <Container>
        from
        <NumberField
          field={fromField}
          setValue={(num) =>
            setValue({
              from: num,
              to: field.value.to,
            })
          }
        />
        <NumberField
          field={toField}
          setValue={(num) =>
            setValue({
              from: field.value.from,
              to: num,
            })
          }
        />
      </Container>
    </Container>
  );
};

export default RangeField;
