import { useEffect, useState } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { XyzTransition } from "@animxyz/react";
import { useMunchContext } from "../Context/MunchContext";
import getMergeState from "../utils";
import { LoaderIcon, Search } from "lucide-react";
import useGetFormattedAddress from "../Hooks/useGetFormattedAddress";
import useGetCoordinatesFromAddress from "../Hooks/useGetCoordinatesFromAddress";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const munchContext = useMunchContext();

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

  //handler
  async function handleSubmit() {
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
    navigate("/select");
  }

  return (
    <div className=' bg-customOrange'>
      <XyzTransition xyz='fade delay-5 '>
        <div className='h-screen flex flex-col justify-between font-inter '>
          <div className='w-full flex flex-col items-center justify-center p-5'>
            <p className='font-roboto font-semibold text-[20px]'>
              Find good food near you
            </p>
            <p className='font-inter font-black text-[20px]'>
              Conquer hunger. Lets get to hunting.
            </p>
          </div>

          <div className='h-2/5 flex justify-center items-center w-full'>
            <div className='w-2/5 flex justify-center bg-slate-900 rounded-2xl p-2'>
              <XyzTransition
                appear
                xyz=' right-20% left-50%  iterate-infinite duration-25 direction-alternate'
              >
                <div
                  className={`rounded-3xl h-[240px] w-[330px] bg-contain bg-top bg-no-repeat bg-[url('https://i.imgur.com/Z9MSzBn.png')] `}
                />
              </XyzTransition>
            </div>
          </div>

          <div className='flex justify-center'>
            <div className='w-2/4 h-28 flex justify-center items-center rounded-lg border-none  '>
              <div className='w-2/3 flex  '>
                <div className='relative w-full'>
                  <span className='absolute inset-y-0 right-3 flex items-center text-slate-900'>
                    {isLoading ? (
                      <LoaderIcon />
                    ) : (
                      <Search className='h-4 w-4' />
                    )}
                  </span>
                  <Input
                    className={` border-none bg-slate-50 font-inter shadow-xl`}
                    type='text'
                    placeholder='Enter your location'
                    value={state.addresssInput}
                    onChange={(e) => {
                      mergeState({ addresssInput: e.target.value });
                    }}
                  />
                </div>

                <Button
                  className='ml-2 w-[100px] shadow-lg '
                  onClick={handleSubmit}
                >
                  <Crosshair2Icon style={{ width: "25px", height: "25px" }} />
                </Button>
              </div>
            </div>
          </div>

          <header className='flex flex-col items-center'>
            <p className='font-archivo font-black  tracking-tighter text-[150px]'>
              Munch Hunt
            </p>
          </header>
        </div>
      </XyzTransition>
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
