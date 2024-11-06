import { useMunchContext } from "../Context/MunchContext";
import useGetRestaurants, { Restaurant } from "../Hooks/useGetRestaurants";
import { Card, CardContent, CardFooter } from "../Components/Card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMemo, useState } from "react";
import { StarHalf, Star, Proportions } from "lucide-react";
import Modal from "../Components/Modal";
import { keyBy } from "lodash";
import MapComponent from "../Components/MapComponent";
import getMergeState from "../utils";
import { XyzTransitionGroup } from "@animxyz/react";

type State = {
  selectedRestaurantID: string | null;
  priceFilter: string | null;
  distanceFilter: number | null;
  ratingFilter: number | null;
};

const initialState: State = {
  selectedRestaurantID: null,
  priceFilter: null,
  distanceFilter: null,
  ratingFilter: null,
};

export default function FoodList(): JSX.Element {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const munchContext = useMunchContext();
  const { munchHuntChoice, currentCoordinates } = munchContext;

  const { data: yelpRestaurants = [], isLoading: isLoadingYelp } =
    useGetRestaurants({
      food: munchHuntChoice,
      coordinates: currentCoordinates,
    });

  let isLoading = isLoadingYelp ?? true;

  const restaurantsKeyedByID = keyBy(yelpRestaurants, "id");

  // Filter

  // useMemo(() => {

  //   return
  // }, [])

  // Handler

  function handleRestaurantClick(id: string) {
    if (state.selectedRestaurantID === id) {
      mergeState({ selectedRestaurantID: null });
    } else {
      mergeState({ selectedRestaurantID: id });
    }
  }

  //Render

  function renderModal() {
    if (state.selectedRestaurantID === null) return null;

    const restaurant = restaurantsKeyedByID[state.selectedRestaurantID];
    return (
      <Modal
        onClose={() => mergeState({ selectedRestaurantID: null })}
        showClose
      >
        <div className='w-[850px] h-[450px] bg-slate-50 rounded-xl p-8 flex cursor-default'>
          <div className='w-2/4 h-full flex  flex-col justify-between'>
            <div className='flex flex-col items-start h-[90px] justify-between'>
              <p className='font-archivo text-[30px] text-wrap '>
                {restaurant.name}
              </p>

              {renderRating({
                rating: restaurant.rating,
                direction: "start",
                iconSize: 24,
              })}

              <p className='font-semibold text-lg mt-2'>
                {restaurant.price ?? "--"}
              </p>
            </div>

            <div className='flex flex-col items-end mr-5'>
              <p className='text-wrap font-semibold'>
                {restaurant.displayAddress}
              </p>
              <p>{restaurant.displayPhone}</p>
              <p>{restaurant.transactions.join(", ")}</p>
            </div>
          </div>

          <div>
            <MapComponent coordintes={restaurant.coordinates} />
          </div>
        </div>
      </Modal>
    );
  }

  const priceOptions = new Array(5).fill("$");

  return (
    <div className="className='w-full h-full flex flex-col justify-center items-center cursor-default">
      {renderModal()}
      <div className='flex flex-col justify-center items-center p-10'>
        <p className='font-roboto text-[18px]'>The hunt chose</p>
        <p className='font-archivo font-bold text-[30px]'>{munchHuntChoice}</p>
      </div>

      <div className='w-5/6  min-h-[420px] max-h-[650px] overflow-auto rounded-lg'>
        <Grid
          restaurants={yelpRestaurants}
          isLoading={isLoading}
          onSelect={handleRestaurantClick}
        />
      </div>
    </div>
  );
}

type GridProps = {
  restaurants: Restaurant[];
  isLoading: boolean;
  onSelect: (id: string) => void;
};

function Grid(props: GridProps) {
  function renderLoadingPanels() {
    const placeHolder = new Array(6).fill("item");

    return (
      <div className="grid grid-cols-3 gap-5 gap-y-52'">
        {placeHolder.map((_, index) => (
          <div key={index} className='w-full h-full'>
            <Skeleton
              key={index}
              width={"90%"}
              height={200}
              style={{ borderRadius: "10px" }}
            />
            <Skeleton width={"50%"} style={{ borderRadius: "5px" }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className='h-full'>
      {props.isLoading ? (
        renderLoadingPanels()
      ) : (
        <div className='grid grid-cols-3 gap-5 gap-y-5 '>
          {props.restaurants.map((restaurant, index) => {
            let availibility = "Available for ";

            restaurant.transactions.forEach((trans) => {
              if (trans.includes("_")) {
                const str = trans.split("_").join(" ");
                console.log(str);
                availibility = availibility.concat(`${str} `);
              } else {
                availibility = availibility.concat(`${trans} `);
              }
            });

            return (
              <div key={`${index}-${restaurant.id}`} className='h-[300px] px-5'>
                <Card
                  className='group w-full h-full  flex flex-col justify-between  p-1 border-none bg-transparent shadow-none hover:shadow-lg hover:bg-orange-300 '
                  onClick={() => props.onSelect(restaurant.id)}
                >
                  <CardContent className='w-full  overflow-hidden p-0 rounded-lg relative'>
                    <div
                      className='absolute top-0 right-0 z-10 w-[250px] p-3 flex flex-col items-end text-[20px] font-bold text-white
                      opacity-0 group-hover:opacity-100  -translate-x-10 transition-transform duration-500 ease-in-out group-hover:translate-x-0 rounded-lg
                      drop-shadow-[0_35px_35px_rgba(0, 0, 0, 0.58)]'
                    >
                      {restaurant.transactions.length > 0 && (
                        <div className=' text-[15px] flex justify-end text-wrap  rounded-lg drop-shadow-lg'>
                          <p className='text-wrap text-right'>{availibility}</p>
                        </div>
                      )}
                      <p className=''>{restaurant.displayPhone}</p>

                      <p className='text-[15px]'>
                        {restaurant.isClosed ? "Open now" : "Closed"}
                      </p>
                    </div>
                    <img
                      className='object-contain  '
                      alt='food'
                      src={restaurant.imageURL}
                    />
                  </CardContent>
                  <CardFooter className='px-2 py-1 w-full flex flex-col justify-between items-start text-sm mt-1'>
                    <div className='w-full flex justify-between'>
                      <p className='font-semibold text-slate-800 text-[14px] text-wrap'>
                        {restaurant.name}
                      </p>

                      {renderRating({ rating: restaurant.rating })}
                    </div>
                    <div className='flex w-full'>
                      <p className='mr-2 font-semibold'>
                        {restaurant.price ? restaurant.price : "--"}
                      </p>
                      <p className='text-slate-700'>{`${convertToMiles(
                        restaurant.distance
                      )} miles away`}</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function convertToMiles(distance: number): string {
  const converted = (distance * 0.000621371192).toFixed(2);
  return converted.toString();
}

type RatingParams = {
  rating: number;
  iconSize?: number;
  direction?: string;
};

function renderRating(params: RatingParams): JSX.Element {
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
          <div>
            {type === "stars" ? (
              <Star
                key={index}
                size={size}
                className={` mr-1 fill-[#ffcf40] text-[#ffcf40] group-hover:fill-slate-800 group-hover:text-slate-800`}
              />
            ) : (
              <StarHalf
                key={index}
                size={size}
                className={` mr-1 fill-[#ffcf40] text-[#ffcf40] group-hover:fill-slate-800 group-hover:text-slate-800`}
              />
            )}
          </div>
        );
      })}
      {/* </div> */}
    </XyzTransitionGroup>
  );
}
