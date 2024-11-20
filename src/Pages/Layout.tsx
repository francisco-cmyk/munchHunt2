import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../index.css";
import { SyntheticEvent, useEffect } from "react";
import { useMunchContext } from "../Context/MunchContext";
import { useDarkMode } from "../Context/DarkModeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "../Components/Button";

export default function Layout() {
  const munchContext = useMunchContext();
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  let location = useLocation();

  const naviagte = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) return;

    if (
      munchContext.currentCoordinates.latitude.length === 0 &&
      munchContext.currentCoordinates.longitude.length === 0
    ) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position.coords) {
          const coordinates = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          };
          munchContext.setCoordinates(coordinates);
          localStorage.setItem("location", JSON.stringify(coordinates));
        }
      });
    }
  }, []);

  function handleHeaderClick(e: SyntheticEvent) {
    e.preventDefault();

    localStorage.removeItem("location");
    naviagte("/location");
  }

  const isLandingPages =
    location.pathname === "/" || location.pathname === "/location";

  return (
    <div className='sm:max-h-screen sm:h-screen h-dvh flex flex-col font-inter relative bg-slate-50 dark:bg-slate-950 cursor-default'>
      {!isLandingPages ? (
        <header className=' w-full bg-customOrange dark:bg-slate-600 p-3 flex justify-between items-center fixed z-20 top-0 left-0 cursor-default shadow-[0px_4px_6px_rgba(0,0,0,0.1)]'>
          <div onClick={(e) => handleHeaderClick(e)}>
            <p className='font-archivo font-black  tracking-tighter md:text-[65px] text-[30px] ml-3 '>
              Munch Hunt
            </p>
          </div>
          <div>
            <Button
              size='icon'
              variant='ghost'
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun /> : <Moon className='text-white' />}
            </Button>
          </div>
        </header>
      ) : null}

      <main
        className={`flex-1 overflow-y-auto ${
          !isLandingPages ? `sm:mt-[110px] mt-16` : ``
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
