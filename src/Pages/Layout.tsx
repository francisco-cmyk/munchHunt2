import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../index.css";
import { SyntheticEvent, useEffect } from "react";
import { useDarkMode } from "../Context/DarkModeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "../Components/Button";
import ThemeButton from "../Components/ThemeButton";

export default function Layout() {
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const location = useLocation();

  const naviagte = useNavigate();

  function handleHeaderClick(e: SyntheticEvent) {
    e.preventDefault();

    localStorage.removeItem("location");
    naviagte("/");
  }

  const shouldDisableHeader =
    location.pathname === "/" ||
    location.pathname === "/location" ||
    location.pathname === "/restaurants";

  return (
    <div className='sm:min-h-screen min-h-dvh flex flex-col font-inter relative bg-slate-50 dark:bg-slate-950 cursor-default bg-gradient-to-b from-background to-background/50'>
      {!shouldDisableHeader ? (
        <header className=' sm:h-20 h-14 w-full bg-customOrange dark:bg-slate-600 p-3 flex justify-between items-center fixed z-20 top-0 left-0 cursor-default shadow-[0px_4px_6px_rgba(0,0,0,0.1)]'>
          <div onClick={(e) => handleHeaderClick(e)}>
            <p className='font-archivo font-black md:text-3xl text-2xl ml-3 '>
              Munch Hunt
            </p>
          </div>
          <div>
            <ThemeButton />
          </div>
        </header>
      ) : null}

      <main
        className={`flex-1 overflow-y-auto ${
          !shouldDisableHeader ? `mt-16` : ``
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
