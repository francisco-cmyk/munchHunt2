import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import axios from "axios";

const { MAPS_API_KEY } = process.env;

export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  const latitude = event.queryStringParameters?.latitude;
  const longitude = event.queryStringParameters?.longitude;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_API_KEY}`
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
