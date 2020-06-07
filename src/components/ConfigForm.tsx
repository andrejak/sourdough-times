import React from "react";
import { Step, FullConfig, Method } from "../types";
import { initKneadConfig, initNoKneadConfig, initFoldConfig } from "../state";
import styled from "styled-components";
import Field from "./Field";
import MethodField from "./Field/MethodField";
import { Heading } from "./Heading";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 450px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div``;

const Button = styled.input`
  align-self: center;
  background-color: lightgray;
  padding: 0.5rem;
  border: none;
  font-size: 16px;
  width: 200px;

  &:hover {
    cursor: pointer;
    background-color: gray;
    transition: all 100ms ease;
  }
`;

const configs: { [key in Method]: FullConfig } = {
  knead: initKneadConfig,
  noKnead: initNoKneadConfig,
  fold: initFoldConfig,
};

const ConfigForm = ({
  setResult,
}: {
  setResult: (steps: Step[]) => void;
}): JSX.Element => {
  const [method, setMethod] = React.useState("fold" as Method);
  const [config, setConfig] = React.useState(configs[method]);

  React.useEffect(() => {
    // Keep chosen values from previous config, but remove irrelevant fields and add new ones
    // OR: reset completely?
    const newConfig: Partial<FullConfig> = {};
    const oldKeys = Object.keys(config);
    const newKeys = Object.keys(configs[method]);
    for (const key of newKeys) {
      if (oldKeys.includes(key)) {
        newConfig[key] = config[key];
      } else {
        newConfig[key] = configs[method][key];
      }
    }
    newConfig.basicSection.method = method;

    setConfig(newConfig as FullConfig);
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
      <Form onSubmit={handleSubmit}>
        <MethodField field={method} setValue={setMethod}></MethodField>
        {Object.keys(config).map((section) => (
          <Section key={section}>
            {section != "basicSection" && (
              <Heading>{section.replace("Section", "").toUpperCase()}</Heading>
            )}
            {Object.keys(config[section]).map((fieldId) => {
              const field = config[section][fieldId];
              if (fieldId === "method") {
                return <span key={fieldId} />;
              }
              return (
                <Field
                  key={fieldId}
                  field={field}
                  setValue={(newValue: number) => {
                    const newConfig = {
                      ...config,
                      [section]: {
                        ...config[section],
                        [fieldId]: {
                          ...config[section][fieldId],
                          value: newValue,
                        },
                      },
                    };
                    setConfig(newConfig);
                  }}
                />
              );
            })}
          </Section>
        ))}
        <Button type="submit" value="Generate instructions" />
      </Form>
    </Container>
  );
};
export default ConfigForm;
