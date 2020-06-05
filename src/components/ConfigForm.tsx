import React from "react";
import { Step, initState } from "../types";
import NumberField from "./NumberField";
import styled from "styled-components";

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

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await fetch("/.netlify/functions/calculate", {
          body: JSON.stringify(input),
          method: "POST",
        });
        if (response.ok) {
          const data: Step[] = await response.json();
          setResult(data);
        } else {
          console.log("Error", await response.json());
        }
      }}
    >
      <NumberField
        label={"Number of feeds per day usually:"}
        value={input.numFeedsPerDay}
        setValue={(newValue: number) => {
          setInput({ ...input, numFeedsPerDay: newValue });
        }}
      />
      <input type="submit" value="Submit" />
    </Form>
  );
};
export default ConfigForm;
