import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Landing() {
  const [showFirstPage, setShowFirstPage] = useState(true);

  const navigate = useNavigate();

  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const time = 1;
    gsap.fromTo(
      container.current,
      { opacity: 0.5, scale: 0.7, duration: time, ease: "sine.in" },
      { opacity: 1, scale: 1, duration: time, ease: "sine.in" }
    );
  }, [container]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstPage(false);
      navigate("/location");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`h-screen flex flex-col justify-center items-center font-inter md:bg-customOrange md:bg-none bg-[url('src/Assets/guyMunching2.gif')] bg-no-repeat bg-cover`}
    >
      <div
        ref={container}
        className='w-3/4 h-3/5 flex md:flex-row  flex-col  items-center bg-slate-50 bg-opacity-95 p-10 rounded-2xl drop-shadow-lg '
      >
        <div className='md:h-2/3 md:w-2/3 h-full w-full flex flex-col justify-between px-4'>
          <p className='md:text-[35px] text-xl font-semibold font-robot leading-tight text-start'>
            Struggling to choose a restaurant?
            <br className='md:hidden' />
            <br /> Date night? Just hungry?
            <br />
            <br className='md:hidden' /> Lets find the right place for you
          </p>

          <div className=' w-full'>
            <div className='border-y-2 rounded-xl md:border-customOrange border-black ' />
            <p className='md:text-[70px] text-[40px] font-archivo font-bold md:text-customOrange leading-tight mt-5'>
              Munch Hunt
            </p>
          </div>
        </div>

        <div className='md:w-2/4 md:h-4/5 h-0 opacity-0 md:opacity-100  bg-slate-50'>
          <img
            className='rounded-xl h-full w-full'
            src='src/Assets/guyMunching2.gif'
          />
        </div>
      </div>
    </div>
  );
}
