import { APIGatewayEvent } from "aws-lambda";
import { FormResponse, BakeConfig, Step } from "../types";

const handler = async (event: APIGatewayEvent): Promise<FormResponse> => {
  try {
    const body: BakeConfig = JSON.parse(event.body);
    const steps: Step[] = [
      { when: body.target.value.toString(), instruction: "Eat the bread!" },
    ];
    return {
      statusCode: 200,
      body: JSON.stringify(steps),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

export { handler };
