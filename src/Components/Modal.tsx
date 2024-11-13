import { Clock, MapPin, Phone, X } from "lucide-react";
import { useEffect } from "react";
import { cn, formatTimeRange } from "../utils";
import Stars from "./Stars";
import MapComponent from "./MapComponent";
import { Button } from "./Button";
import { Separator } from "./Separator";
import { Accordion } from "@radix-ui/react-accordion";
import { AccordionComponent } from "./Accordion";
import { TabComponent } from "./Tabs";
import { CarouselComponent } from "./Carousel";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const Days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type Business = {
  name: string;
  id: string;
  displayAddress: string;
  rating: number;
  transactions: string[];
  price: string;
  phone: string;
  displayPhone: string;
  coordinates: Coordinates;
  categories: { name: string; title: string }[];
  photos: string[];
  url: string;
  hours: {
    hoursType: string;
    isOpenNow: boolean;
    open: {
      day: number;
      end: string;
      isOvernight: boolean;
      start: string;
    }[];
  }[];
};

type ModalProps = {
  class?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isSmallWindow: boolean;
  showClose?: boolean;
  business: Business;
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
          `flex flex-col p-4 rounded-lg  max-w-full max-h-full sm:bg-slate-50  ${
            isOpen ? `animate-scrollOpen` : `animate-scrollClose`
          }`,
          props.class
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='md:w-[850px] md:h-[550px] sm:h-screen h-dvh bg-slate-50 rounded-xl px-6 py-3  flex flex-col  cursor-default'>
          <div className='w-full flex justify-between items-center mb-3 '>
            <p className=' font-archivo md:text-[30px] text-[20px] text-wrap '>
              {props.business.name}
            </p>

            {props.showClose && (
              <div className='' onClick={handleClose}>
                <X className=' text-black hover:text-customOrange' size={30} />
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

              <Separator orientation='horizontal' className='h-[2px]  mt-2' />
              <div className='flex flex-col items-start text-rightfont-roboto tracking-normal '>
                <div className='w-full flex justify-between items-center mt-1 p-1 hover:bg-slate-200 rounded-sm'>
                  <a href={mapLink} target='_blank' className='text-wrap'>
                    {props.business.displayAddress}
                  </a>
                  <MapPin className='h-[20px] text-slate-500' />
                </div>

                <div className='w-full flex justify-between items-center mt-1 p-1 rounded-sm'>
                  <a href={`tel:${props.business.phone}`}>
                    {props.business.displayPhone}
                  </a>
                  <Phone className='h-[20px] text-slate-500' />
                </div>

                <AccordionComponent title='Hours' class='w-full' isOpen>
                  {hours ? (
                    <div className='flex flex-col w-full '>
                      <div className=' overflow-auto w-full flex flex-col items-start'>
                        {hours.open.map((hour, i) => (
                          <p
                            key={`${hour.day}-${i}`}
                            className='text-sm mb-1 px-2'
                          >
                            {Days[hour.day]}:{" "}
                            {formatTimeRange(hour.start, hour.end)}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </AccordionComponent>
              </div>
            </div>

            <div className='flex'>
              <Separator orientation='vertical' className='mr-4' />
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

              {/* <div>
                <MapComponent
                  coordintes={props.business.coordinates}
                  height={450}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
