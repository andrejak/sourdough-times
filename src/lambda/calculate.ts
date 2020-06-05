import { APIGatewayEvent } from "aws-lambda";
import { FormResponse, FormType } from "../types";

const handler = async (event: APIGatewayEvent): Promise<FormResponse> => {
  try {
    const body: FormType = JSON.parse(event.body);
    const result = `Selected ${body ? body.numFolds : 3} folds`;
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

export { handler };
