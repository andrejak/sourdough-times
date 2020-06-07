import { Step } from "../types";
import React from "react";
import moment from "moment";
import styled from "styled-components";
import { Heading } from "./Heading";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  min-width: 300px;
  width: 400px;
`;

const Step = styled.div`
  display: flex;
  padding: 0.5rem;
`;

const When = styled.span`
  min-width: 90px;
  font-weight: bold;
  margin-right: 0.5rem;
`;

const Steps = ({ steps }: { steps: Step[] }): JSX.Element => (
  <Container>
    <Heading>Generated schedule</Heading>
    {steps.map((step, index) => (
      <Step key={index}>
        <When>{moment(step.when).format("ddd HH:mm")}:</When>
        <span>{step.instruction}</span>
      </Step>
    ))}
  </Container>
);

export default Steps;
