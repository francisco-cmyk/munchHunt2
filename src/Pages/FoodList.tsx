import { useMunchContext } from "../Context/MunchContext";
import useGetRestaurants, { Restaurant } from "../Hooks/useGetRestaurants";
import { XyzTransitionGroup } from "@animxyz/react";
import { Button } from "../Components/Button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../Components/Card";

export default function FoodList(): JSX.Element {
  const munchContext = useMunchContext();

  const { munchHuntChoice, currentCoordinates } = munchContext;

  const { data: yelpRestaurants = [], isLoading } = useGetRestaurants({
    food: munchHuntChoice,
    coordinates: currentCoordinates,
  });

  return (
    <div className="className='w-full h-full flex flex-col justify-center items-center '">
      <div className='flex flex-col justify-center items-center p-10'>
        <p className='font-roboto text-[18px]'>The hunt chose:</p>
        <p className='font-archivo font-bold text-[30px]'>{munchHuntChoice}</p>
      </div>

      <div className='w-3/4  min-h-[420px] max-h-[560px] overflow-auto'>
        <Grid restaurants={yelpRestaurants} />
      </div>
    </div>
  );
}

type GridProps = {
  restaurants: Restaurant[];
};

function Grid(props: GridProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='h-full'>
      {isVisible && (
        <XyzTransitionGroup
          appear
          className='grid grid-cols-3 gap-5 gap-y-52'
          xyz='fade small out-down out-rotate-right duration-2 appear-stagger '
        >
          {props.restaurants.map((restaurant, index) => (
            <div key={`${index}-${restaurant.id}`} className='h-[50px]'>
              <Card className='w-[310px] h-[240px]  flex flex-col justify-between border-none shadow-lg border-2 p-1 '>
                <CardContent className='w-full  overflow-hidden p-0 rounded-lg rounded-b-none'>
                  <img
                    className='object-contain  transform translate-y-[-40px]'
                    alt='food'
                    src={restaurant.imageURL}
                  />
                </CardContent>
                <CardFooter className='px-2 py-1'>
                  <p className='font-semibold text-slate-800'>
                    {restaurant.name}
                  </p>
                </CardFooter>
              </Card>
            </div>
          ))}
        </XyzTransitionGroup>
      )}
    </div>
  );
}
