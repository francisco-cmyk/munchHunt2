import { useEffect, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { useMunchContext } from "../Context/MunchContext";
import getMergeState from "../utils";
import { LoaderIcon, Search } from "lucide-react";
import useGetFormattedAddress from "../Hooks/useGetFormattedAddress";
import useGetCoordinatesFromAddress from "../Hooks/useGetCoordinatesFromAddress";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type State = {
  addresssInput: string;
  isInvalidAddress: boolean;
};

const initialState: State = {
  addresssInput: "",
  isInvalidAddress: false,
};

export default function Location(): JSX.Element {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const munchContext = useMunchContext();
  const navigate = useNavigate();

  const mutation = useGetCoordinatesFromAddress();

  const { data: address, isLoading } = useGetFormattedAddress(
    munchContext.currentCoordinates
  );

  useEffect(() => {
    if (!address) return;

    if (state.addresssInput.length === 0) {
      const formattedAddresss = removeStateAndCountry(address);
      mergeState({ addresssInput: formattedAddresss });
    }
  }, [address]);

  const titleRef = useRef<HTMLDivElement>(null);
  const underBarRef = useRef<HTMLDivElement>(null);
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const barTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const time = 1; //3s

    gsap.fromTo(
      titleRef.current,
      {
        translateY: -300,
        duration: time,
      },
      { translateY: 0, duration: time }
    );

    gsap.fromTo(
      underBarRef.current,
      {
        translateY: 100,
        duration: time,
      },
      { translateY: 0, duration: time }
    );

    //code
  }, [titleRef, underBarRef]);

  //handler
  async function handleSubmit() {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const barHeight = underBarRef.current
      ? underBarRef.current.clientHeight
      : 150;
    const barTextWidth = barTextRef.current
      ? barTextRef.current.clientWidth
      : 1000;

    console.log(windowHeight - barTextWidth);

    gsap.fromTo(
      underBarRef.current,
      {
        translateY: 0,
        opacity: 1,
      },
      { translateY: -(windowHeight - barHeight), duration: 1 }
    );

    gsap.fromTo(
      containerRef1.current,
      {
        opacity: 1,
        duration: 1,
      },
      { opacity: 0, duration: 1 }
    );

    gsap.fromTo(
      containerRef2.current,
      { opacity: 1, translateX: 0 },
      { opacity: 0, translateX: -2000 }
    );

    gsap.fromTo(
      barTextRef.current,
      {
        opacity: 1,
        translateX: 0,
        duration: 1,
      },
      {
        translateX: barTextWidth - windowHeight + 20,
        opacity: 0.3,
        duration: 1,
      }
    );

    const currentCoordiantes = munchContext.currentCoordinates;
    if (!currentCoordiantes.latitude && !currentCoordiantes.longitude) {
      const response = await mutation.mutateAsync(state.addresssInput);
      if (response) {
        munchContext.setCoordinates({
          latitude: response.latitude,
          longitude: response.longitude,
        });
      }
    }

    munchContext.setCurrentAddress(state.addresssInput);
    setTimeout(() => {
      navigate("/select");
    }, 1100);
  }

  return (
    <div className='bg-slate-50 h-screen flex flex-col justify-end'>
      <div
        ref={containerRef1}
        className='w-full flex justify-center items-center mt-10'
      >
        <div className='w-full flex justify-center items-center'>
          <div className=' flex flex-col justify-start mr-10'>
            <p
              ref={titleRef}
              className='font-archivo font-black text-black  tracking-tighter text-[280px] text-wrap m-0 p-0 leading-none'
            >
              Munch Hunt
            </p>
          </div>
        </div>
      </div>

      <div ref={containerRef2} className='flex justify-center'>
        <div className='w-2/3 h-28 flex justify-center items-center rounded-lg border-none  '>
          <div className='w-2/3 flex  '>
            <div className='relative w-full'>
              <span className='absolute inset-y-0 right-3 flex items-center text-slate-900'>
                {isLoading ? <LoaderIcon /> : <Search className='h-4 w-4' />}
              </span>
              <Input
                className={`h-[50px] bg-slate-50 font-inter drop-shadow-lg`}
                type='text'
                placeholder='Enter your location'
                value={state.addresssInput}
                onChange={(e) => {
                  mergeState({ addresssInput: e.target.value });
                }}
              />
            </div>

            <Button
              className='ml-2 w-[100px] shadow-lg drop-shadow-lg h-[50px] hover:bg-customOrange '
              onClick={handleSubmit}
            >
              <Crosshair2Icon style={{ width: "25px", height: "25px" }} />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={underBarRef}
        className='w-full h-1/6 bg-customOrange flex justify-center items-center mt-20'
      >
        <p ref={barTextRef} className='font-inter font-black text-2xl'>
          Conquer hunger.
        </p>
      </div>
    </div>
  );
}

const addressRegex = /^\d+\s+[\w\s.]+,\s*([A-Z]{2})$/;

function isValidAddress(address: string) {
  if (address.length === 0) return true;
  return addressRegex.test(address);
}

function removeStateAndCountry(address: string | undefined) {
  if (!address) return;

  const parts = address.split(",");
  if (parts.length > 2) {
    const newAddress = parts.slice(0, -2).join(",").trim();
    return newAddress;
  } else {
    return address;
  }
}

{
  /* <div className='flex justify-center items-center h-2/5 '>
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
            </div> */
}

// const cards: { footer: string; source: string }[] = [
//   {
//     footer: "Korean",
//     source:
//       "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     footer: "Mexican",
//     source:
//       "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     footer: "Pizza",
//     source:
//       "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
// ];
