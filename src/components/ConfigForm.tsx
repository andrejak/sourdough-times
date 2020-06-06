import React from "react";
import { Step, initState } from "../types";
import NumberField from "./Field/NumberField";
import styled from "styled-components";
import moment from "moment";
import Field from "./Field";

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
  const [config, setConfig] = React.useState(initState);
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
      {Object.keys(config).map((fieldId) => {
        const field = config[fieldId];
        console.log("f", fieldId, field);
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
      <label>{config.target.label}</label>
      <input
        type="datetime-local"
        value={config.target.value.toString()}
        onChange={(e) =>
          setConfig({
            ...config,
            target: { ...config.target, value: moment(e.target.value) },
          })
        }
      ></input>
      <NumberField
        field={config.numFeedsPerDay}
        setValue={(newValue: number) => {
          setConfig({
            ...config,
            numFeedsPerDay: { ...config.numFeedsPerDay, value: newValue },
          });
        }}
      />
      <input type="submit" value="Submit" />
    </Form>
  );
};
export default ConfigForm;
