export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Business = {
  name: string;
  id: string;
  displayAddress: string;
  rating: number;
  transactions: string[];
  price: string;
  phone: string;
  displayPhone: string;
  coordinates: Coordinates;
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

export type Restaurant = {
  alias: string;
  coordinates: Coordinates;
  displayAddress: string;
  displayPhone: string;
  distance: string;
  id: string;
  imageURL: string;
  isClosed: boolean;
  name: string;
  price: string;
  phone: string;
  rating: number;
  transactions: string[];
};

export const Days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
