import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";

export default function Landing() {
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [currentText, setCurrentText] = useState("text1");

  const navigate = useNavigate();

  const text1 = useRef<HTMLParagraphElement | null>(null);
  const text2 = useRef<HTMLParagraphElement | null>(null);
  const text3 = useRef<HTMLParagraphElement | null>(null);

  useGSAP(() => {
    const time = 1;

    if (text1.current && currentText === "text1") {
      const text = new SplitType(text1.current, { types: "words" });
      gsap.from(text.words, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: time,
        ease: "power2.out",
        onComplete: () => {
          setCurrentText("text2");
        },
      });
    }

    if (text2.current && currentText === "text2") {
      const secondText = new SplitType(text2.current, { types: "words" });
      gsap.from(secondText.words, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: time,
        ease: "power2.out",
        onComplete: () => {
          setCurrentText("text3");
        },
      });
    }

    if (text3.current && currentText === "text3") {
      const thirdText = new SplitType(text3.current, { types: "words" });
      gsap.from(thirdText.words, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [text1, text2, text3, currentText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstPage(false);
      navigate("/location");
      setCurrentText("text1");
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center font-semibold font-archivo bg-customOrange`}
    >
      <p
        ref={text1}
        className={`md:text-[60px] text-2xl text-wrap text-center ${
          currentText === "text1" ? `inline` : `hidden`
        }  leading-tight text-star`}
      >
        Struggling to choose a restaurant?
      </p>

      <p
        ref={text2}
        className={`md:text-[60px] text-2xl ${
          currentText === "text2" ? `inline` : `hidden`
        } leading-tight text-star`}
      >
        Date night? Or just hungry?
      </p>

      <p
        ref={text3}
        className={`md:text-[60px] text-2xl ${
          currentText === "text3" ? `inline` : `hidden`
        } leading-tight text-star`}
      >
        Lets find the right place for you
      </p>
    </div>
    // <div className='h-screen flex md:flex-row '>
    //   <div className='flex-auto flex md:flex-col md:justify-end md:w-2/5 md:py-10 md:px-10'>
    //     <p className='md:text-[60px] text-xl font-semibold font-roboto leading-tight text-start '>
    //       Struggling to choose a restaurant?
    //       <br className='md:hidden' />
    //       <br /> <em>Date night?</em> <em>Just hungry?</em>
    //       <br />
    //       <br className='md:hidden' /> Lets find the right place for you
    //     </p>
    //   </div>

    //   <div
    //     className={`flex-1  bg-[url('https://images.unsplash.com/photo-1548614229-c1fe21dfab63?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]`}
    //   ></div>
    // </div>

    // <div
    //   className={`h-screen flex flex-col justify-center items-center font-inter md:bg-customOrange md:bg-none bg-[url('src/Assets/guyMunching2.gif')] bg-no-repeat bg-cover`}
    // >
    //   <div className='md:w-3/4 sm:w-full h-3/5 flex md:flex-row  flex-col  items-center md:bg-transparent bg-slate-50  bg-opacity-95 p-10 rounded-2xl drop-shadow-lg '>
    //     <div className='md:h-2/3 md:w-2/3 h-full w-full flex flex-col justify-between px-4'>
    //       <p className='md:text-[35px] text-xl font-semibold font-roboto leading-tight text-start'>
    //         Struggling to choose a restaurant?
    //         <br className='md:hidden' />
    //         <br /> Date night? Just hungry?
    //         <br />
    //         <br className='md:hidden' /> Lets find the right place for you
    //       </p>

    //       <div className=' w-full'>
    //         {/* <div className='border-y-[1px] rounded-xl  border-black ' /> */}
    //         <p className='md:text-[70px] text-[40px] font-archivo font-bold leading-tight mt-5'>
    //           Munch Hunt
    //         </p>
    //       </div>
    //     </div>

    //     <div className='md:w-2/4 md:h-4/5 h-0 opacity-0 md:opacity-100 '>
    //       <img
    //         className='rounded-xl h-full w-full'
    //         src='src/Assets/guyMunching2.gif'
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}
