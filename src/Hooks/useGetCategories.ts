import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Coordinate } from "../Context/MunchContext";
import { toast } from "react-toastify";
import { foodChoices } from "../foodChoices";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type YelpResponse = {
  alias: string;
  coordinates: Coordinates;
  categories: {
    alias: string;
    title: string;
  }[];
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
  phone: string;
  rating: number;
  transactions: string[];
};

type Params = {
  coordinates: Coordinate;
};

async function fetchCategories(
  params: Params
): Promise<YelpResponse[] | undefined> {
  try {
    const response = await axios.get("/.netlify/functions/getCategories", {
      params: {
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
      "There was a problem finding food options in your area. Please choose from default list. ",
      {
        toastId: "fetchCategories",
      }
    );
  }
}

export default function useGetCategories(params: Params) {
  return useQuery<string[], Error>({
    queryKey: ["categories", params.coordinates],
    queryFn: async () => {
      let data = await fetchCategories({ ...params });
      data = data ?? [];

      const availableCategories = new Set();
      data.forEach((business) => {
        business.categories.forEach((category) => {
          availableCategories.add(category.title); // Collect unique category titles
        });
      });

      let nearbyFoodOptions = foodChoices.filter((option) =>
        availableCategories.has(option)
      );

      nearbyFoodOptions =
        nearbyFoodOptions.length > 0 ? nearbyFoodOptions : foodChoices;

      return nearbyFoodOptions;
    },
    enabled:
      params.coordinates.latitude.length > 0 &&
      params.coordinates.longitude.length > 0,
  });
}
