import React from "react";
import { initState, Step } from "../types";
import moment from "moment";

const Form: React.FC = () => {
  const [input, setInput] = React.useState(initState);
  const [result, setResult] = React.useState([] as Step[]);
  return (
    <div style={{ maxWidth: "300px" }}>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await fetch("/.netlify/functions/calculate", {
            body: JSON.stringify(input),
            method: "POST",
          });
          if (response.ok) {
            const data: Step[] = await response.json();
            setResult(data);
          } else {
            console.log("Error", await response.json());
          }
        }}
      >
        <label>Number of feeds:</label>
        <input
          type="text"
          value={input.numFeedsPerDay}
          onChange={(e) => {
            const parsed = parseInt(e.target.value);
            if (parsed) {
              setInput({ ...input, numFeedsPerDay: parsed });
            }
          }}
        ></input>
        <input type="submit" value="Submit" />
      </form>
      <div>
        {result.map((step, index) => (
          <div key={index}>
            {moment(step.when).format("dddd hh:mm")}: {step.instruction}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Form;
