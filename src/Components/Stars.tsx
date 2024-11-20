import { XyzTransitionGroup } from "@animxyz/react";
import { Star, StarHalf } from "lucide-react";

type RatingParams = {
  rating: number;
  iconSize?: number;
  direction?: string;
};

export default function Stars(params: RatingParams): JSX.Element {
  const isWhole = params.rating % 1 === 0;

  let stars;

  if (isWhole) {
    stars = new Array(params.rating).fill("star");
  }
  {
    stars = new Array(Math.floor(params.rating)).fill("stars");
    stars.push("half");
  }

  const size = params.iconSize ?? 16;

  return (
    <XyzTransitionGroup
      className={`flex ${params.direction ? `flex-start` : `justify-end`}`}
      appear={!!params.direction}
      xyz='fade small out-down out-rotate-right appear-stagger'
    >
      {stars.map((type, index) => {
        return (
          <div key={index}>
            {type === "stars" ? (
              <Star
                size={size}
                className={` mr-1 group-hover:fill-[#ffcf40] group-hover:text-[#ffcf40] fill-slate-800 text-slate-800 dark:fill-slate-200 dark:text-slate-200 `}
              />
            ) : (
              <StarHalf
                size={size}
                className={` mr-1 group-hover:fill-[#ffcf40] group-hover:text-[#ffcf40] fill-slate-800 dark:fill-slate-200 text-slate-800 dark:text-slate-200 `}
              />
            )}
          </div>
        );
      })}
    </XyzTransitionGroup>
  );
}
