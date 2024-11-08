import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Coordinate } from "../Context/MunchContext";
import { toast } from "react-toastify";

export default function useGetCoordinatesFromAddress() {
  return useMutation<Coordinate, Error, string>({
    mutationKey: ["getCoordinates"],
    mutationFn: async (address: string) => {
      const response = await axios.get("/.netlify/functions/getCoordinates", {
        params: {
          address: address,
        },
      });

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
      toast.error(
        "There was a problem gathering coordinates from your address. Please refresh the page.",
        {
          toastId: "fetchCoordinates",
        }
      );
    },
  });
}
