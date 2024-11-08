import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// For Shadcn components

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//For state management in components

export default function getMergeState<State>(
  ss: React.Dispatch<React.SetStateAction<State>>
) {
  return function mergeState(ps: Partial<State>) {
    return ss((s: State) => ({ ...s, ...ps }));
  };
}

// Misc Util Functions

export function isFloatBetween(
  num: number,
  lowerBound: number,
  upperBound: number
) {
  return num > lowerBound && num < upperBound;
}

export function convertToMiles(distance: number): string {
  const converted = (distance * 0.000621371192).toFixed(2);
  return converted.toString();
}

export function randomizeChoices(choices: string[]): string {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

export function removeStateAndCountry(address: string | undefined) {
  if (!address) return;

  const parts = address.split(",");
  if (parts.length > 2) {
    const newAddress = parts.slice(0, -2).join(",").trim();
    return newAddress;
  } else {
    return address;
  }
}

const addressRegex = /^\d+\s+[\w\s.]+,\s*([A-Z]{2})$/;

export function isValidAddress(address: string) {
  if (address.length === 0) return true;
  return addressRegex.test(address);
}
