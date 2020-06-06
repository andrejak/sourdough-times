import React from "react";
import { Step } from "./types";
import styled from "styled-components";
import Steps from "./components/Steps";
import ConfigForm from "./components/ConfigForm";
import "./styles/global.css";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100vw;
`;

const Page: React.FC = () => {
  const [result, setResult] = React.useState([] as Step[]);
  return (
    <Container>
      <ConfigForm setResult={(steps: Step[]) => setResult(steps)}></ConfigForm>
      <Steps steps={result} />
    </Container>
  );
};
export default Page;
