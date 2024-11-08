import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export type AutoComplete = {
  description: string;
  place_id: string;
  terms: string[];
  types: string[];
};

export type AutoCompleteResult = {
  description: string;
  placeID: string;
  terms: string[];
  types: string[];
};

async function fetchAutoComplete(input: string) {
  if (input.length === 0) return undefined;

  try {
    const response = await axios.post("/.netlify/functions/getAutocomplete", {
      input: input,
    });
    return response ? response.data.predictions : [];
  } catch (error) {
    toast.error("Error fetching autocomplete results:", {
      toastId: "fetchAutoComplete",
    });
  }
}

export default function useGetAutoComplete(input: string, enable: boolean) {
  return useQuery<AutoCompleteResult[], Error>({
    queryKey: ["autoComplete", input],
    queryFn: async () => {
      const data = await fetchAutoComplete(input);

      return data.map((datum: AutoComplete) => ({
        description: datum.description,
        placeID: datum.place_id,
        terms: datum.terms,
        types: datum.types,
      }));
    },
    enabled: input.length > 0 && enable,
  });
}
