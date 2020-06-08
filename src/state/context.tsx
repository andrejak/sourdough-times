import React from "react";
import { initSections } from ".";

export const FormContext = React.createContext({
  sections: {},
  setConfig: undefined,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormProvider = ({ children }: { children: any }): any => {
  const [sections, setConfig] = React.useState(initSections);
  return (
    <FormContext.Provider
      value={{
        sections,
        setConfig,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
