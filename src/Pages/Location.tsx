import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { useMunchContext } from "../Context/MunchContext";
import getMergeState, { removeStateAndCountry } from "../utils";
import { LoaderIcon, Moon, Navigation, Sun } from "lucide-react";
import useGetFormattedAddress from "../Hooks/useGetFormattedAddress";
import useGetCoordinatesFromAddress from "../Hooks/useGetCoordinatesFromAddress";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import useGetAutoComplete from "../Hooks/useGetAutoComplete";
import { debounce } from "lodash";
import { MapPin } from "lucide-react";
import { useDarkMode } from "../Context/DarkModeProvider";
import { toast } from "react-toastify";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Utensils } from "lucide-react";
import ThemeButton from "../Components/ThemeButton";

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

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section, // Trigger for each section
            start: "top 80%", // When the top of the element hits 75% of the viewport
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
      }, 300),
    []
  );

  //handler
  async function handleSubmit() {
    if (state.addresssInput.length === 0 || !state.addresssInput) {
      toast.error("Please provide an address to search for food", {
        toastId: "provideAddress",
      });
      return;
    }

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
    <div className='flex flex-col min-h-screen'>
      <header className='px-4 lg:px-6 sm:h-20 h-14 flex items-center justify-between  bg-customOrange dark:bg-slate-800'>
        <span className='font-bold font-archivo text-slate-800 dark:text-slate-50 md:text-3xl text-2xl'>
          Munch Hunt
        </span>

        <ThemeButton />
      </header>

      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32 xl:py-32 2xl:py-48'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  Can't decide what to eat?
                </h1>
                <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400'>
                  Let us help you discover your next favorite meal
                </p>
              </div>
              <div className='flex sm:flex-row flex-col gap-3'>
                <div ref={inputbarRef} className='relative md:w-96 w-64'>
                  <Button
                    className='absolute z-10 inset-y-0 left-0 dark:bg-slate-700 dark:text-white sm:flex h-full items-center rounded-tr-none rounded-br-none'
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
                    className={`h-12 border-2 border-slate-900/10 bg-white dark:text-slate-900 pl-14 text-base shadow-lg placeholder:text-slate-900/50 `}
                    placeholder='Enter your location'
                    type='text'
                    value={state.addresssInput}
                    onChange={(e) => {
                      debounceSearch(e.target.value);
                      handleInputChange(e.target.value);
                    }}
                  />
                </div>
                <Button
                  size='lg'
                  className='h-12 bg-slate-900 dark:bg-slate-700 dark:text-white text-base hover:bg-slate-800'
                  onClick={handleSubmit}
                >
                  <Navigation className='mr-2 h-5 w-5' />
                  Find Food
                </Button>
                <div
                  className={`mt-12 absolute z-30 max-h-44 min-h-32 md:w-96  overflow-auto flex flex-col rounded-lg
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
              <p className='font-roboto sm:text-sm text-xs text-slate-700 dark:text-slate-100 mt-2'>
                {state.isLoadingAddress
                  ? "Looking for address..."
                  : "Enter location or click map pin button"}
              </p>
            </div>
          </div>
        </section>
        <section className='w-full py-12 md:py-24 xl:py-28 2xl:py-32 bg-gray-100 dark:bg-gray-800 '>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-10 sm:grid-cols-2 md:grid-cols-3'>
              <div
                ref={(el) => {
                  if (el) sectionsRef.current[0] = el;
                }}
                className='flex flex-col'
              >
                <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF7043]/10 dark:bg-slate-700'>
                  <Utensils className='h-6 w-6 text-[#FF7043] dark:text-slate-300' />
                </div>
                <h3 className='mb-2 text-xl font-semibold tracking-tight'>
                  Hungry and indecisive?
                </h3>
                <p className='sm:text-base text-sm text-slate-600 dark:text-slate-300'>
                  Planning date night but unsure where to go? Craving something
                  new but can't decide what? Don’t worry—Munch Hunt has you
                  covered!
                </p>
              </div>
              <div
                ref={(el) => {
                  if (el) sectionsRef.current[1] = el;
                }}
                className='flex flex-col'
              >
                <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF7043]/10 dark:bg-slate-700'>
                  <Navigation className='h-6 w-6 text-[#FF7043] dark:text-slate-300' />
                </div>
                <h3 className='mb-2 text-xl font-semibold tracking-tight'>
                  How it works
                </h3>
                <p className='sm:text-base text-sm text-slate-600 dark:text-slate-300'>
                  Explore cuisine categories or leave it to chance with a
                  randomized pick. We'll show all nearby restaurants within 25
                  miles that match your choice.
                </p>
              </div>
              <div
                ref={(el) => {
                  if (el) sectionsRef.current[2] = el;
                }}
                className='flex flex-col'
              >
                <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF7043]/10 dark:bg-slate-700'>
                  <MapPin className='h-6 w-6 text-[#FF7043] dark:text-slate-300' />
                </div>
                <h3 className='mb-2 text-xl font-semibold tracking-tight'>
                  Let's start hunting!
                </h3>
                <p className='sm:text-base text-sm text-slate-600 dark:text-slate-300'>
                  Just provide an address — Munch Hunt won't save it or use it
                  for any other purpose
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='border-t border-slate-200 dark:border-slate-600 px-4 py-6'>
        <div className='mx-auto max-w-6xl'>
          <div className='flex flex-col items-center justify-between md:gap-4 gap-2 sm:text-left text-center  text-sm text-slate-600 dark:text-slate-200 sm:flex-row'>
            <p>© 2024 Munch Hunt. All rights reserved.</p>
            <p className='hover:text-customOrange hover:dark:text-slate-600'>
              <a href='https://github.com/francisco-cmyk' target='_blank'>
                Developer
              </a>
            </p>
            <p className='flex items-center md:gap-1 gap-2'>
              <span className='sm:block hidden'>Powered by Yelp Fusion</span>
              <span className='sm:hidden block'>Yelp Fusion</span>
              <span>•</span>
              <span className='sm:block hidden'>Illustrations by Storyset</span>
              <span className='sm:hidden block'> Storyset</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
