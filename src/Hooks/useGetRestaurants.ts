import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Coordinate } from "../Context/MunchContext";

type YelpResponse = {
  alias: string;
  display_phone: string;
  distance: number;
  id: string;
  image_url: string;
  name: string;
  is_closed: boolean;
  rating: number;
  transaction: string[];
};

export type Restaurant = {
  alias: string;
  displayPhone: string;
  distance: number;
  id: string;
  imageURL: string;
  name: string;
  isClosed: boolean;
  rating: number;
  transaction: string[];
};

type Params = {
  food: string;
  coordinates: Coordinate;
};

async function fetchRestaurants(params: Params) {
  try {
    const config = {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_YELP_API_KEY}` },
    };

    const response = await axios.get(
      `https://api.yelp.com/v3/businesses/search?term=${params.food}&latitude=${params.coordinates.latitude}&longitude=${params.coordinates.longitude}&radius=40000&limit=50`,
      config
    );

    if (response.data && response.data.businesses) {
      return response.data.businesses;
    } else {
      return [];
    }
  } catch (error) {
    console.log("ERROR", error);
  }
}

export default function useGetRestaurants(params: Params) {
  return useQuery<Restaurant[], Error>({
    queryKey: ["yelpResults"],
    queryFn: async () => {
      const data = await fetchRestaurants({ ...params });

      const result: Restaurant[] =  data.map((datum: YelpResponse) => ({
        alias: datum.alias,
        displayPhone: datum.display_phone,
        distance: datum.distance,
        id: datum.id,
        imageURL: datum.image_url,
        name: datum.name,
        isClosed: datum.is_closed,
        rating: datum.rating,
        transaction: datum.transaction,
      }));

      return result;
    },
    enabled:
      params.food.length > 0 &&
      params.coordinates.latitude.length > 0 &&
      params.coordinates.longitude.length > 0,
  });
}
