import React from "react";
import { Step, initState } from "../types";
import NumberField from "./NumberField";
import styled from "styled-components";
import moment from "moment";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const ConfigForm = ({
  setResult,
}: {
  setResult: (steps: Step[]) => void;
}): JSX.Element => {
  const [input, setInput] = React.useState(initState);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/.netlify/functions/calculate", {
      body: JSON.stringify(input),
      method: "POST",
    });
    const data: Step[] = await response.json();
    if (response.ok) {
      setResult(data);
    } else {
      console.log("Error", data);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label>{input.target.label}</label>
      <input
        type="datetime-local"
        value={input.target.value.toString()}
        onChange={(e) =>
          setInput({
            ...input,
            target: { ...input.target, value: moment(e.target.value) },
          })
        }
      ></input>
      <NumberField
        field={input.numFeedsPerDay}
        setValue={(newValue: number) => {
          setInput({
            ...input,
            numFeedsPerDay: { ...input.numFeedsPerDay, value: newValue },
          });
        }}
      />
      <input type="submit" value="Submit" />
    </Form>
  );
};
export default ConfigForm;
