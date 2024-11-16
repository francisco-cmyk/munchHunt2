import { cn, formatTimeRange } from "../utils";
import { Business, Days } from "../types";
import Stars from "./Stars";
import MapComponent from "./MapComponent";
import { Button } from "./Button";
import { CarouselComponent } from "./Carousel";
import { Clock, Loader2Icon, MapPin, Phone, X, Navigation } from "lucide-react";
import { Separator } from "./Separator";
import { AccordionComponent } from "./Accordion";

type ModalProps = {
  class?: string;
  isOpen?: boolean;
  isSmallWindow: boolean;
  isLoading: boolean;
  showClose?: boolean;
  business: Business;
  onClose?: () => void;
};

export default function ModalMobile(props: ModalProps): JSX.Element | null {
  const isOpen = props.isOpen ?? true;

  function handleClose() {
    return props.onClose ? props.onClose() : null;
  }

  let mapLink = props.business.displayAddress.replace(/ /g, "+");

  mapLink = "https://www.google.com/maps/search/?api=1&query=1600+" + mapLink;

  if (!isOpen) {
    return null;
  }

  const hours = props.business.hours[0] ?? undefined;
  const mapWidth = window.innerWidth - 20;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center h-dvh z-[100] ${
        isOpen ? "visible bg-black bg-opacity-50" : "invisible"
      }`}
      onClick={handleClose}
    >
      <div
        className={cn("relative flex flex-col h-dvh ", props.class)}
        onClick={(e) => e.stopPropagation()}
      >
        {props.isLoading ? (
          <div className='w-screen h-dvh bg-slate-50 rounded-xl px-6 py-3  flex flex-col justify-center items-center cursor-default '>
            <Loader2Icon className='h-20 w-20 text-slate-400 animate-spin opacity-55 ' />
          </div>
        ) : (
          <div className='w-screen h-dvh bg-slate-50 flex md:flex-row flex-col cursor-default px-3 overflow-y-scroll'>
            <div className='mt-2 max-h-[200px] '>
              <CarouselComponent
                class='h-[200px]'
                items={props.business.photos}
              />
            </div>

            <div className='flex flex-col items-start'>
              <div className='w-full flex justify-between items-center '>
                <p className='font-archivo md:text-[30px] text-[20px] text-wrap '>
                  {props.business.name}
                </p>

                <Stars
                  rating={props.business.rating}
                  direction='start'
                  iconSize={15}
                />
              </div>

              <p className='font-semibold '>{props.business.price ?? "--"}</p>

              <div className='flex w-full text-wrap py-1'>
                {props.business.categories.map((cat, i) => (
                  <p
                    key={`${cat.name}-${i}`}
                    className='mr-1 text-xs italic text-slate-500 font-light'
                  >
                    {cat.title}
                  </p>
                ))}
              </div>

              <Separator
                orientation='horizontal'
                className='h-[2px] mt-1 mb-2'
              />
            </div>

            <div className='flex flex-col items-start text-right font-roboto tracking-normal'>
              <div
                className='flex justify-between w-full items-center mt-1 hover:bg-slate-200 rounded-sm'
                onClick={() => window.open(mapLink, "_blank")}
              >
                <a
                  href={mapLink}
                  target='_blank'
                  className='text-wrap text-left text-sm'
                >
                  {props.business.displayAddress}
                </a>
                <MapPin className='h-[20px] text-slate-500' />
              </div>

              <div className='flex justify-between w-full items-center mt-3 rounded-sm hover:bg-slate-200'>
                <a
                  href={`tel:${props.business.phone}`}
                  className='text-wrap text-left text-sm'
                >
                  {props.business.displayPhone}
                </a>
                <Phone className='h-[20px] text-slate-500' />
              </div>
              <AccordionComponent
                class='w-full mt-2'
                triggerClass='h-[30px] text-sm p-0 font-normal px-[2px]'
                title='Hours'
              >
                {hours ? (
                  <div className='flex flex-col w-full bg-slate-100 rounded-lg p-2'>
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
              </AccordionComponent>

              <div
                className='w-full mt-3 flex justify-between  p-1 rounded-sm hover:bg-red-400 hover:text-white'
                onClick={() => window.open(props.business.url, "_blank")}
              >
                <p className='text-sm'> Visit Yelp page</p>
                <Navigation className='h-[20px] text-slate-500' />
              </div>

              <div className='mt-4 mb-3'>
                <MapComponent
                  coordintes={props.business.coordinates}
                  height={300}
                  width={mapWidth}
                />
              </div>
            </div>

            <div className='fixed w-full flex bottom-1'>
              <Button onClick={handleClose}>close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
