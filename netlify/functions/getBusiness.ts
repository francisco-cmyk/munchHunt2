import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import axios from "axios";

export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  const { YELP_API_KEY } = process.env;
  const businessID = event.queryStringParameters?.businessID;

  try {
    const config = {
      headers: { Authorization: `Bearer ${YELP_API_KEY}` },
    };

    const response = await axios.get(
      `https://api.yelp.com/v3/businesses/${businessID}`,
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
