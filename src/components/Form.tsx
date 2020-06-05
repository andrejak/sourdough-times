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
          //e.stopPropagation();
          const response = await fetch("/.netlify/functions/calculate", {
            body: JSON.stringify(input),
            method: "POST",
          });
          console.log("cx", response);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data = await response?.json();
          console.log("got", data);
          setResult(JSON.stringify(data));
        }}
        // action="/.netlify/functions/hello_name"
      >
        <label>Number of folds:</label>
        <input
          type="text"
          value={input.numFolds}
          onChange={(e) => {
            const parsed = parseInt(e.target.value);
            if (parsed) {
              setInput({ numFolds: parsed, ...input });
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
