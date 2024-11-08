import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Coordinate } from "../Context/MunchContext";
import { toast } from "react-toastify";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type YelpResponse = {
  alias: string;
  coordinates: Coordinates;
  display_phone: string;
  distance: number;
  id: string;
  image_url: string;
  is_closed: boolean;
  location: {
    display_address: string[];
  };
  name: string;
  price: string;
  rating: number;
  transactions: string[];
};

export type Restaurant = {
  alias: string;
  coordinates: Coordinates;
  displayAddress: string;
  displayPhone: string;
  distance: number;
  id: string;
  imageURL: string;
  isClosed: boolean;
  name: string;
  price: string;
  rating: number;
  transactions: string[];
};

type Params = {
  food: string;
  coordinates: Coordinate;
};

async function fetchRestaurants(
  params: Params
): Promise<YelpResponse[] | undefined> {
  try {
    const response = await axios.get("/.netlify/functions/getRestaurants", {
      params: {
        food: params.food,
        latitude: params.coordinates.latitude,
        longitude: params.coordinates.longitude,
      },
    });

    if (response.data && response.data.businesses) {
      return response.data.businesses;
    } else {
      return [];
    }
  } catch (error) {
    toast.error(
      "There was a problem finding restaurant options. Please try again.",
      {
        toastId: "fetchRestaurant",
      }
    );
  }
}

export default function useGetRestaurants(params: Params) {
  return useQuery<Restaurant[], Error>({
    queryKey: ["yelpResults", params],
    queryFn: async () => {
      const data = await fetchRestaurants({ ...params });

      const result: Restaurant[] = (data ?? []).map((datum: YelpResponse) => ({
        alias: datum.alias,
        coordinates: datum.coordinates,
        displayAddress: datum.location.display_address.join(),
        displayPhone: datum.display_phone,
        distance: datum.distance,
        id: datum.id,
        imageURL: datum.image_url,
        isClosed: datum.is_closed,
        name: datum.name,
        price: datum.price,
        rating: datum.rating,
        transactions: datum.transactions,
      }));

      return result;
    },
    enabled:
      params.food.length > 0 &&
      params.coordinates.latitude.length > 0 &&
      params.coordinates.longitude.length > 0,
  });
}
