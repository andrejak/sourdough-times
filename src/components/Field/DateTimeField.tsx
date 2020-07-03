import React from "react";
import styled from "styled-components";
import { DateTimeFieldType } from "../../types";
import moment from "moment";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 40px;
`;

const Label = styled.label`
  padding: 0 0.5rem;
`;

const DateTimeContainer = styled.div`
  padding: 0 0.5rem;
`;

export const DateTimeField = ({
  field,
  setValue,
}: {
  field: DateTimeFieldType;
  setValue: (newValue: moment.Moment) => void;
}): JSX.Element => {
  const date = field.value.format("YYYY-MM-DD");
  const time = field.value.format("HH:mm");
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

export default DateTimeField;
