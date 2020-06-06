import React from "react";
import styled from "styled-components";
import { NumericalFieldType, Range } from "../../types";
import moment from "moment";
import CheckboxField from "./CheckboxField";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  height: 40px;
`;

const Label = styled.label`
  font-size: 13px;
  padding: 0 0.5rem;
`;

const Input = styled.input`
  width: 40px;
`;

export const DatetimeField = ({
  field,
  setValue,
}: {
  field: NumericalFieldType;
  setValue: (newValue: moment.Moment) => void;
}): JSX.Element => (
  <Container>
    <Label>{field.label}</Label>
    <input
      type="datetime-local"
      // <input type="date" name="myDate" min="2013-06-01" max="2013-08-31" step="7" id="myDate">
      value={field.value.toString()}
      onChange={(e) => setValue(moment(e.target.value))}
    ></input>
  </Container>
);

const NumberField = ({
  field,
  setValue,
}: {
  field: NumericalFieldType;
  setValue: (newValue: number | moment.Duration | Range<number>) => void;
}): JSX.Element => {
  const [show, setShow] = React.useState(
    !field.optional || field.value === null
  );
  let value = field.min || 1;
  if (field.value) {
    switch (field.type) {
      case "number":
        value = field.value as number;
        break;
      case "duration":
        value = (field.value as moment.Duration).minutes(); // hours?
        break;
      case "range":
        value = (field.value as Range<number>).from;
        break;
    }
  }

  return (
    <Container>
      {field.optional && (
        <CheckboxField
          field={{ type: "boolean", value: show, label: field.label }}
          setValue={setShow}
        />
      )}
      {show && (
        <Container>
          <Input
            type={field.type === "range" ? "range" : "number"}
            min={field.min}
            max={field.max}
            step={field.step}
            value={value}
            onChange={(e) => {
              if (field.type === "range") {
                setValue({
                  from: parseInt(e.target.value),
                  to: parseInt(e.target.value),
                });
              } else if (field.type === "duration") {
                setValue(moment.duration(e.target.value, "minute"));
              } else {
                setValue(parseInt(e.target.value));
              }
            }}
          ></Input>
          {!field.optional && <Label>{field.label}</Label>}
        </Container>
      )}
    </Container>
  );
};

export default NumberField;
