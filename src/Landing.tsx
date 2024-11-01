import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Components/Card";
import { Input } from "./Components/Input";

export default function Landing(): JSX.Element {
  const cards: { footer: string; source: string }[] = [
    {
      footer: "Korean",
      source:
        "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    // {
    //   footer: "Vietnamese",
    //   source:
    //     "https://images.unsplash.com/photo-1572695064956-52bfdd19cfee?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    {
      footer: "Vietnamese",
      source:
        "https://images.unsplash.com/photo-1572695064956-52bfdd19cfee?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      footer: "Mexican",
      source:
        "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      footer: "Pizza",
      source:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className='h-screen flex flex-col justify-start bg-slate-50 font-inter'>
      {/* <div className="flex justify-center">
        <p>
          Struggling to choose a restaurant? Date night? Just hungry? Lets //
          find the right place for you.
        </p>
      </div> */}
      <div className='flex justify-center items-center h-2/4 '>
        <div className=' bg-custom-sunset-gradient p-6 rounded-lg'>
          <div className='flex justify-center items-center  space-x-7 overflow-x-hidden '>
            {cards.map((card, i) => {
              return (
                <Card
                  key={`$${i}-${card.footer}`}
                  className='bg-white w-[300px] h-[300px] flex flex-col justify-between border-none shadow-lg'
                >
                  <CardContent className='w-full max-h-60 overflow-hidden p-0 rounded-lg rounded-b-none'>
                    <img
                      className='object-contain  transform translate-y-[-40px]'
                      alt='food'
                      src={card.source}
                    />
                  </CardContent>
                  <CardFooter className='px-3'>
                    <p className='font-semibold text-slate-800'>
                      {card.footer}
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className='mt-3'>
        <header className='flex flex-col items-center'>
          <p className='font-inter text-customOrange font-black  tracking-tighter text-[100px]'>
            Munch Hunt
          </p>
        </header>

        <div className='w-full flex justify-center'>
          <div className='w-2/4'>
            <Input type='text' placeholder='Enter your location' />
          </div>
        </div>
      </div>

      {/* <div className='mt-9 flex bg-customOrange p-6 rounded-lg'>
        <p className='mb-3 font-roboto  text-lg text-black'>
          Struggling to choose a restaurant? Date night? Just hungry?
        </p>
        <p className='  font-roboto font-semibold text-xl'>
          Lets find the right place for you.
        </p>{" "}
      </div> */}
    </div>
  );
}
