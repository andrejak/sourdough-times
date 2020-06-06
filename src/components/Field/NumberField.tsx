import React from "react";
import styled from "styled-components";
import { NumericalFieldType } from "../../types";
import moment from "moment";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
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
    <label>{field.label}</label>
    <Input
      type="datetime-local"
      // <input type="date" name="myDate" min="2013-06-01" max="2013-08-31" step="7" id="myDate">
      value={field.value.toString()}
      onChange={(e) => setValue(moment(e.target.value))}
    ></Input>
  </Container>
);

const NumberField = ({
  field,
  setValue,
}: {
  field: NumericalFieldType;
  setValue: (newValue: number) => void;
}): JSX.Element => (
  <Container>
    <label>{field.label}</label>
    <Input
      type="number"
      min={field.min}
      max={field.max}
      step={field.step}
      value={field.value?.toString()} // TODO
      onChange={(e) => setValue(parseInt(e.target.value))}
    ></Input>
  </Container>
);

export default NumberField;
