/* eslint-disable react/display-name */
import React from "react";
import {
  DateTimeFieldType,
  NumberFieldType,
  RangeFieldType,
} from "../../types";
import { Container } from "./Common";
import DateTimeField from "./DateTimeField";
import NumberField from "./NumberField";

const RangeField = ({
  id,
  label,
  field,
}: {
  id: string;
  label: string;
  field: RangeFieldType<number | moment.Moment>;
}): JSX.Element => {
  let FromComponent = () => <div />;
  let ToComponent = () => <div />;
  if (
    typeof field.value.from === "number" &&
    typeof field.value.to === "number"
  ) {
    const fromField: NumberFieldType = {
      type: "number",
      value: field.value.from,
      min: field.min,
      max: field.value.to,
      step: field.step,
      displayUnit: field.displayUnit,
      label: "to",
    };
    FromComponent = () => (
      <NumberField
        id={`${id}.from`}
        label={fromField.label}
        field={fromField}
      />
    );
    const toField: NumberFieldType = {
      type: "number",
      value: field.value.to,
      min: field.value.from,
      max: field.max,
      step: field.step,
      displayUnit: field.displayUnit,
      label,
    };
    ToComponent = () => (
      <NumberField id={`${id}.to`} label={toField.label} field={toField} />
    );
  } else {
    const fromField: DateTimeFieldType = {
      type: "datetime",
      value: field.value.from as moment.Moment,
      label: "from",
    };
    FromComponent = () => (
      <DateTimeField
        id={`${id}.from`}
        label={fromField.label}
        showTimeSelectOnly={true}
      />
    );
    const toField: DateTimeFieldType = {
      type: "datetime",
      value: field.value.to as moment.Moment,
      label: "to",
    };
    ToComponent = () => (
      <DateTimeField
        id={`${id}.to`}
        label={toField.label}
        showTimeSelectOnly={true}
      />
    );
  }

  return (
    <Container>
      {typeof field.value.from === "number" ? "from" : label}
      <FromComponent />
      <ToComponent />
    </Container>
  );
};

export default RangeField;
