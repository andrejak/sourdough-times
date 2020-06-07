import React from "react";
import styled from "styled-components";
import { NumericalFieldType, Range } from "../../types";
import moment from "moment";
import CheckboxField from "./CheckboxField";
import { minsInH } from "../../state";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 0.5rem;
  height: 40px;
`;

const Label = styled.label`
  padding: 0 0.5rem;
`;

const Input = styled.input`
  width: 40px;
  margin: 0 0.5rem;
`;

const DateTimeContainer = styled.div`
  padding: 0 0.5rem;
`;

export const DatetimeField = ({
  field,
  setValue,
}: {
  field: NumericalFieldType;
  setValue: (newValue: moment.Moment) => void;
}): JSX.Element => {
  const date = (field.value as moment.Moment).format("YYYY-MM-DD");
  const time = (field.value as moment.Moment).format("hh:mm");
  console.log(date, time);
  return (
    <Container>
      <Label>{field.label}</Label>
      <DateTimeContainer>
        <input
          type="date"
          value={date}
          onChange={(e) => setValue(moment(e.target.value + " " + time))}
          required
        ></input>
        <input
          type="time"
          value={time}
          onChange={(e) => setValue(moment(date + " " + e.target.value))}
          required
        ></input>
      </DateTimeContainer>
    </Container>
  );
};

const NumberField = ({
  field,
  setValue,
}: {
  field: NumericalFieldType;
  setValue: (newValue: number | Range<number>) => void;
}): JSX.Element => {
  const [show, setShow] = React.useState(
    !field.optional || field.value !== null
  );
  let value = field.min || 1;
  if (field.value) {
    value = field.value as number;
    if (field.type === "range") {
      value = (field.value as Range<number>).from;
    }
  }

  return (
    <Container>
      {field.optional && (
        <CheckboxField
          field={{ type: "boolean", value: show, label: field.label }}
          setValue={(checked) => {
            if (show) {
              setValue(null);
            } else {
              setValue(value);
            }
            setShow(checked);
          }}
        />
      )}
      {show && (
        <Container>
          {field.optional && "for"}
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
              } else {
                setValue(parseInt(e.target.value));
              }
            }}
          ></Input>
          {!field.optional && (
            <Label>
              {field.type === "range" && value / minsInH} {field.label}
            </Label>
          )}
          {field.optional && "minutes"}
        </Container>
      )}
    </Container>
  );
};

export default NumberField;
