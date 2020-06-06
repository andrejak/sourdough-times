import React from "react";
import { NumericalFieldType } from "../../types";
import moment from "moment";

const DatetimeField = ({
  field,
  setValue,
}: {
  field: NumericalFieldType;
  setValue: (newValue: moment.Moment) => void;
}): JSX.Element => (
  <>
    <label>{field.label}</label>
    <input
      type="datetime-local"
      // <input type="date" name="myDate" min="2013-06-01" max="2013-08-31" step="7" id="myDate">
      value={field.value.toString()}
      onChange={(e) => setValue(moment(e.target.value))}
    ></input>
  </>
);

export default DatetimeField;
