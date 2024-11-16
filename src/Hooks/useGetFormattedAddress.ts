import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Coordinate } from "../Context/MunchContext";

async function fetchAddress(coordinates: Coordinate) {
  if (!coordinates.latitude && !coordinates.longitude) return;

  try {
    const url = "/.netlify/functions/getAddress";

    const response = await axios.get(url, {
      params: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    });
    if (response.data.results.length > 0) {
      const formattedAddress = response.data.results[0].formatted_address;
      return formattedAddress;
    }
  } catch (error) {
    toast.error("There was a problem gathering your location", {
      toastId: "fetchAddress",
    });
  }
}

export default function useGetFormattedAddress(coordinates: Coordinate) {
  return useQuery({
    queryKey: ["formattedAddress", coordinates],
    queryFn: async () => {
      const data = await fetchAddress(coordinates);
      return data;
    },
    enabled: !!(coordinates.latitude && coordinates.longitude),
  });
}
