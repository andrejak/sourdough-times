export * from "./config";

export type FormResponse = {
  statusCode: number;
  body: string;
};

export type Step = {
  when: string;
  instruction: string;
};
