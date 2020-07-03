import React from "react";
import { Step, SectionId } from "../types";
import styled from "styled-components";
import MethodField from "./Field/MethodField";
import Section from "./Section";
import Button from "./Button";
import { FormContext } from "../state/context";
import { sectionsPerMethod } from "../state";
import produce from "immer";

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

const ConfigForm = ({
  setResult,
}: {
  setResult: (steps: Step[]) => void;
}): JSX.Element => {
  //const { method, setMethod, sections } = useForm();
  const { sections, setConfig } = React.useContext(FormContext);
  const method = sections[SectionId.Basic].method;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = sections;
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
        <MethodField
          field={method}
          setValue={(newValue) => {
            const newConfig = produce((draft) => {
              draft[SectionId.Basic].method = newValue;
            });
            setConfig(newConfig);
          }}
        />
        {sectionsPerMethod[method].map((section: SectionId) => (
          <Section key={section} sectionId={section} />
        ))}
        <Button />
      </Form>
    </Container>
  );
};
export default ConfigForm;
