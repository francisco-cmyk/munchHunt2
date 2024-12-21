import { Clock, Loader2Icon, MapPin, Phone, X } from "lucide-react";
import { useEffect } from "react";
import { cn, formatTimeRange } from "../utils";
import Stars from "./Stars";
import MapComponent from "./MapComponent";
import { Button } from "./Button";
import { Separator } from "./Separator";
import { TabComponent } from "./Tabs";
import { CarouselComponent } from "./Carousel";
import { Business, Days } from "../types";

type ModalProps = {
  class?: string;
  isOpen?: boolean;
  isSmallWindow: boolean;
  isLoading: boolean;
  showClose?: boolean;
  business: Business;
  onClose?: () => void;
};

export default function Modal(props: ModalProps): JSX.Element | null {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [props.onClose, handleClose]);

  const isOpen = props.isOpen ?? true;

  function handleClose() {
    return props.onClose ? props.onClose() : null;
  }

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let mapLink = props.business.displayAddress.replace(/ /g, "+");

  mapLink = "https://www.google.com/maps/search/?api=1&query=1600+" + mapLink;

  if (!isOpen) {
    return null;
  }

  const hours = props.business.hours[0] ?? undefined;

  return (
    <div
      className='fixed inset-0 flex justify-center items-center z-[100] visible bg-black bg-opacity-50'
      onClick={handleClose}
    >
      <div
        className={cn(
          `flex flex-col p-4 rounded-lg sm:bg-slate-50 dark:bg-slate-900   ${
            isOpen ? `animate-scrollOpen` : `animate-scrollClose`
          }`,
          props.class
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {props.isLoading ? (
          <div className='md:w-[850px] md:h-[550px] sm:h-screen h-dvh bg-slate-50 dark:bg-slate-900  rounded-xl px-6 py-3  flex flex-col justify-center items-center  cursor-default'>
            <Loader2Icon className='h-20 w-20 animate-spin text-slate-400 opacity-55' />
          </div>
        ) : (
          <div className='md:w-[850px] md:h-[550px] sm:h-screen h-dvh bg-slate-50 dark:bg-slate-900 rounded-xl px-6 py-3  flex flex-col  cursor-default'>
            <div className='w-full flex justify-between items-center mb-3 '>
              <div className='w-3/4 font-archivo md:text-[30px] text-[20px]  truncate'>
                {props.business.name}
              </div>

              {props.showClose && (
                <div className='' onClick={handleClose}>
                  <X
                    className=' text-black dark:text-white dark:hover:text-slate-700 hover:text-customOrange'
                    size={30}
                  />
                </div>
              )}
            </div>

            <div className='w-full h-full  flex'>
              <div className='md:w-2/4 h-full flex flex-col px-2 '>
                <div className='flex items-center md:h-[50px] h-[50px] mt-1 justify-between'>
                  <Stars
                    rating={props.business.rating}
                    direction='start'
                    iconSize={24}
                  />

                  <p className='font-semibold text-lg mt-2'>
                    {props.business.price ?? "--"}
                  </p>
                </div>

                <div className='flex w-full text-wrap'>
                  {props.business.categories.map((cat, i) => (
                    <p
                      key={`${cat.name}-${i}`}
                      className='mr-1 text-sm italic text-slate-500 font-light'
                    >
                      {cat.title}
                    </p>
                  ))}
                </div>

                <Separator
                  orientation='horizontal'
                  className='h-[2px]  mt-2 dark:bg-slate-400'
                />
                <div className='flex flex-col items-start text-right font-roboto tracking-normal '>
                  <div className='w-full flex justify-between items-center mt-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-sm'>
                    <a href={mapLink} target='_blank' className='text-wrap'>
                      {props.business.displayAddress}
                    </a>
                    <MapPin className='h-[20px] text-slate-500 dark:text-slate-200' />
                  </div>

                  <div className='w-full flex justify-between items-center mt-1 p-1 rounded-sm'>
                    <a href={`tel:${props.business.phone}`}>
                      {props.business.displayPhone}
                    </a>
                    <Phone className='h-[20px] text-slate-500 dark:text-slate-200' />
                  </div>

                  <div className='w-full flex justify-between items-center mt-1 p-1 rounded-sm'>
                    <p>Hours</p>
                    <Clock className='h-[20px] text-slate-500 dark:text-slate-200' />
                  </div>

                  <div className='max-h-[200px] w-full overflow-auto'>
                    {hours ? (
                      <div className='flex flex-col w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-2'>
                        <div className=' overflow-auto w-full flex flex-col items-start'>
                          {hours.open.map((hour, i) => (
                            <div
                              key={`${hour.day}-${i}`}
                              className='w-full flex justify-between text-sm'
                            >
                              <p className='mb-1 px-1'>{Days[hour.day]}: </p>
                              <p> {formatTimeRange(hour.start, hour.end)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className='w-full mt-5'>
                    <Button
                      variant='outline'
                      className='hover:bg-red-400 hover:text-white '
                      onClick={() => window.open(props.business.url, "_blank")}
                    >
                      Visit Yelp page
                    </Button>
                  </div>
                </div>
              </div>

              <div className='flex '>
                <Separator
                  orientation='vertical'
                  className='mr-4 dark:bg-slate-400 '
                />
                <TabComponent
                  tabName={["Map", "Photos"]}
                  tabContent={[
                    {
                      name: "Map",
                      content: (
                        <div>
                          <MapComponent
                            coordintes={props.business.coordinates}
                            height={420}
                          />
                        </div>
                      ),
                    },
                    {
                      name: "Photos",
                      content: (
                        <div className='max-h-full'>
                          <CarouselComponent items={props.business.photos} />
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
