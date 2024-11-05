import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Coordinate = {
  latitude: string;
  longitude: string;
};

async function fetchAddress(coordinates: Coordinate) {
  if (!coordinates.latitude && !coordinates.longitude) return;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
      coordinates.latitude
    },${coordinates.longitude}&key=${import.meta.env.VITE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      const formattedAddress = response.data.results[0].formatted_address;
      return formattedAddress;
    }
  } catch (error) {
    console.log("ERROR", error);
    alert(
      "Sorry could not find your location, please add your location in the input field."
    );
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