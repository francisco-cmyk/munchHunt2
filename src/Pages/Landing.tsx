import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";

export default function Landing() {
  const [currentText, setCurrentText] = useState("text1");

  const navigate = useNavigate();

  const text1 = useRef<HTMLParagraphElement | null>(null);
  const text2 = useRef<HTMLParagraphElement | null>(null);
  const text3 = useRef<HTMLParagraphElement | null>(null);

  useGSAP(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted" || result.state === "denied") {
          startAnimation();
        } else {
          startAnimation();
        }
      })
      .catch((error) => {
        navigate("/location");
      });
  }, [text1, text2, text3, currentText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/location");
      setCurrentText("text1");
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  function startAnimation() {
    const time = 2;
    const yScale = 300;
    if (text1.current && currentText === "text1") {
      const text = new SplitType(text1.current, { types: "words" });
      gsap.from(text.words, {
        opacity: 0,
        y: -yScale,
        duration: time,
        ease: "circ",
        onComplete: () => {
          setCurrentText("text2");
        },
      });
    }

    if (text2.current && currentText === "text2") {
      const secondText = new SplitType(text2.current, { types: "words" });
      gsap.from(secondText.words, {
        opacity: 0,
        y: yScale,
        duration: time,
        ease: "circ",
        onComplete: () => {
          setCurrentText("text3");
        },
      });
    }

    if (text3.current && currentText === "text3") {
      const thirdText = new SplitType(text3.current, { types: "words" });
      gsap.from(thirdText.words, {
        opacity: 0,
        x: -100,
        duration: time,
        ease: "circ",
      });
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center font-semibold font-archivo bg-slate-200 text-customOrange dark:bg-slate-900 dark:text-slate-200`}
    >
      <p
        ref={text1}
        className={`md:text-[60px] sm:text-2xl text-lg text-wrap text-center ${
          currentText === "text1" ? `inline` : `hidden`
        }  leading-tight text-star`}
      >
        {"Struggling to choose a restaurant? \u{1FAE0}"}
      </p>

      <p
        ref={text2}
        className={`md:text-[60px] sm:text-2xl ${
          currentText === "text2" ? `inline` : `hidden`
        } leading-tight text-star`}
      >
        Date night? Or just hungry?
      </p>

      <p
        ref={text3}
        className={`md:text-[60px] sm:text-2xl ${
          currentText === "text3" ? `inline` : `hidden`
        } leading-tight text-star`}
      >
        Lets find the right place for you 🍽️
      </p>
    </div>
  );
}
