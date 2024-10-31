import axios from "axios";

export default async function getBusinesses(req: any, res: any) {
  const id = req.query.id;
  const config = {
    headers: { Authorization: `Bearer ${process.env.Y_API_KEY}` },
  };
  try {
    const data = await axios.get(
      `https://api.yelp.com/v3/businesses/${id}`,
      config
    );
    res.send(data.data);
  } catch (error) {
    console.log(error);
    res.status(405).end();
  }
}