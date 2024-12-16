import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { useMunchContext } from "../Context/MunchContext";
import getMergeState, { removeStateAndCountry } from "../utils";
import { ArrowRight, LoaderIcon, Moon, Search, Sun } from "lucide-react";
import useGetFormattedAddress from "../Hooks/useGetFormattedAddress";
import useGetCoordinatesFromAddress from "../Hooks/useGetCoordinatesFromAddress";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useGetAutoComplete from "../Hooks/useGetAutoComplete";
import { debounce } from "lodash";
import { MapPin } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../Components/Avatar";
import { useDarkMode } from "../Context/DarkModeProvider";

type State = {
  addresssInput: string;
  isInvalidAddress: boolean;
  debouncedInput: string;
};

const initialState: State = {
  addresssInput: "",
  isInvalidAddress: false,
  debouncedInput: "",
};

export default function Location(): JSX.Element {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  const munchContext = useMunchContext();
  const navigate = useNavigate();

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const main = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const underBarRef = useRef<HTMLDivElement>(null);
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const barTextRef = useRef<HTMLDivElement>(null);
  const bounce = useRef<HTMLDivElement>(null);

  const mutation = useGetCoordinatesFromAddress();

  const { data: address, isFetching: isLoading } = useGetFormattedAddress(
    munchContext.currentCoordinates
  );

  const { data: predictions = [] } = useGetAutoComplete(
    state.debouncedInput,
    state.debouncedInput.length > 0
  );

  useEffect(() => {
    if (!address) return;

    if (state.addresssInput.length === 0) {
      const formattedAddresss = removeStateAndCountry(address);
      mergeState({ addresssInput: formattedAddresss });
    }
  }, [address]);

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

    const containerWidth = main.current?.clientWidth ?? 600;
    const containerHeight = main.current?.clientHeight ?? 600;

    gsap.to(bounce.current, {
      x: () => gsap.utils.random(3, containerWidth - 100, 1),
      y: () => gsap.utils.random(0.5, containerHeight - 200, 1),
      duration: 3,
      ease: "sine.in",
      repeat: -1,
      repeatRefresh: true,
    });
  }, [titleRef, underBarRef, bounce, main]);

  //handler
  async function handleSubmit() {
    triggerAnimations({
      bar: underBarRef,
      barText: barTextRef,
      container1: containerRef1,
      container2: containerRef2,
      bounce: bounce,
      viewportHeight: viewportHeight,
    });

    const response = await mutation.mutateAsync(state.addresssInput);
    if (response) {
      const coordinates = {
        latitude: response.latitude,
        longitude: response.longitude,
      };
      munchContext.setCoordinates(coordinates);
      localStorage.setItem("location", JSON.stringify(coordinates));
    }

    munchContext.setCurrentAddress(state.addresssInput);
    setTimeout(() => {
      navigate("/select");
    }, 200);
  }

  const debounceSearch = useMemo(
    () =>
      debounce((input: string) => {
        mergeState({ debouncedInput: input });
      }, 1000),
    []
  );

  function handleInputChange(input: string) {
    mergeState({ addresssInput: input });
  }

  function handlePredictionChange(input: string) {
    mergeState({ addresssInput: input, debouncedInput: "" });
  }

  const fitleredPredictions = predictions.filter(
    (prediction) => prediction.description !== state.addresssInput
  );

  return (
    <div
      ref={main}
      className='bg-slate-50 dark:bg-slate-950 sm:h-screen h-dvh flex flex-col justify-end cursor-default'
    >
      <div className='absolute top-1 right-1'>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <Sun /> : <Moon className='text-black' />}
        </Button>
      </div>
      <div ref={bounce} className='absolute top-0 '>
        <Crosshair2Icon className='md:h-[200px] md:w-[200px] h-[130px] w-[130px] opacity-85 text-customOrange dark:text-slate-700 ' />
      </div>
      <div
        ref={containerRef1}
        className='w-full flex justify-center items-center md:mt-10 sm:mb-[100px] md:mb-0'
      >
        <div className='w-full flex justify-center items-center'>
          <div className=' flex flex-col justify-start md:items-center md:mr-10 ml-4'>
            <p
              ref={titleRef}
              className='font-archivo font-black text-white dark:text-white tracking-tighter 2xl:text-[250px] lg:text-[200px] sm:text-[100px] text-[80px] text-wrap m-0 p-0 leading-non mix-blend-difference dark:mix-blend-normal'
            >
              Munch Hunt
            </p>
          </div>
        </div>
      </div>

      <div ref={containerRef2} className='flex justify-center'>
        <div className='md:w-2/3 md:h-28 w-full flex flex-col justify-center items-center rounded-lg border-none  '>
          <div className='md:w-2/3 sm:w-5/6 flex'>
            <div className='relative w-full'>
              <span className='absolute z-10 inset-y-0 right-3  sm:flex hidden items-center text-slate-900'>
                {isLoading ? <LoaderIcon /> : <Search className='h-4 w-4' />}
              </span>
              <Input
                className={`sm:h-[50px] bg-slate-50 dark:bg-slate-900 font-inter border-[1px] drop-shadow-lg`}
                type='text'
                placeholder='Enter your location'
                value={state.addresssInput}
                onChange={(e) => {
                  debounceSearch(e.target.value);
                  handleInputChange(e.target.value);
                }}
              />
              <div
                className={`mt-0.5 absolute z-30 max-h-44 min-h-32 sm:w-full max-w-full overflow-auto flex flex-col rounded-lg
                  ${
                    fitleredPredictions.length > 0
                      ? "animate-slideDown rounded-md shadow-lg bg-slate-50"
                      : "animate-slideUp "
                  } `}
              >
                {fitleredPredictions.map((prediction, index) => {
                  return (
                    <Button
                      key={`${prediction.placeID}-${index}`}
                      className='flex max-w-full justify-start text-slate-800 dark:bg-slate-100 font-roboto hover:bg-slate-400 hover:text-white sm:text-[15px] text-[10px] rounded-none text-wrap '
                      variant={"outline"}
                      onClick={() =>
                        handlePredictionChange(prediction.description)
                      }
                    >
                      <MapPin />
                      {prediction.description}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button
              className='ml-2 w-[100px] shadow-lg drop-shadow-lg sm:h-[50px] hover:bg-customOrange dark:bg-slate-800 dark:hover:bg-slate-600 '
              onClick={handleSubmit}
            >
              <ArrowRight
                style={{ width: "25px", height: "25px" }}
                className='dark:text-white'
              />
            </Button>
          </div>
          <p className='font-roboto text-slate-300 mt-2'>Enter location</p>
        </div>
      </div>

      <div
        ref={underBarRef}
        className='w-full flex-col  md:h-1/6 h-[80px] bg-customOrange dark:bg-slate-600  flex justify-center items-center mt-20'
      >
        <p
          ref={barTextRef}
          className='font-inter font-black md:text-[40px] text-[20px]'
        >
          Conquer Hunger.
        </p>
        <HoverCard>
          <HoverCardTrigger>
            <p className='text-[10px] opacity-40'>@ Developer</p>
          </HoverCardTrigger>
          <HoverCardContent className='sm:w-80 text-white'>
            <div className='flex justify-start items-center space-x-4 bg-slate-950 rounded-md p-2'>
              <Avatar>
                <AvatarImage src='https://i.imgur.com/Z9MSzBn.png' />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>

              <div className='space-y-1'>
                <p className='sm:text-sm text-[12px]'>
                  Created by{" "}
                  <a
                    className='hover:text-orange-500 text-orange-300'
                    href='https://www.linkedin.com/in/fveranicola'
                    target='_blank'
                  >
                    Francisco Vera Nicola
                  </a>
                </p>
                <p className='sm:text-[10px] text-[8px]'>
                  Powered by Typescript, React & Tailwind CSS
                </p>
                <div className='flex items-center pt-2'>
                  <span className='sm:text-xs text-[8px] text-muted-foreground'>
                    @ 2024 Munch Hunt.xyz
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

function triggerAnimations(params: {
  bar: React.RefObject<HTMLDivElement>;
  barText: React.RefObject<HTMLDivElement>;
  container1: React.RefObject<HTMLDivElement>;
  container2: React.RefObject<HTMLDivElement>;
  bounce: React.RefObject<HTMLDivElement>;
  viewportHeight: number;
}) {
  gsap.fromTo(
    params.container1.current,
    {
      opacity: 1,
      duration: 1,
    },
    { opacity: 0, duration: 3 }
  );

  gsap.fromTo(
    params.container2.current,
    { opacity: 1, translateX: 0, ease: "power1.out" },
    { opacity: 0, translateX: -2000, duration: 3 }
  );

  gsap.fromTo(
    params.bounce.current,
    {
      opacity: 0.9,
      rotate: 0,
      delay: 1,
      ease: "sine.in",
    },
    { opacity: 0.2, scale: 1.1, ease: "sine.out" }
  );
}
