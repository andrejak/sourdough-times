import { Field } from "formik";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding-right: 0.4rem;
`;

const Input = styled(Field)`
  width: 25px;
`;

const CheckboxField = ({
  id,
  label,
}: {
  id: string;
  label: string;
}): JSX.Element => (
  <Container>
    <Input type="checkbox" name={id}></Input>
    <label htmlFor={id}>{label}</label>
  </Container>
);

export default CheckboxField;
