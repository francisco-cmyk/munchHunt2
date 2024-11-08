import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import axios from "axios";

export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  const { MAPS_API_KEY } = process.env;

  const address = event.queryStringParameters?.address;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: MAPS_API_KEY,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
