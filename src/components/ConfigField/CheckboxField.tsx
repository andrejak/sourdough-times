import React from "react";
import styled from "styled-components";
import { Field } from "formik";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding-right: 0.4rem;
`;

const Label = styled.label``;

const Input = styled(Field)`
  width: 20px;
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
    <Label htmlFor={id}>{label}</Label>
  </Container>
);

export default CheckboxField;
