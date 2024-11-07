import { useEffect, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { useMunchContext } from "../Context/MunchContext";
import getMergeState from "../utils";
import { ArrowRight, LoaderIcon, Search } from "lucide-react";
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

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  useEffect(() => {
    if (!address) return;

    if (state.addresssInput.length === 0) {
      const formattedAddresss = removeStateAndCountry(address);
      mergeState({ addresssInput: formattedAddresss });
    }
  }, [address]);

  const main = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const underBarRef = useRef<HTMLDivElement>(null);
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const barTextRef = useRef<HTMLDivElement>(null);
  const bounce = useRef<HTMLDivElement>(null);

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

  function triggerAnimations() {
    const barHeight = underBarRef.current
      ? underBarRef.current.clientHeight
      : 150;
    const barTextWidth = barTextRef.current
      ? barTextRef.current.clientWidth
      : 1000;

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
      underBarRef.current,
      {
        translateY: 0,
        opacity: 1,
      },
      {
        translateY: -(viewportHeight - barHeight),
        opacity: 1,
        scaleY: 0.9,
        duration: 1,
      }
    );

    gsap.fromTo(
      barTextRef.current,
      {
        opacity: 1,
        translateX: 0,
      },
      {
        translateX: barTextWidth - viewportHeight - 10,
        scale: 1.3,
        opacity: 0.2,
      }
    );

    gsap.fromTo(
      bounce.current,
      {
        opacity: 0.9,
        rotate: 0,
        delay: 1,
        ease: "power1.inOut",
      },
      { opacity: 0, scale: 1.5, rotate: 360, ease: "power1.inOut" }
    );
  }

  //handler
  async function handleSubmit() {
    triggerAnimations();

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
    <div
      ref={main}
      className='bg-slate-50 h-screen flex flex-col justify-end cursor-default'
    >
      <div ref={bounce} className='absolute top-0 '>
        <Crosshair2Icon className='md:h-[200px] md:w-[200px] h-[130px] w-[130px] opacity-85 text-customOrange ' />
      </div>
      <div
        ref={containerRef1}
        className='w-full flex justify-center items-center md:mt-10 mb-[100px] md:mb-0'
      >
        <div className='w-full flex justify-center items-center'>
          <div className=' flex flex-col justify-start md:items-center mr-10'>
            <p
              ref={titleRef}
              className='font-archivo font-black text-white tracking-tighter 2xl:text-[250px] lg:text-[200px] text-[100px] text-wrap m-0 p-0 leading-non mix-blend-difference '
            >
              Munch Hunt
            </p>
          </div>
        </div>
      </div>

      <div ref={containerRef2} className='flex justify-center'>
        <div className='md:w-2/3 md:h-28 w-full flex flex-col justify-center items-center rounded-lg border-none  '>
          <div className='md:w-2/3 w-5/6 flex'>
            <div className='relative w-full'>
              <span className='absolute z-10 inset-y-0 right-3 flex items-center text-slate-900'>
                {isLoading ? <LoaderIcon /> : <Search className='h-4 w-4' />}
              </span>
              <Input
                className={`h-[50px] bg-slate-50 font-inter border-[1px] drop-shadow-lg`}
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
              <ArrowRight style={{ width: "25px", height: "25px" }} />
            </Button>
          </div>
          <p className='font-roboto text-slate-300 mt-2'>Enter location</p>
        </div>
      </div>

      <div
        ref={underBarRef}
        className='w-full md:h-1/6 h-[80px] bg-customOrange flex justify-center items-center mt-20'
      >
        <p
          ref={barTextRef}
          className='font-inter font-black md:text-[40px] text-[20px]'
        >
          Conquer Hunger.
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
