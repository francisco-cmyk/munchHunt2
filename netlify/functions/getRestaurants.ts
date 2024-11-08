import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import axios from "axios";

export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  const { YELP_API_KEY } = process.env;

  const food = event.queryStringParameters?.food;
  const latitude = event.queryStringParameters?.latitude;
  const longitude = event.queryStringParameters?.longitude;

  try {
    const config = {
      headers: { Authorization: `Bearer ${YELP_API_KEY}` },
    };

    const response = await axios.get(
      `https://api.yelp.com/v3/businesses/search?term=${food}&latitude=${latitude}&longitude=${longitude}&radius=40000&limit=50`,
      config
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
