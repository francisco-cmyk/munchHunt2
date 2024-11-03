import { Outlet, useLocation } from "react-router-dom";
import "../index.css";
import { useEffect } from "react";
import { useMunchContext } from "../Context/MunchContext";

export default function Layout() {
  const munchContext = useMunchContext();
  let location = useLocation();

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

  const isLandingPages = location.pathname === "/";

  return (
    <div className='max-h-screen flex flex-col font-inter relative bg-slate-50'>
      {!isLandingPages ? (
        <header className=' w-full bg-customOrange p-3 flex justify-start fixed z-20 top-0 left-0'>
          <p className='font-archivo font-black  tracking-tighter text-[65px] ml-3'>
            Munch Hunt
          </p>
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
