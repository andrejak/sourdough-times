import React from "react";
import { Method, SectionId } from "../types";
import { initSections } from "./";

// TODO un-nest state to prevent unnecessary re-renders
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useForm = () => {
  const [method, setMethod] = React.useState("fold" as Method);
  const sections = {};
  Object.values(SectionId).map((sectionId: SectionId) => {
    const [config, setConfig] = React.useState(initSections[sectionId]);
    sections[sectionId] = { config, setConfig };
  });

  return {
    method,
    setMethod,
    sections,
  };
};
