import React from "react";
import styled from "styled-components";
import { Field, useFormikContext, useField } from "formik";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 40px;
`;

const Label = styled.label`
  padding: 0 0.5rem;
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
          <DatePicker
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
