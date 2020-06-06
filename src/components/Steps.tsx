import { Step } from "../types";
import React from "react";
import moment from "moment";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  min-width: 300px;
`;

const Steps = ({ steps }: { steps: Step[] }): JSX.Element => (
  <Container>
    {steps.map((step, index) => (
      <div key={index}>
        {moment(step.when).format("dddd HH:mm")}: {step.instruction}
      </div>
    ))}
  </Container>
);

export default Steps;
