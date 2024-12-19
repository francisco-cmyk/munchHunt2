import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { useMunchContext } from "../Context/MunchContext";
import getMergeState, { removeStateAndCountry } from "../utils";
import { ArrowRight, LoaderIcon, Moon, Sun } from "lucide-react";
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
import { toast } from "react-toastify";
import { Separator } from "../Components/Separator";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type State = {
  addresssInput: string;
  debouncedInput: string;
  isInvalidAddress: boolean;
  isLoadingAddress: boolean;
};

const initialState: State = {
  addresssInput: "",
  debouncedInput: "",
  isInvalidAddress: false,
  isLoadingAddress: false,
};

export default function Location(): JSX.Element {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  const munchContext = useMunchContext();
  const navigate = useNavigate();

  const main = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const underBarRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const inputbarRef = useRef<HTMLDivElement>(null);

  const mutation = useGetCoordinatesFromAddress();

  const { data: address, isFetching: isLoadingFormatAddress } =
    useGetFormattedAddress(munchContext.currentCoordinates);

  const { data: predictions = [] } = useGetAutoComplete(
    state.debouncedInput,
    state.debouncedInput.length > 0
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == "Enter" && state.addresssInput.length > 0) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.addresssInput]);

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
        translateY: -200,
        opacity: 0,
        duration: time,
      },
      { translateY: 0, opacity: 1, duration: time }
    );

    gsap.fromTo(
      underBarRef.current,
      {
        translateY: -100,
        duration: time,
      },
      { translateY: 0, duration: time }
    );
  }, [titleRef, underBarRef, main]);

  useEffect(() => {
    sectionsRef.current.forEach((section, index) => {
      gsap.fromTo(
        section,
        { opacity: 0, x: index % 2 == 0 ? 50 : -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section, // Trigger for each section
            start: "top 75%", // When the top of the element hits 75% of the viewport
            end: "bottom 25%", // When the bottom of the element hits 25% of the viewport
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  const debounceSearch = useMemo(
    () =>
      debounce((input: string) => {
        mergeState({ debouncedInput: input });
      }, 500),
    []
  );

  //handler
  async function handleSubmit() {
    const response = await mutation.mutateAsync(state.addresssInput);
    if (response) {
      const coordinates = {
        latitude: response.latitude,
        longitude: response.longitude,
      };
      munchContext.setCoordinates(coordinates);
      localStorage.setItem("location", JSON.stringify(coordinates));
    }

    gsap.to(inputbarRef.current, {
      opacity: 0,
      ease: "sine.out",
    });

    munchContext.setCurrentAddress(state.addresssInput);
    setTimeout(() => {
      mergeState({ addresssInput: "" });
      navigate("/select");
    }, 200);
  }

  function handleGetLocationPermission(): void {
    if (!navigator.geolocation) return;
    mergeState({ isLoadingAddress: true });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.coords) {
          const coordinates = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          };
          munchContext.setCoordinates(coordinates);
          localStorage.setItem("location", JSON.stringify(coordinates));
          mergeState({ isLoadingAddress: false });
        }
      },
      (error) => {
        console.warn(`ERROR:${error.code}, ${error.message}`);
        mergeState({ isLoadingAddress: false });
        toast.error(
          "There was a problem getting your location. Please type in an address.",
          {
            toastId: "fetchGeolocation",
          }
        );
      }
    );
  }

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
      className=' dark:bg-slate-950 bg-customOrange  flex flex-col justify-start cursor-default overflow-x-hidden scroll-smooth'
    >
      <div
        ref={underBarRef}
        className='w-full flex items-center justify-end sm:px-8 px-2 py-1  sm:h-20 h-[50px] '
      >
        <Button
          size='icon'
          className='bg-slate-700  text-white'
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </Button>
      </div>

      <div
        ref={titleRef}
        className='w-full flex justify-center items-center md:items-center sm:py-3 py-10 sm:mt-16 sm:mb-24 mb-14'
      >
        <p className='font-archivo font-black tracking-tighter 2xl:text-[200px] lg:text-[150px] sm:text-[100px] text-[40px] text-wrap leading-none'>
          Munch Hunt
        </p>
      </div>

      <div className='flex justify-center sm:mb-20 mb-16'>
        <div
          ref={inputbarRef}
          className='md:w-2/3 md:h-28 w-full flex flex-col justify-center items-center rounded-lg border-none  '
        >
          <div className='md:w-4/5 w-5/6 sm:w-5/6 flex'>
            <div className='relative w-full'>
              <Button
                className=' absolute z-10 inset-y-0 left-0 sm:flex h-full items-center rounded-tr-none rounded-br-none'
                onClick={handleGetLocationPermission}
              >
                {state.isLoadingAddress || isLoadingFormatAddress ? (
                  <LoaderIcon className='animate-spin ' />
                ) : (
                  <MapPin />
                )}
              </Button>
              <Input
                id='address-input'
                className={`sm:h-[50px]  dark:bg-slate-900 font-inter border-[1px] drop-shadow-lg`}
                type='search'
                placeholder='Enter your location'
                value={state.addresssInput}
                onChange={(e) => {
                  debounceSearch(e.target.value);
                  handleInputChange(e.target.value);
                }}
              />

              <Button
                size='icon'
                disabled={
                  state.addresssInput.length === 0 || !state.addresssInput
                }
                className='absolute z-10 inset-y-0 right-0 sm:flex h-full sm:w-20 hidden items-center  rounded-tl-none rounded-bl-none'
                onClick={handleSubmit}
              >
                <Crosshair2Icon className='w-5 h-5' />
              </Button>
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
          </div>

          <p className='font-roboto sm:text-sm text-xs text-slate-700 dark:text-slate-100 mt-2'>
            {state.isLoadingAddress
              ? "Looking for address..."
              : "Enter location or click map pin button"}
          </p>
          <Button
            size='icon'
            disabled={state.addresssInput.length === 0 || !state.addresssInput}
            className=' sm:hidden w-[100px]  items-center  font-archivo mt-3'
            onClick={handleSubmit}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div className='flex bg-slate-50 dark:bg-slate-700 flex-col items-center w-full font-radioCanada '>
        <div
          ref={(el) => {
            if (el) sectionsRef.current[0] = el;
          }}
          className='flex sm:flex-row sm:justify-evenly flex-col items-center justify-evenly sm:mt-7 mt-4 2xl:3/5 md:3/4 lg:mr-20'
        >
          <div className=' flex flex-col sm:text-left text-center sm:w-1/2 sm:pr-10'>
            <p className='font-semibold md:text-4xl text-base sm:mb-4 mb-32'>
              Hungry and indecisive?
            </p>
            <p className='sm:mb-2 sm:text-base text-sm'>
              Date night and don't know where to go?
            </p>
            <p className='sm:text-base text-sm'>
              Don't worry, Munch Hunt is here to help
            </p>
          </div>
          <div className='sm:w-[350px] sm:h-[300px] w-72 h-72'>
            <a
              href='https://storyset.com/together'
              className='absolute text-transparent'
            >
              Together illustrations by Storyset
            </a>
            <img
              className='dark:hidden'
              src='/variety_foods.svg'
              alt='woman looking at food hover in air'
            />
            <img
              className='hidden dark:block'
              src='/variety_food_dark.svg'
              alt='woman looking at food hover in air'
            />
          </div>
        </div>

        <Separator
          orientation='horizontal'
          className='h-[2px] sm:mt-16 mt-4 w-2/3 dark:bg-slate-50 dark:opacity-40'
        />

        <div
          ref={(el) => {
            if (el) sectionsRef.current[1] = el;
          }}
          className='flex sm:flex-row flex-col-reverse items-center justify-evenly 2xl:3/5 md:3/4 sm:mt-9 mt-3'
        >
          <div className='sm:w-[350px] sm:h-[300px] w-72 h-72'>
            <a
              href='https://storyset.com/together'
              className='absolute text-transparent'
            >
              Together illustrations by Storyset
            </a>
            <img
              className='dark:hidden'
              src='/sushi_cook.svg'
              alt='Sushi cook preparing sushi'
            />
            <img
              className='hidden dark:block'
              src='/sushi_cook_dark.svg'
              alt='Sushi cook preparing sushi'
            />
          </div>
          <div className='sm:text-xl sm:px-0 px-3 flex flex-col sm:w-1/2 w-full'>
            <p className='font-semibold sm:text-[40px] sm:text-right mb-4'>
              How it works -
            </p>
            <p className='mb-2 sm:text-base text-sm'>
              Munch Hunt lets you explore cuisine categories or leave the
              decision to chance with a randomized pick ~
            </p>
            <p className='sm:text-base text-sm'>
              After you make a selection, Munch Hunt shows all nearby
              restaurants within 25 miles that match your choice
            </p>
          </div>
        </div>

        <Separator
          orientation='horizontal'
          className='h-[2px] sm:mt-16 mt-4 w-3/5 dark:bg-slate-50 dark:opacity-40'
        />

        <div
          ref={(el) => {
            if (el) sectionsRef.current[2] = el;
          }}
          className='flex sm:flex-row flex-col items-center justify-evenly 2xl:3/5 md:3/4 sm:mt-9 mt-3'
        >
          <div className='sm:text-xl sm:px-0 px-3 flex flex-col sm:w-1/2 w-full '>
            <p className='font-semibold sm:text-[40px]  mb-4'>
              Lets start hunting!
            </p>
            <p className='mb-2 sm:text-base text-sm'>
              Just provide an address— Munch Hunt won't save it or use it for
              any other purpose
            </p>
          </div>

          <div className='sm:w-[350px] sm:h-[300px] w-72 h-72'>
            <a
              href='https://storyset.com/together'
              className='absolute text-transparent'
            >
              Together illustrations by Storyset
            </a>
            <img
              className='dark:hidden'
              src='/pizza_share.svg'
              alt='Sushi cook preparing sushi'
            />
            <img
              className='hidden dark:block'
              src='/pizza_share_dark.svg'
              alt='Sushi cook preparing sushi'
            />
          </div>
        </div>

        <div className='w-full sm:h-32 h-20 flex justify-center items-center  text-wrap mt-14'>
          <div className='sm:w-2/3 sm:px-0 px-2 flex sm:justify-center sm:text-base text-[10px] text-wrap'>
            <p>2025 |</p>
            <HoverCard>
              <HoverCardTrigger>
                <p className=' ml-2'>@ Developer | </p>
              </HoverCardTrigger>
              <HoverCardContent className='sm:w-80 text-white'>
                <div className='flex justify-start items-center space-x-4 bg-slate-950 rounded-md p-2'>
                  <Avatar>
                    <AvatarImage src='https://i.imgur.com/Z9MSzBn.png' />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>

                  <div className='space-y-1'>
                    <p className='sm:text-sm text-[12px]'>
                      Created by
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
                        @ 2025 Munch Hunt.xyz
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <p className='sm:block hidden ml-2'>Powered by Yelp Fusion |</p>
            <p className='sm:hidden ml-2'>Yelp Fusion |</p>
            <p className='sm:block hidden ml-2'>Illustrations - Storyset</p>
            <p className='sm:hidden ml-2'>Storyset</p>
          </div>
        </div>
      </div>
    </div>
  );
}
