import React from "react";
import { Step, SectionId, Method } from "../types";
import styled from "styled-components";
import MethodField from "./ConfigField/MethodField";
import Section from "./Section";
import Button from "./Button";
import { initSections, sectionsPerMethod } from "../state";
import { Formik, Form } from "formik";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 450px;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const ConfigForm = ({
  setResult,
}: {
  setResult: (steps: Step[]) => void;
}): JSX.Element => {
  const [method, setMethod] = React.useState("noKnead" as Method);

  return (
    <Container>
      <Formik
        initialValues={initSections}
        validate={() => {
          const errors = {};
          // TODO validation
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            setSubmitting(true);

            const config = { method, ...values };
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

            setSubmitting(false);
          }, 400);
        }}
      >
        {({ values }) => (
          <StyledForm>
            <MethodField field={method} setValue={setMethod} />
            {sectionsPerMethod[method].map((section: SectionId) => (
              <Section
                key={section}
                sectionId={section}
                section={values[section]}
              />
            ))}
            <Button />
          </StyledForm>
        )}
      </Formik>
    </Container>
  );
};
export default ConfigForm;
