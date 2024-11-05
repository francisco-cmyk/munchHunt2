import { XyzTransition } from "@animxyz/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [showFirstPage, setShowFirstPage] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstPage(false);
      navigate("/location");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <XyzTransition appear xyz='small-100%  origin-center ease-out-back'>
      <div className='h-screen flex flex-col justify-between font-inter bg-customOrange'>
        <header className='flex flex-col items-center'>
          <p className='font-archivo font-black text-white  tracking-tighter text-[50px] mt-10'>
            Munch Hunt
          </p>
        </header>

        <div className='h-2/3 w-full flex flex-col items-center justify-center font-archivo text-black'>
          <div className='w-2/5'>
            <XyzTransition appear xyz='fade small stagger delay-10'>
              <p className='text-black text-[36px] font-bold leading-tight'>
                Struggling to choose a restaurant? Date night? Just hungry?
              </p>
            </XyzTransition>
          </div>
          <div className='w-2/5 mt-20 flex '>
            <XyzTransition appear xyz='fade small stagger delay-20 leading-10'>
              <p className=' text-[25px]'>Lets find the right place</p>
            </XyzTransition>
            <XyzTransition appear xyz='fade small stagger delay-25'>
              <p className='font-bold text-[60px] ml-4 '>for you.</p>
            </XyzTransition>
          </div>
        </div>
        <div className='h-2/5'></div>
      </div>
    </XyzTransition>
  );
}
