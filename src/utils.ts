import { clsx, type ClassValue } from "clsx";
import { random, shuffle } from "lodash";
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

export function randomizeChoice(choices: string[]): string {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

export function randomizeMultipleChoices(
  choices: string[],
  limit: number
): string[] {
  const indexes = new Set();
  const newChoices: string[] = [];

  while (newChoices.length < limit) {
    const randomIndex = Math.floor(Math.random() * choices.length);
    if (!indexes.has(randomIndex)) {
      newChoices.push(choices[randomIndex]);
      indexes.add(randomIndex);
    }
  }

  return newChoices;
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

export function isPast3PM() {
  const now = new Date();
  const hours = now.getHours();

  return hours >= 18;
}

export function formatTimeRange(start: string, end: string) {
  start = convertTo12HourFormat(start);
  end = convertTo12HourFormat(end);

  return `${start} - ${end}`;
}

function convertTo12HourFormat(time: string) {
  // Parse hours and minutes
  let hours = parseInt(time.slice(0, 2), 10);
  let minutes = time.slice(2);

  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${suffix}`;
}
