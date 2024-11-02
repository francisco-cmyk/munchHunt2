import { useContext, useEffect, useState } from "react";
import { Button } from "./Components/Button";
import { Card, CardContent, CardFooter } from "./Components/Card";
import { Input } from "./Components/Input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { XyzTransition, XyzTransitionGroup } from "@animxyz/react";
import { MunchContext } from "./Context/MunchContext";
import axios from "axios";

const cards: { footer: string; source: string }[] = [
  {
    footer: "Korean",
    source:
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    footer: "Mexican",
    source:
      "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    footer: "Pizza",
    source:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Landing(): JSX.Element {
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // const [locationInput, setLocationInput] = useState<string>("");
  // const [showLoad, setShowLoad] = useState<boolean>(false);
  // const [locationUpdated, setUpdated] = useState<boolean>(false);
  // const { currAddress, setCurrAddress, currCoords, setCoords } =
  //   useContext(MunchContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstPage(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [cards.length]);

  const getCurrentPosition = () => {
    let coordinates = {};
    if (navigator.geolocation) {
      // setShowLoad(true);
      //NEEDS TO BE SET TO A FUNCTION -> TAKES CALL BACK
      navigator.geolocation.getCurrentPosition((position) => {
        coordinates = {
          lat: position.coords.latitude.toString(),
          long: position.coords.longitude.toString(),
        };
      });
      return coordinates;
    } else {
      alert("Sorry, your browser does not support HTML5 geolocation.");
    }
  };

  const test = getCurrentPosition();
  console.log("test", test);

  // const convertToAddress = (): void => {
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
  //     currCoords.lat
  //   },${currCoords.long}&key=${import.meta.env.VITE_MAPS_API_KEY}`;
  //   axios
  //     .get(url)
  //     .then((res) => {
  //       const address = res.data.results[0].formatted_address;
  //       console.log("address", address);
  //       // setLocationInput(address);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <div className=' bg-customOrange'>
      <XyzTransition appear xyz='small-100%  origin-center ease-out-back'>
        {showFirstPage && (
          <div className='h-screen flex flex-col justify-between font-inter'>
            <header className='flex flex-col items-center'>
              <p className='font-archivo font-black text-white  tracking-tighter text-[50px] mt-10'>
                Munch Hunt
              </p>
            </header>

            <div className='h-2/3 w-full flex flex-col items-center justify-center font-archivo text-black'>
              <div className='w-2/5'>
                <XyzTransition appear xyz='fade small stagger delay-10'>
                  <p className='text-black text-[36px] font-bold leading-tight'>
                    Struggling to choose a restaurant? Date night? Just hungry?
                  </p>
                </XyzTransition>
              </div>
              <div className='w-2/5 mt-20 flex '>
                <XyzTransition
                  appear
                  xyz='fade small stagger delay-20 leading-10'
                >
                  <p className=' text-[25px]'>Lets find the right place</p>
                </XyzTransition>
                <XyzTransition appear xyz='fade small stagger delay-25'>
                  <p className='font-bold text-[60px] ml-4 '>for you.</p>
                </XyzTransition>
              </div>
            </div>

            <div className='h-2/5'></div>
          </div>
        )}
      </XyzTransition>

      <XyzTransition xyz='fade delay-5 '>
        {!showFirstPage && (
          <div className='h-screen flex flex-col justify-between font-inter '>
            <div className='w-full flex justify-center p-5'>
              <p className='font-inter font-black text-[20px]'>
                Conquer hunger. Lets get to hunting.
              </p>
            </div>
            <div className='flex justify-center items-center h-2/5 '>
              <div className='flex justify-center items-center space-x-7 p-6 rounded-lg'>
                {cards.map((card, i) => {
                  return (
                    <Card
                      key={`$${i}-${card.footer}`}
                      className={` bg-slate-50 w-[300px] h-[300px]  flex flex-col justify-between border-none shadow-lg border-2 p-1 opacity-[0.7] ${
                        i === currentCardIndex ? "animate-grow" : ""
                      }`}
                      // style={{ animationDelay: `${i + 1 * 10}s` }}
                    >
                      <CardContent className='w-full  overflow-hidden p-0 rounded-lg rounded-b-none'>
                        <img
                          className='object-contain  transform translate-y-[-40px]'
                          alt='food'
                          src={card.source}
                        />
                      </CardContent>
                      <CardFooter className='px-2 py-1'>
                        <p className='font-semibold text-slate-800'>
                          {card.footer}
                        </p>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className='flex justify-center'>
              <div className='w-2/4 h-28 flex justify-center items-center rounded-lg border-none '>
                <div className='w-2/3 flex'>
                  <Input
                    className='border-stone-500 bg-slate-50 font-inter'
                    type='text'
                    placeholder='Enter your location'
                    // value={locationInput}
                  />
                  <Button className='ml-2 w-[100px] '>
                    <Crosshair2Icon style={{ width: "25px", height: "25px" }} />
                  </Button>
                </div>
              </div>
            </div>

            <XyzTransition appear xyz='fade up-75% delay-5 duration-20 ease'>
              <header className='flex flex-col items-center'>
                <p className='font-archivo font-black  tracking-tighter text-[150px]'>
                  Munch Hunt
                </p>
              </header>
            </XyzTransition>
          </div>
        )}
      </XyzTransition>
    </div>
  );
}
