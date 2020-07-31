/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Section, SectionId } from "../types";
import Field from "./ConfigField";
import { Heading } from "./Heading";

const Section = ({
  sectionId,
  section,
}: {
  sectionId: SectionId;
  section: Section;
}): JSX.Element => (
  <div>
    {sectionId != SectionId.Basic && (
      <Heading>{sectionId.toString().replace("Section", "")}</Heading>
    )}
    {Object.keys(section).map((fieldId) => {
      const field = section[fieldId];
      if (fieldId === "method") {
        return <span key={fieldId} />;
      } else if (Array.isArray(field)) {
        // TODO: Subsection name?
        // TODO: "Add another" and "Remove" buttons
        return field.map((elem, idx) => (
          <Field
            key={idx}
            id={`${sectionId}.${fieldId}[${idx}].value`}
            label={elem.label}
            type={elem.type}
            field={elem}
          />
        ));
      }
      return (
        <Field
          key={fieldId}
          id={`${sectionId}.${fieldId}.value`}
          label={field.label}
          type={field.type}
          field={field}
        />
      );
    })}
  </div>
);

export default Section;
