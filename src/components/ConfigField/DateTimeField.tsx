import { Field, useField, useFormikContext } from "formik";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { Container, Label } from "./Common";

const StyledDatePicker = styled(DatePicker)`
  text-align: center;
  width: ${(props) => (props.showTimeSelectOnly ? "65" : "160")}px;
  border: none;
  border-bottom: 1px solid lightgray;
  margin-top: 3px;
`;

export const DateTimeField = ({
  id,
  label,
  showTimeSelectOnly,
}: {
  id: string;
  label: string;
  showTimeSelectOnly?: boolean;
}): JSX.Element => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({ name: id });

  return (
    <Container>
      <Label htmlFor={id}>{label}</Label>
      <Field
        name={id}
        component={() => (
          <StyledDatePicker
            {...field}
            name={id}
            selected={new Date(field.value)}
            onChange={(value) => setFieldValue(field.name, value)}
            dateFormat={showTimeSelectOnly ? "h:mm aa" : "MMMM d, yyyy h:mm aa"}
            showTimeSelect
            showTimeSelectOnly={showTimeSelectOnly}
          />
        )}
      />
    </Container>
  );
};

export default DateTimeField;
