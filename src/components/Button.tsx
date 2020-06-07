import React from "react";
import styled from "styled-components";

const Input = styled.input`
  align-self: center;
  background-color: lightgray;
  padding: 0.5rem;
  border: none;
  font-size: 16px;
  width: 200px;

  &:hover {
    cursor: pointer;
    background-color: gray;
    transition: all 100ms ease;
  }
`;

const Button = () => <Input type="submit" value="Generate instructions" />;

export default Button;
