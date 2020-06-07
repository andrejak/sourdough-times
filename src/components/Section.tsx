/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Field from "./Field";
import { Heading } from "./Heading";
import produce from "immer";
import { SectionId } from "../types";

const Section = ({
  sectionId,
  section,
  setConfig,
}: {
  sectionId: SectionId;
  section: any;
  setConfig: (newValue: any) => void;
}): JSX.Element => (
  <div>
    {sectionId != SectionId.Basic && (
      <Heading>
        {sectionId.toString().replace("Section", "").toUpperCase()}
      </Heading>
    )}
    {Object.keys(section).map((fieldId) => {
      const field = section[fieldId];
      if (fieldId === "method") {
        return <span key={fieldId} />;
      }
      return (
        <Field
          key={fieldId}
          field={field}
          setValue={(newValue: any) => {
            const newConfig = produce((draft) => {
              draft[fieldId].value = newValue;
            });
            setConfig(newConfig);
          }}
        />
      );
    })}
  </div>
);
export default Section;
