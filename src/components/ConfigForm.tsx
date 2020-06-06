import React from "react";
import {
  Step,
  initBaseConfig,
  OtherFieldType,
  BakeConfig,
  initKneadConfig,
  initNoKneadConfig,
  initFoldConfig,
  Method,
} from "../types";
import styled from "styled-components";
import Field from "./Field";
import MethodField from "./Field/MethodField";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const configs: { [key in Method]: BakeConfig } = {
  knead: initKneadConfig,
  noKnead: initNoKneadConfig,
  fold: initFoldConfig,
};

const ConfigForm = ({
  setResult,
}: {
  setResult: (steps: Step[]) => void;
}): JSX.Element => {
  const [method, setMethod] = React.useState(
    initBaseConfig.method.value as Method
  );
  const [config, setConfig] = React.useState(configs[method]);

  React.useEffect(() => {
    // TODO remove unneeded properties
    setConfig({ ...configs[method], ...config });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

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
    <Container>
      <MethodField
        field={{ label: "Method", type: "method", value: method }}
        setValue={setMethod}
      ></MethodField>
      <Form onSubmit={handleSubmit}>
        {Object.keys(config).map((fieldId) => {
          const field = config[fieldId];
          if (fieldId === "method") {
            return <span key={fieldId} />;
          }
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
    </Container>
  );
};
export default ConfigForm;
