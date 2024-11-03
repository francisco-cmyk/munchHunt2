import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Coordinate } from "../Context/MunchContext";

export default function useGetCoordinatesFromAddress() {
  return useMutation<Coordinate, Error, string>({
    mutationKey: ["getCoordinates"],
    mutationFn: async (address: string) => {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: address,
            key: import.meta.env.VITE_MAPS_API_KEY,
          },
        }
      );

      const location = response.data.results[0].geometry.location;

      let result: Coordinate = {
        latitude: "",
        longitude: "",
      };

      if (
        typeof location.lat === "number" &&
        typeof location.lng === "number"
      ) {
        result = {
          latitude: location.lat.toString(),
          longitude: location.lng.toString(),
        };
      }

      return result;
    },
    onError: (error) => {
      console.log("Error getting coordinates from address");
    },
  });
}
