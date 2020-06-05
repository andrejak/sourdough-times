import React from "react";
import ReactDOM from "react-dom";
import Form from "./components/Form";

const App = () => (
  <div style={{ textAlign: "center" }}>
    <Form />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));

/* eslint-disable */
if ((module as any).hot) {
  (module as any).hot.accept();
}
