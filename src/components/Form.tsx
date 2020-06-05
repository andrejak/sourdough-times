import React from "react";
import { initState } from "../types";

const Form: React.FC = () => {
  const [input, setInput] = React.useState(initState);
  const [result, setResult] = React.useState("");
  return (
    <div style={{ maxWidth: "300px" }}>
      Form
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await fetch("/.netlify/functions/calculate", {
            body: JSON.stringify(input),
            method: "POST",
          });
          const data = await response.json();
          const newResult: string = data.result;
          setResult(newResult);
        }}
      >
        <label>Number of folds:</label>
        <input
          type="text"
          value={input.numFolds}
          onChange={(e) => {
            const parsed = parseInt(e.target.value);
            if (parsed) {
              setInput({ ...input, numFolds: parsed });
            }
          }}
        ></input>
        <input type="submit" value="Submit" />
      </form>
      <div>{result}</div>
    </div>
  );
};
export default Form;
