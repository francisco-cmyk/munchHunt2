import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function getMergeState<State>(
  ss: React.Dispatch<React.SetStateAction<State>>
) {
  return function mergeState(ps: Partial<State>) {
    return ss((s: State) => ({ ...s, ...ps }));
  };
}

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
