import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { useMunchContext } from "../Context/MunchContext";
import getMergeState, { removeStateAndCountry } from "../utils";
import { Compass, LoaderIcon, MapPinned, Search, Sparkles } from "lucide-react";
import useGetFormattedAddress from "../Hooks/useGetFormattedAddress";
import useGetCoordinatesFromAddress from "../Hooks/useGetCoordinatesFromAddress";
import { Link, useNavigate } from "react-router-dom";
import useGetAutoComplete from "../Hooks/useGetAutoComplete";
import { debounce } from "lodash";
import { MapPin } from "lucide-react";
import { useDarkMode } from "../Context/DarkModeProvider";
import { toast } from "react-toastify";
import { Utensils } from "lucide-react";
import ThemeButton from "../Components/ThemeButton";

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

  const munchContext = useMunchContext();
  const navigate = useNavigate();

  const { mutateAsync: mutation, isPending: isPendingSubmit } =
    useGetCoordinatesFromAddress();

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

    const response = await mutation(state.addresssInput);
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

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const fitleredPredictions = predictions.filter(
    (prediction) => prediction.description !== state.addresssInput
  );

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-background/50'>
      {/* Header */}
      <header className='container py-6'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='flex items-center gap-2'>
            <div className='relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white'>
              <Utensils className='h-5 w-5' />
              <div className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500'>
                <Sparkles className='h-2.5 w-2.5 text-white' />
              </div>
            </div>
            <span className='text-xl font-bold font-archivo tracking-tight'>
              MunchHunt
            </span>
          </Link>
          <ThemeButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className='container pb-24 pt-12 md:pt-20'>
        <div className='relative mx-auto max-w-5xl'>
          {/* Decorative elements */}
          <div className='absolute -left-4 top-1/4 h-24 w-24 rounded-full bg-orange-200 blur-3xl md:h-40 md:w-40'></div>
          <div className='absolute -right-4 top-1/2 h-20 w-20 rounded-full bg-blue-200 blur-3xl md:h-32 md:w-32'></div>
          <div className='absolute bottom-0 left-1/3 h-16 w-16 rounded-full bg-green-200 blur-3xl md:h-28 md:w-28'></div>

          <div className='relative z-10 flex flex-col items-center'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 dark:border-zinc-500 bg-orange-50 dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-orange-800 dark:text-zinc-200 backdrop-blur'>
              <span className='flex h-2 w-2 rounded-full bg-orange-500 dark:bg-zinc-200'></span>
              Food decision made simple
            </div>

            <h1 className='mb-6 text-center text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl'>
              Can't decide <br className='hidden sm:inline' />
              <span className='relative inline-block'>
                what to eat?
                <span className='absolute -bottom-1 left-0 h-3 w-full bg-orange-200 dark:bg-orange-700'></span>
              </span>
            </h1>

            <p className='mb-12 max-w-2xl text-center text-lg text-muted-foreground md:text-xl'>
              Let us help you discover your next favorite meal when you're
              feeling indecisive
            </p>

            <div className='relative mb-1 w-full max-w-2xl'>
              <div className='overflow-hidden rounded-2xl border border-orange-100 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-lg'>
                <div className='flex items-center gap-2 border-b border-orange-100 dark:border-zinc-600 bg-customOrange dark:bg-zinc-900 bg-opacity-75 px-4 py-3'>
                  <div className='h-3 w-3 rounded-full bg-red-400'></div>
                  <div className='h-3 w-3 rounded-full bg-yellow-400'></div>
                  <div className='h-3 w-3 rounded-full bg-green-400'></div>
                  <div className='ml-2 text-xs text-white'>
                    Find restaurants near you
                  </div>
                </div>
                <div className='flex flex-col gap-4 p-6 md:flex-row md:items-center'>
                  <div className='relative flex-1'>
                    <Button
                      variant='ghost'
                      className='absolute bg-transparent z-10 w-8 top-1/2 -translate-y-1/2 text-muted-foreground'
                      onClick={handleGetLocationPermission}
                    >
                      {state.isLoadingAddress || isLoadingFormatAddress ? (
                        <LoaderIcon className='animate-spin ' />
                      ) : (
                        <MapPin className='h-5 w-5' />
                      )}
                    </Button>

                    <Input
                      id='address-input'
                      type='text'
                      className='h-12 pl-11 text-base relative '
                      placeholder='Enter your location'
                      value={state.addresssInput}
                      onChange={(e) => {
                        debounceSearch(e.target.value);
                        handleInputChange(e.target.value);
                      }}
                    />
                  </div>
                  <Button
                    className='h-12 gap-2 px-6 md:w-auto dark:bg-orange-400 dark:hover:bg-orange-600 dark:text-white'
                    size='lg'
                    onClick={handleSubmit}
                  >
                    {isPendingSubmit ? (
                      <LoaderIcon className='animate-spin ' />
                    ) : (
                      <Search className='h-4 w-4' />
                    )}

                    <span>Find Food</span>
                  </Button>
                  <div
                    className={`absolute top-28 mt-1 z-30 max-h-44 min-h-32 md:w-[450px] w-[300px]  overflow-auto flex flex-col rounded-lg
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
                          className='flex max-w-full justify-start dark:bg-zinc-900 dark:text-zinc-50 text-slate-800  font-roboto hover:bg-orange-200 dark:hover:bg-zinc-600 sm:text-[15px] text-[10px] rounded-none text-wrap '
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
                <div className='bg-muted/30 px-6 py-3 text-center text-xs text-muted-foreground dark:text-zinc-200'>
                  Enter location or click map pin button to use your current
                  location
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className='bg-gradient-to-b from-orange-50 dark:from-background to-white'
        id='how-it-works'
      >
        <div className='container py-24'>
          <div className='mb-16 text-center'>
            <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary'>
              <Sparkles className='h-4 w-4' />
              How it works
            </div>
            <h2 className='mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
              Three simple steps
            </h2>
            <p className='mx-auto max-w-[700px] text-muted-foreground md:text-lg'>
              We take the stress out of deciding where to eat with our simple
              process
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            <div className='group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-md transition-all hover:shadow-lg'>
              <div className='absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 dark:bg-orange-400 transition-all group-hover:scale-110'></div>
              <div className='relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white'>
                <Utensils className='h-7 w-7' />
              </div>
              <h3 className='mb-3 text-xl font-bold'>Hungry and indecisive?</h3>
              <p className='text-muted-foreground'>
                Planning date night but unsure where to go? Craving something
                new but can't decide what? Don't worry.
              </p>
            </div>

            <div className='group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-md transition-all hover:shadow-lg'>
              <div className='absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 dark:bg-orange-400 transition-all group-hover:scale-110'></div>
              <div className='relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white'>
                <Compass className='h-7 w-7' />
              </div>
              <h3 className='mb-3 text-xl font-bold'>Choose or randomize</h3>
              <p className='text-muted-foreground'>
                Explore cuisine categories or leave it to chance with a
                randomized pick. We'll show all nearby restaurants.
              </p>
            </div>

            <div className='group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-md transition-all hover:shadow-lg'>
              <div className='absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 dark:bg-orange-400 transition-all group-hover:scale-110'></div>
              <div className='relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white'>
                <MapPinned className='h-7 w-7' />
              </div>
              <h3 className='mb-3 text-xl font-bold'>Let's start hunting!</h3>
              <p className='text-muted-foreground'>
                Just provide an address — Munch Hunt won't save it or use it for
                any other purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Gallery Section */}
      <section className='container py-24'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
            Discover delicious options
          </h2>
          <p className='mx-auto max-w-[700px] text-muted-foreground md:text-lg'>
            From comfort food to exotic cuisine, find exactly what you're
            craving
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6'>
          <div className='group relative aspect-square overflow-hidden rounded-2xl'>
            <img
              src='/pizza-landing.avif'
              alt='Food 1'
              className='object-cover h-full transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
            <div className='absolute bottom-0 left-0 p-4'>
              <span className='text-xl font-medium text-white'>Pizza</span>
            </div>
          </div>
          <div className='group relative aspect-square overflow-hidden rounded-2xl'>
            <img
              src='/sushi-landing.avif'
              alt='Food 2'
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
            <div className='absolute bottom-0 left-0 p-4'>
              <span className='text-xl font-medium text-white'>Sushi</span>
            </div>
          </div>
          <div className='group relative aspect-square overflow-hidden rounded-2xl'>
            <img
              src='/burgers-landing.avif'
              alt='Food 3'
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
            <div className='absolute bottom-0 left-0 p-4'>
              <span className='text-xl font-medium text-white'>Burgers</span>
            </div>
          </div>
          <div className='group relative aspect-square overflow-hidden rounded-2xl'>
            <img
              src='/tacos-landing.avif'
              alt='Food 4'
              className='object-cover h-full transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
            <div className='absolute bottom-0 left-0 p-4'>
              <span className='text-xl font-medium text-white'>Tacos</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='container pb-24'>
        <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 dark:from-zinc-950 to-orange-50 p-8 md:p-12'>
          <div className='absolute -right-12 -top-12 h-64 w-64 rounded-full bg-orange-200 blur-3xl'></div>
          <div className='absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-100 blur-3xl'></div>

          <div className='relative z-10 flex flex-col items-center text-center'>
            <div className='mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white'>
              <Sparkles className='h-8 w-8' />
            </div>
            <h2 className='mb-4 text-3xl font-bold tracking-tight md:text-4xl'>
              Ready to find your next meal?
            </h2>
            <p className='mb-8 max-w-2xl text-muted-foreground md:text-lg'>
              Stop scrolling through endless options. Let Munch Hunt make the
              decision for you.
            </p>
            <Button
              size='lg'
              className='h-14 gap-2 px-8 text-base bg-orange-500 dark:bg-black hover:bg-orange-600 dark:hover:bg-zinc-900 text-white'
              onClick={() => scrollToSection("address-input")}
            >
              <Search className='h-5 w-5' />
              <span>Find Food Now</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-orange-100 bg-customOrange bg-opacity-90 dark:bg-black dark:border-none'>
        <div className='container py-12'>
          <div className='flex flex-col items-center justify-between gap-6 md:flex-row'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white'>
                <Utensils className='h-4 w-4' />
              </div>
              <span className='text-lg font-bold font-archivo'>MunchHunt</span>
            </div>
            <div className='flex flex-wrap justify-center gap-x-8 gap-y-4 text-white'>
              <Link
                to='#'
                className='text-sm  transition-colors hover:text-primary'
              >
                About
              </Link>
              <Link
                to='https://github.com/francisco-cmyk'
                target='_blank'
                className='text-sm  transition-colors hover:text-primary'
              >
                Developer
              </Link>
              <p className='text-sm  transition-colors hover:text-primary'>
                Yelp Fusion
              </p>
            </div>
            <p className='text-sm text-white md:text-right text-center'>
              © {new Date().getFullYear()} MunchHunt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
