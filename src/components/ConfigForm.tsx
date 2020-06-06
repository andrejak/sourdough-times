import React from "react";
import { Step, initState } from "../types";
import styled from "styled-components";
import Field from "./Field";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const ConfigForm = ({
  setResult,
}: {
  setResult: (steps: Step[]) => void;
}): JSX.Element => {
  const [config, setConfig] = React.useState(initState);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/.netlify/functions/calculate", {
      body: JSON.stringify(config),
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
      {Object.keys(config).map((fieldId) => {
        const field = config[fieldId];
        return (
          <Field
            key={fieldId}
            field={field}
            setValue={(newValue: number) => {
              setConfig({
                ...config,
                [fieldId]: { ...config[fieldId], value: newValue },
              });
            }}
          />
        );
      })}
      <input type="submit" value="Submit" />
    </Form>
  );
};
export default ConfigForm;
