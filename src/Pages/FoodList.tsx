import { useMunchContext } from "../Context/MunchContext";
import useGetRestaurants, { Restaurant } from "../Hooks/useGetRestaurants";
import { Card, CardContent, CardFooter } from "../Components/Card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useMemo, useState } from "react";
import Modal from "../Components/Modal";
import { keyBy } from "lodash";
import MapComponent from "../Components/MapComponent";
import getMergeState, { isFloatBetween, isPast3PM } from "../utils";
import { XyzTransitionGroup } from "@animxyz/react";
import DropDown, { Option } from "../Components/DropDown";
import Filter from "../Components/Filter";
import Stars from "../Components/Stars";
import { ChevronRight, Frown } from "lucide-react";
import ModalMobile from "../Components/ModalMobile";
import { Button } from "../Components/Button";
import { AccordionComponent } from "../Components/Accordion";
import { Switch } from "../Components/Switch";
import useGetBusinessInfo from "../Hooks/useGetBusiness";

const priceOptions: Option[] = new Array(5).fill("$").map((item, i) => {
  const dollars = item.repeat(i + 1);
  return {
    label: dollars,
    value: dollars,
  };
});

const ratingOptions: Option[] = new Array(5).fill("").map((_, i) => {
  const numeric = i + 1;
  const rating = numeric.toString() + (i === 0 ? " Star" : " Stars");
  return { label: rating, value: numeric.toString() };
});

const distanceOptions: Option[] = ["<1", "1", "5", "10", "25"].map(
  (item, i) => {
    const miles = item === "<1" ? "0.9" : item;

    return {
      label: item + " ml",
      value: miles,
    };
  }
);

type State = {
  distanceFilter: number | null;
  isSmallWindow: boolean;
  isClosedFilter: string | null;
  priceFilter: string | null;
  ratingFilter: number | null;
  selectedRestaurantID: string | null;
  showShadow: boolean;
};

const initialState: State = {
  distanceFilter: null,
  isSmallWindow: false,
  isClosedFilter: null,
  priceFilter: null,
  ratingFilter: null,
  selectedRestaurantID: null,
  showShadow: false,
};

export default function FoodList(): JSX.Element {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const munchContext = useMunchContext();
  const { munchHuntChoice, currentCoordinates } = munchContext;

  const {
    data: yelpRestaurants = [],
    isLoading: isLoading = false,
    isFetching: isFetching,
  } = useGetRestaurants({
    food: munchHuntChoice,
    coordinates: currentCoordinates,
  });

  const restaurantsKeyedByID = keyBy(yelpRestaurants, "id");

  const { data: businessInfo, isFetching: isFetchingBusiness } =
    useGetBusinessInfo({
      businessID: state.selectedRestaurantID ?? "",
    });

  // Side Effects

  useEffect(() => {
    if (window.innerWidth < 700) {
      mergeState({ isSmallWindow: true });
    } else {
      mergeState({ isSmallWindow: false });
    }
  }, []);

  // Filter

  const filteredResults = useMemo(() => {
    if (!state.distanceFilter && !state.ratingFilter && !state.priceFilter)
      return yelpRestaurants;

    let results = yelpRestaurants;

    results = results.filter((result) => {
      const isPrice =
        state.priceFilter === null ||
        (result.price !== undefined && result.price === state.priceFilter);

      const isStateClosed = state.isClosedFilter === "Open";

      const isClosed =
        state.isClosedFilter === null || result.isClosed !== isStateClosed;

      const isDistance =
        state.distanceFilter === null ||
        Number(result.distance) <= state.distanceFilter;

      const isRating =
        state.ratingFilter === null ||
        isFloatBetween(
          result.rating,
          state.ratingFilter,
          state.ratingFilter + 1
        );

      return isPrice && isClosed && isDistance && isRating;
    });

    results = results.sort((a, b) => {
      if (!state.distanceFilter) return 0;

      const distanceA = Number(a.distance);
      const distanceB = Number(b.distance);
      if (distanceA > distanceB) return -1;
      if (distanceB < distanceA) return 1;
      return 0;
    });

    return results;
  }, [
    yelpRestaurants,
    state.priceFilter,
    state.distanceFilter,
    state.ratingFilter,
    state.isClosedFilter,
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
    let formattedValue: string | number | null = params.value;

    const filterName = `${params.name}Filter` as keyof State;

    if (state[`${filterName}`]?.toString() === params.value) {
      mergeState({ [filterName]: null });
      return;
    }

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
        break;
      }
      case "isClosed": {
        formattedValue = params.value === "Open" ? "Open" : null;
        break;
      }
    }
    mergeState({ [filterName]: formattedValue });
  }

  //Render

  function renderModal() {
    if (state.selectedRestaurantID === null) return null;

    const restaurant = restaurantsKeyedByID[state.selectedRestaurantID];

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let mapLink = restaurant.displayAddress.replace(/ /g, "+");

    mapLink = "https://www.google.com/maps/search/?api=1&query=1600+" + mapLink;

    let mapWidth, mapHeight;
    if (state.isSmallWindow) {
      mapWidth = windowWidth - 50;
      mapHeight = windowHeight / 2;
    }

    const conent = (
      <div className='md:w-[850px] md:h-[450px] sm:h-screen h-dvh bg-slate-50 rounded-xl sm:p-8 p-6 flex md:flex-row flex-col justify-between cursor-default'>
        <div className='md:w-2/4 md:h-full h-3/5 flex flex-col justify-between'>
          <div className='flex flex-col items-start md:h-[90px] h-[50px] justify-between'>
            <p className='font-archivo md:text-[30px] text-[20px] text-wrap '>
              {restaurant.name}
            </p>

            <Stars rating={restaurant.rating} direction='start' iconSize={24} />

            <p className='font-semibold text-lg mt-2'>
              {restaurant.price ?? "--"}
            </p>
          </div>

          <div className='flex flex-col items-end mr-5 text-right'>
            <a
              className='text-wrap font-semibold hover:text-orange-300 text-customOrange '
              href={mapLink}
              target='_blank'
            >
              {restaurant.displayAddress}
            </a>
            <a
              className='hover:text-orange-400'
              href={`tel:${restaurant.phone}`}
            >
              {restaurant.displayPhone}
            </a>
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

        {state.isSmallWindow && (
          <Button onClick={() => mergeState({ selectedRestaurantID: null })}>
            close
          </Button>
        )}
      </div>
    );

    const business = {
      name: businessInfo ? businessInfo.name : restaurant.name,
      id: businessInfo ? businessInfo.id : restaurant.id,
      displayAddress: restaurant.displayAddress,
      rating: restaurant.rating,
      transactions: restaurant.transactions,
      price: restaurant.price,
      phone: restaurant.phone,
      displayPhone: restaurant.displayPhone,
      coordinates: restaurant.coordinates,
      categories: businessInfo ? businessInfo.categories : [],
      photos: businessInfo ? businessInfo.photos : [],
      url: businessInfo ? businessInfo.url : "",
      hours: businessInfo ? businessInfo.hours : [],
    };

    return (
      <>
        {state.isSmallWindow ? (
          <ModalMobile
            onClose={() => mergeState({ selectedRestaurantID: null })}
          >
            {conent}
          </ModalMobile>
        ) : (
          <Modal
            onClose={() => mergeState({ selectedRestaurantID: null })}
            showClose
            isLoading={isFetchingBusiness}
            isSmallWindow={state.isSmallWindow}
            business={business}
          />
        )}
      </>
    );
  }

  const isAfternoon = isPast3PM();

  return (
    <div className="className='w-full sm:h-full flex flex-col justify-center items-center  cursor-default md:pt-3 ">
      {renderModal()}
      <div
        className={`${
          state.isSmallWindow ? `top-16 z-20 fixed` : ``
        } flex  w-full justify-start items-center  md:max-h-[130px] md:min-h-[80px] bg-stone-900 py-2`}
      >
        <div className='w-1/5 md:flex hidden justify-end pr-3'>
          <p className='font-roboto text-[17px] text-white'>The Hunt Chose</p>
          <ChevronRight color='white' />
        </div>
        <div className='md:w-3/4 w-full flex md:justify-start justify-center items-center text-white md:pl-6'>
          <p className='font-archivo font-bold md:text-[30px] text-[35px] '>
            {munchHuntChoice}
          </p>
        </div>
      </div>

      <div className='w-full h-full flex md:flex-row flex-col mt-5 overflow-auto  '>
        <div className='md:w-1/5 border-r-2 flex flex-col md:px-10 sm:px-5 px-1 py-4 '>
          <p className='font-inter font-semibold text-lg text-slate-500'>
            Filter By
          </p>
          <div className='w-full border-b-2' />
          <div />

          {state.isSmallWindow ? (
            <div className='flex flex-row h-[95%] overflow-auto mt-2'>
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
          ) : (
            <div className='flex flex-col h-[95%] overflow-auto mt-2 text-slate-500'>
              {isAfternoon && (
                <div className='w-full py-2 px-2 flex justify-between'>
                  <p className='font-medium'>Open now</p>
                  <Switch
                    checked={state.isClosedFilter === "Open"}
                    onCheckedChange={(value) => {
                      const valueStr = value ? "Open" : "Closed";
                      handleFilterChange({ name: "isClosed", value: valueStr });
                    }}
                  />
                </div>
              )}

              <AccordionComponent title='Price' isOpen>
                <Filter
                  filterName={"price"}
                  disabled={yelpRestaurants.length === 0}
                  options={priceOptions}
                  value={state.priceFilter ?? ""}
                  handleChange={handleFilterChange}
                />
              </AccordionComponent>
              <AccordionComponent title='Distance'>
                <Filter
                  filterName={"distance"}
                  disabled={yelpRestaurants.length === 0}
                  options={distanceOptions}
                  value={state.distanceFilter?.toString() ?? ""}
                  handleChange={handleFilterChange}
                />
              </AccordionComponent>
              <AccordionComponent title='Rating'>
                <Filter
                  filterName={"rating"}
                  disabled={yelpRestaurants.length === 0}
                  options={ratingOptions}
                  value={state.ratingFilter?.toString() ?? ""}
                  handleChange={handleFilterChange}
                />
              </AccordionComponent>
            </div>
          )}
        </div>

        <div className='md:w-3/4 2xl:max-h-[650px] md:max-h-[550px] md:min-h-[550px] max-h-[600px]  overflow-auto rounded-lg'>
          <Grid
            restaurants={filteredResults}
            isLoading={isLoading}
            isFetching={isFetching}
            onSelect={handleRestaurantClick}
          />
        </div>
      </div>
    </div>
  );
}

type GridProps = {
  restaurants: Restaurant[];
  isLoading: boolean;
  isFetching: boolean;
  onSelect: (id: string) => void;
};

function Grid(props: GridProps) {
  if (!props.isFetching && props.restaurants.length === 0) {
    return (
      <div className='h-full w-full flex justify-center items-center  opacity-20 mt-2'>
        <div className='flex flex-col items-center'>
          <Frown className='h-28 w-28 ' />
          <p className='font-anton text-[30px]'>No results</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full'>
      {props.isLoading ? (
        <Placeholder />
      ) : (
        <XyzTransitionGroup
          appear={props.restaurants.length > 0}
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
                  className='group w-full h-full  flex flex-col justify-between  p-1 border-none bg-transparent shadow-none hover:shadow-2xl hover:border-4 hover:bg-[#FAFAFA] cursor-pointer'
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
                        {restaurant.isClosed ? "Closed" : "Open now"}
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
                      <Stars rating={restaurant.rating} />
                    </div>
                    <div className='flex w-full'>
                      <p className='mr-2 font-semibold'>
                        {restaurant.price ? restaurant.price : "--"}
                      </p>
                      <p className='text-slate-700'>{`${restaurant.distance} miles away`}</p>
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

function Placeholder() {
  const placeHolders = new Array(9).fill("item");

  return (
    <XyzTransitionGroup
      appear
      className='grid md:grid-cols-3 grid-cols-1 gap-5 px-3'
      xyz='fade small out-down out-rotate-right-0'
    >
      {placeHolders.map((_, index) => (
        <div key={index} className='w-full h-full text-center md:text-left  '>
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
