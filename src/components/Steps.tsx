import moment from "moment";
import React from "react";
import styled from "styled-components";
import { Step } from "../types";
import { Heading } from "./Heading";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  min-width: 300px;
  width: 400px;
`;

const Step = styled.div`
  display: flex;
  padding: 8px;
`;

const When = styled.span`
  min-width: 110px;
  font-weight: bold;
  margin-right: 8px;
`;

const Steps = ({ steps }: { steps: Step[] }): JSX.Element => (
  <Container>
    <Heading>Generated schedule</Heading>
    {steps.map((step, index) => (
      <Step key={index}>
        <When>{moment(step.when).format("ddd HH:mm a")}:</When>
        <span>{step.instruction}</span>
      </Step>
    ))}
  </Container>
);

export default Steps;
