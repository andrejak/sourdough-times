import React from "react";
import styled from "styled-components";

const Input = styled.input`
  align-self: center;
  background-color: lightgray;
  padding: 8px;
  margin-top: 16px;
  border: none;
  font-size: 16px;
  width: 200px;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background-color: lightblue;
    transition: all 100ms ease;
  }
`;

const Button: React.FC = () => (
  <Input type="submit" value="Generate instructions" />
);

export default Button;
