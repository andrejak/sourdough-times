import React from "react";
import { Step } from "./types";
import styled from "styled-components";
import Steps from "./components/Steps";
import ConfigForm from "./components/ConfigForm";
import "./styles/global.css";
import Footer from "./components/Footer";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100vh;
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100vw;
`;

const App: React.FC = () => {
  const [result, setResult] = React.useState([] as Step[]);
  return (
    <Page>
      <Container>
        <ConfigForm
          setResult={(steps: Step[]) => setResult(steps)}
        ></ConfigForm>
        <Steps steps={result} />
      </Container>
      <Footer />
    </Page>
  );
};
export default App;
