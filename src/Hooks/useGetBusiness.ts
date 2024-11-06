import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Coordinate } from "../Context/MunchContext";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type YelpResponse = {
  name: string;
  id: string;
  photos: string[];
  url: string;
};

export type Business = {
  name: string;
  id: string;
  photos: string[];
  url: string;
};

type Params = {
  businessID: string;
};

// curl --request GET \
//      --url https://api.yelp.com/v3/businesses/business_id_or_alias \
//      --header 'accept: application/json'

async function fetchBusiness(
  params: Params
): Promise<YelpResponse | undefined> {
  try {
    const config = {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_YELP_API_KEY}` },
    };

    const response = await axios.get(
      `https://api.yelp.com/v3/businesses/${params.businessID}`,
      config
    );

    if (response.data) {
      return response.data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log("ERROR", error);
  }
}

export default function useGetBusinessInfo(params: Params) {
  return useQuery<Business, Error>({
    queryKey: ["business", params.businessID],
    queryFn: async () => {
      const data = await fetchBusiness({ ...params });

      const result: Business = data
        ? {
            name: data.name,
            id: data.id,
            photos: data.photos,
            url: data.url,
          }
        : { name: "", id: params.businessID, photos: [], url: "" };

      return result;
    },
    enabled: params.businessID.length > 0,
  });
}
