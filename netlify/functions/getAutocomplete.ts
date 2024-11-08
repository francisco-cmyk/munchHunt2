import { APIGatewayEvent, Handler } from "aws-lambda";
import axios from "axios";

export const handler: Handler = async (event: APIGatewayEvent, context) => {
  const { input } = event.body ? JSON.parse(event.body) : "";
  const { MAPS_API_KEY } = process.env;

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: "An error occurred retrieving autocomplete",
      }),
    };
  }
};
