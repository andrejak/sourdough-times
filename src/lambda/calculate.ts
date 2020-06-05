import { Context, Callback, Handler, APIGatewayEvent } from "aws-lambda";
import { FormResponse, FormType } from "../types";

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  const params = event.queryStringParameters; // as FormType;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body: FormType = JSON.parse(event.body);
  const response: FormResponse = {
    statusCode: 200,
    body: JSON.stringify({
      msg: `Selected ${body ? body.numFolds : 3} folds`,
      params,
    }),
  };

  callback(undefined, response);
};

export { handler };
