import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

/* eslint-disable */
if ((module as any).hot) {
  (module as any).hot.accept();
}
