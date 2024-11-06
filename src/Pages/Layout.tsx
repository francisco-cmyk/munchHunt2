import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../index.css";
import { SyntheticEvent, useEffect } from "react";
import { useMunchContext } from "../Context/MunchContext";

export default function Layout() {
  const munchContext = useMunchContext();
  let location = useLocation();

  const naviagte = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      if (position.coords) {
        munchContext.setCoordinates({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
      }
    });
  }, []);

  useEffect(() => {
    if (Object.values(munchContext.currentCoordinates).length > 0) {
      localStorage.setItem(
        "location",
        JSON.stringify(munchContext.currentCoordinates)
      );
    }

    return () => {};
  }, [munchContext.currentCoordinates]);

  function handleHeaderClick(e: SyntheticEvent) {
    e.preventDefault();

    localStorage.removeItem("location");
    naviagte("/location");
  }

  const isLandingPages =
    location.pathname === "/" || location.pathname === "/location";

  return (
    <div className='max-h-screen flex flex-col font-inter relative bg-slate-50'>
      {!isLandingPages ? (
        <header className=' w-full bg-customOrange p-3 flex justify-between items-center fixed z-20 top-0 left-0 cursor-default'>
          <div onClick={(e) => handleHeaderClick(e)}>
            <p className='font-archivo font-black  tracking-tighter md:text-[65px] text-[30px] ml-3'>
              Munch Hunt
            </p>
          </div>
        </header>
      ) : null}

      <main
        className={`flex-1 overflow-y-auto ${
          !isLandingPages ? ` mt-[110px]` : ``
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
function mergeState(arg0: {
  coordinates: { latitude: string; longitude: string };
}) {
  throw new Error("Function not implemented.");
}
