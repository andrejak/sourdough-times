export type FormResponse = {
  statusCode: number;
  body: string;
};

export type FormType = {
  numFolds: number;
};

export const initState: FormType = {
  numFolds: 4,
};
