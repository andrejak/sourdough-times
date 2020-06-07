import React from "react";
import { Step, SectionId } from "../types";
import styled from "styled-components";
import MethodField from "./Field/MethodField";
import Section from "./Section";
import Button from "./Button";
import { useForm } from "../state/useForm";
import { sectionsPerMethod } from "../state";

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
  const { method, setMethod, sections } = useForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = sections; // TODO
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
        {sectionsPerMethod[method].map((section: SectionId) => (
          <Section
            key={section}
            sectionId={section}
            section={sections[section].config}
            setConfig={sections[section].setConfig}
          />
        ))}
        <Button />
      </Form>
    </Container>
  );
};
export default ConfigForm;
