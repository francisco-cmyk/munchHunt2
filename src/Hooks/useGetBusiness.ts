import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Coordinate } from "../Context/MunchContext";
import { toast } from "react-toastify";

type YelpResponse = {
  name: string;
  id: string;
  categories: { name: string; title: string }[];
  photos: string[];
  url: string;
  hours: {
    hours_type: string;
    is_open_now: boolean;
    open: {
      day: number;
      end: string;
      is_overnight: boolean;
      start: string;
    }[];
  }[];
};

export type Business = {
  name: string;
  id: string;
  categories: { name: string; title: string }[];
  photos: string[];
  url: string;
  hours: {
    hoursType: string;
    isOpenNow: boolean;
    open: {
      day: number;
      end: string;
      isOvernight: boolean;
      start: string;
    }[];
  }[];
};

type Params = {
  businessID: string;
};

async function fetchBusiness(
  params: Params
): Promise<YelpResponse | undefined> {
  try {
    const response = await axios.get("/.netlify/functions/getBusiness", {
      params: {
        businessID: params.businessID,
      },
    });

    if (response.data) {
      return response.data;
    } else {
      return undefined;
    }
  } catch (error) {
    toast.error(
      "There was a problem location information about this business.",
      {
        toastId: "fetchBusiness",
      }
    );
  }
}

export default function useGetBusinessInfo(params: Params) {
  return useQuery<Business | undefined, Error>({
    queryKey: ["business", params.businessID],
    queryFn: async () => {
      const data = await fetchBusiness({ ...params });

      const result: Business | undefined = data
        ? {
            name: data.name,
            id: data.id,
            photos: data.photos,
            url: data.url,
            categories: data.categories,
            hours: data.hours.map((hour) => ({
              hoursType: hour.hours_type,
              isOpenNow: hour.is_open_now,
              open: hour.open.map((item) => ({
                day: item.day,
                end: item.end,
                isOvernight: item.is_overnight,
                start: item.start,
              })),
            })),
          }
        : undefined;

      return result;
    },
    enabled: params.businessID.length > 0,
  });
}
