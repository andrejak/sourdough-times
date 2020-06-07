import React from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  margin-top: 1rem;
  width: 100vw;
`;

const Footer: React.FC = () => (
  <Container>
    <hr />
    ©️ 2020 Andreja Kogovsek
  </Container>
);

export default Footer;
