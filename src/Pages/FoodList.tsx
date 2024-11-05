import { useMunchContext } from "../Context/MunchContext";
import useGetRestaurants, { Restaurant } from "../Hooks/useGetRestaurants";
import { XyzTransitionGroup, XyzTransition } from "@animxyz/react";
import { Card, CardContent, CardFooter } from "../Components/Card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useRef, useState } from "react";
import { StarHalf, Star } from "lucide-react";
import Modal from "../Components/Modal";
import { keyBy } from "lodash";
import MapComponent from "../Components/MapComponent";

export default function FoodList(): JSX.Element {
  const [selectedRestaurantID, setselectedRestaurantID] = useState<
    string | null
  >(null);

  const munchContext = useMunchContext();
  const { munchHuntChoice, currentCoordinates } = munchContext;

  let isLoading = true;

  const { data: yelpRestaurants = [], isLoading: isLoadingYelp } =
    useGetRestaurants({
      food: munchHuntChoice,
      coordinates: currentCoordinates,
    });

  isLoading = isLoadingYelp;

  const restaurantsKeyedByID = keyBy(yelpRestaurants, "id");

  function handleRestaurantClick(id: string) {
    if (selectedRestaurantID === id) {
      setselectedRestaurantID(null);
    } else {
      setselectedRestaurantID(id);
    }
  }

  function renderModal() {
    if (selectedRestaurantID === null) return null;

    const footerFields = ["displayAddres", "displayPhone", "transactions"];

    const restaurant = restaurantsKeyedByID[selectedRestaurantID];
    return (
      <Modal onClose={() => setselectedRestaurantID(null)} showClose>
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
          {props.restaurants.map((restaurant, index) => (
            <div key={`${index}-${restaurant.id}`} className='h-[300px] px-5'>
              <Card
                className='group w-full h-full  flex flex-col justify-between  p-1 border-none bg-transparent shadow-none hover:shadow-lg hover:bg-orange-300 '
                onClick={() => props.onSelect(restaurant.id)}
              >
                <CardContent className='w-full  overflow-hidden p-0 rounded-lg relative'>
                  <div
                    className='absolute top-0 right-0 z-10 w-[250px] p-3 flex flex-col items-end text-[20px] font-bold text-white
                    opacity-0 group-hover:opacity-100
                    -translate-x-10 transition-transform duration-500 ease-in-out group-hover:translate-x-0
                    rounded-lg
                    drop-shadow-lg
                  '
                  >
                    {restaurant.transactions.length > 0 && (
                      <div className='max-w-[250px] text-[15px] flex justify-endy- '>
                        <p className='mr-1'>Available for -</p>
                        {restaurant.transactions.map((trans, index) => (
                          <p key={`${index}-${trans}`} className='mr-1'>
                            {trans}
                          </p>
                        ))}
                      </div>
                    )}
                    <p className=''>{restaurant.displayPhone}</p>

                    <p className='text-[15px]'>
                      {restaurant.isClosed ? "Open now" : "Closed"}
                    </p>
                  </div>
                  <img
                    className='object-contain  transform translate-y-[-40px]'
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
                    <p>{`${convertToMiles(restaurant.distance)} miles away`}</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
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
    <div className={`flex ${params.direction ? `flex-start` : `justify-end`}`}>
      {stars.map((type, index) => {
        return type === "stars" ? (
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
        );
      })}
    </div>
  );
}
