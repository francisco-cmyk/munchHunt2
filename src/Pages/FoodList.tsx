import { useMunchContext } from "../Context/MunchContext";
import useGetRestaurants, { Restaurant } from "../Hooks/useGetRestaurants";
import { Card, CardContent, CardFooter } from "../Components/Card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMemo, useState } from "react";
import { StarHalf, Star } from "lucide-react";
import Modal from "../Components/Modal";
import { keyBy } from "lodash";
import MapComponent from "../Components/MapComponent";
import getMergeState from "../utils";
import { XyzTransitionGroup } from "@animxyz/react";
import useGetBusinessInfo from "../Hooks/useGetBusiness";
import DropDown from "../Components/DropDown";

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

  //TODO: use photos for coursel in modal
  const { data: businessInfo } = useGetBusinessInfo({
    businessID: state.selectedRestaurantID ?? "",
  });

  let isLoading = isLoadingYelp ?? true;

  const restaurantsKeyedByID = keyBy(yelpRestaurants, "id");

  // Filter

  const filteredResults = useMemo(() => {
    if (!state.distanceFilter && !state.ratingFilter && !state.priceFilter)
      return yelpRestaurants;

    return yelpRestaurants.filter((result) => {
      const isPrice =
        state.priceFilter === null ||
        (result.price !== undefined && result.price === state.priceFilter);

      const isDistance =
        state.distanceFilter === null ||
        Number(convertToMiles(result.distance)) <= state.distanceFilter;

      //TODO: fix
      const isRating =
        state.ratingFilter === null ||
        Math.floor(result.rating) >= state.ratingFilter;

      return isPrice && isDistance && isRating;
    });
  }, [
    yelpRestaurants,
    state.priceFilter,
    state.distanceFilter,
    state.ratingFilter,
  ]);

  // Handler

  function handleRestaurantClick(id: string) {
    if (state.selectedRestaurantID === id) {
      mergeState({ selectedRestaurantID: null });
    } else {
      mergeState({ selectedRestaurantID: id });
    }
  }

  function handleFilterChange(params: { name: string; value: string }) {
    let formattedValue: string | number = params.value;

    switch (params.name) {
      case "price": {
        formattedValue = params.value;
        break;
      }
      case "rating": {
        formattedValue = Number(params.value);
        break;
      }
      case "distance": {
        formattedValue = Number(params.value);
      }
    }
    mergeState({ [`${params.name}Filter`]: formattedValue });
  }

  //Render

  function renderModal() {
    if (state.selectedRestaurantID === null) return null;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let mapWidth, mapHeight;
    if (windowWidth < 700) {
      mapWidth = windowWidth - 100;
      mapHeight = windowHeight / 3;
    }

    const restaurant = restaurantsKeyedByID[state.selectedRestaurantID];
    return (
      <Modal
        onClose={() => mergeState({ selectedRestaurantID: null })}
        showClose
      >
        <div className='md:w-[850px] md:h-[450px] h-[600px]  bg-slate-50 rounded-xl p-8 flex md:flex-row flex-col cursor-default'>
          <div className='md:w-2/4 md:h-full h-2/5 flex flex-col justify-between'>
            <div className='flex flex-col items-start md:h-[90px] h-[50px] justify-between'>
              <p className='font-archivo md:text-[30px] text-[20px] text-wrap '>
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

            <div className='flex flex-col items-end mr-5 text-right'>
              <p className='text-wrap font-semibold '>
                {restaurant.displayAddress}
              </p>
              <p>{restaurant.displayPhone}</p>
              <p>{restaurant.transactions.join(", ")}</p>
            </div>
          </div>

          <div>
            <MapComponent
              coordintes={restaurant.coordinates}
              width={mapWidth}
              height={mapHeight}
            />
          </div>
        </div>
      </Modal>
    );
  }

  const priceOptions = new Array(5).fill("$").map((item, i) => {
    const dollars = item.repeat(i + 1);
    return {
      label: dollars,
      value: dollars,
    };
  });

  const ratingOptions = new Array(5).fill("").map((_, i) => {
    const numeric = i + 1;
    const rating = numeric.toString() + (i === 0 ? " Star" : " Stars");
    return { label: rating, value: numeric.toString() };
  });

  const distanceOptions = ["<1", "1", "5", "10", "25"].map((item, i) => {
    const miles = item === "<1" ? "0.9" : item;

    return {
      label: item + " ml",
      value: miles,
    };
  });

  return (
    <div className="className='w-full h-full flex flex-col justify-center items-center cursor-default">
      {renderModal()}
      <div className='flex flex-col justify-center items-center md:p-8 max-h-[100px]'>
        <p className='font-inter text-slate-700 text-[18px]'>The Hunt Chose</p>
        <p className='font-archivo font-bold md:text-[30px] text-[35px]'>
          {munchHuntChoice}
        </p>
      </div>

      <div className='md:w-5/6 w-full flex md:justify-start justify-center py-3'>
        <DropDown
          title='Price'
          options={priceOptions}
          onChange={handleFilterChange}
        />
        <DropDown
          title='Distance'
          options={distanceOptions}
          onChange={handleFilterChange}
        />
        <DropDown
          title='Rating'
          options={ratingOptions}
          onChange={handleFilterChange}
        />
      </div>

      <div className='md:w-5/6 w-full 2xl:min-h-[420px] 2xl:max-h-[650px] md:max-h-[550px] md:min-h-[550px]  overflow-auto rounded-lg'>
        <Grid
          restaurants={filteredResults}
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
      <XyzTransitionGroup
        appear
        className='grid md:grid-cols-3 grid-cols-1 gap-5 '
        xyz='fade small out-down out-rotate-right-0'
      >
        {placeHolder.map((_, index) => (
          <div key={index} className='w-full h-full text-center md:text-left '>
            <Skeleton
              key={index}
              width={"90%"}
              height={200}
              style={{ borderRadius: "10px" }}
            />
            <Skeleton width={"50%"} style={{ borderRadius: "5px" }} />
          </div>
        ))}
      </XyzTransitionGroup>
    );
  }
  return (
    <div className='h-full'>
      {props.isLoading ? (
        renderLoadingPanels()
      ) : (
        <XyzTransitionGroup
          appear
          className='grid md:grid-cols-3 grid-cols-1 gap-5 gap-y-5 '
          xyz='fade small out-down out-rotate-right-0'
        >
          {props.restaurants.map((restaurant, index) => {
            let availibility = "Available for ";

            restaurant.transactions.forEach((trans) => {
              if (trans.includes("_")) {
                const str = trans.split("_").join(" ");
                availibility = availibility.concat(`${str} `);
              } else {
                availibility = availibility.concat(`${trans} `);
              }
            });

            return (
              <div key={`${index}-${restaurant.id}`} className='h-[300px] px-5'>
                <Card
                  className='group w-full h-full  flex flex-col justify-between  p-1 border-none bg-transparent shadow-none hover:shadow-xl hover:border-4 cursor-pointer'
                  onClick={() => props.onSelect(restaurant.id)}
                >
                  <CardContent className='w-full  overflow-hidden p-0 rounded-lg relative'>
                    <div
                      className='absolute top-0 right-0 z-10 w-[250px] p-3 flex flex-col items-end text-[20px] font-bold text-white
                      opacity-0 group-hover:opacity-100  -translate-x-10 transition-transform duration-500 ease-in-out group-hover:translate-x-0 rounded-lg
                      drop-shadow-md '
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
        </XyzTransitionGroup>
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
          <div key={index}>
            {type === "stars" ? (
              <Star
                size={size}
                className={` mr-1 group-hover:fill-[#ffcf40] group-hover:text-[#ffcf40] fill-slate-800 text-slate-800`}
              />
            ) : (
              <StarHalf
                size={size}
                className={` mr-1 group-hover:fill-[#ffcf40] group-hover:text-[#ffcf40] fill-slate-800 text-slate-800`}
              />
            )}
          </div>
        );
      })}
    </XyzTransitionGroup>
  );
}
