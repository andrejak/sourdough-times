import { Field, useFormikContext } from "formik";
import React from "react";
import styled from "styled-components";
import { NumberFieldType } from "../../types";
import { Container } from "./Common";

const Label = styled.label`
  padding: 0 8px;
`;

const Input = styled(Field)`
  width: 40px;
  margin: 0 4px;
  border: none;
  border-bottom: 1px solid lightgray;
  text-align: center;
`;

const NumberField = ({
  id,
  label,
  field,
}: {
  id: string;
  label: string;
  field: NumberFieldType;
}): JSX.Element => {
  const { setFieldValue } = useFormikContext();
  const [show, setShow] = React.useState(
    !field.optional || field.value !== (("" as unknown) as number)
  );

  return (
    <Container>
      {field.optional && (
        <>
          <input
            type="checkbox"
            checked={show}
            onChange={() => {
              if (show) {
                setFieldValue(id, ("" as unknown) as number);
              } else {
                setFieldValue(id, field.min);
              }
              setShow(!show);
            }}
          />
          <Label>{label}</Label>
        </>
      )}
      {show && (
        <Container>
          {field.optional && "for"}
          <Input
            type={"number"}
            name={id}
            //placeholder={field.min}
            min={field.min}
            max={field.max}
            step={field.step}
          ></Input>
          {!field.optional && <Label htmlFor={id}>{label}</Label>}
          {field.optional && (field.displayUnit || "minutes")}
        </Container>
      )}
    </Container>
  );
};

export default NumberField;
