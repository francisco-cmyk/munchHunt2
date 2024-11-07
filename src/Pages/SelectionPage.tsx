import { useEffect, useMemo, useRef, useState } from "react";
import { foodChoices } from "../foodChoices";
import getMergeState from "../utils";
import { Button } from "../Components/Button";
import { XyzTransitionGroup, XyzTransition } from "@animxyz/react";
import { useMunchContext } from "../Context/MunchContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, UtensilsCrossed, X, XCircle } from "lucide-react";
import Modal from "../Components/Modal";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Tooltip, TooltipContent } from "@radix-ui/react-tooltip";
import ToolTip from "../Components/Tooltip";

type State = {
  selectedChoices: string[];
  excludedChoices: string[];
  isLoading: boolean;
  showSelectionModal: boolean;
  isHuntChoosing: boolean;
};

const initialState: State = {
  selectedChoices: [],
  excludedChoices: [],
  isLoading: false,
  showSelectionModal: false,
  isHuntChoosing: false,
};

export default function SelectionPage(): JSX.Element {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const munchContext = useMunchContext();
  const navigate = useNavigate();

  ////

  const windowWidth = window.innerWidth;

  const filteredFoodChoices = useMemo(() => {
    return foodChoices.filter((food) => !state.excludedChoices.includes(food));
  }, [state.excludedChoices]);

  useEffect(() => {
    if (
      state.selectedChoices.length === 5 &&
      !state.isLoading &&
      state.isHuntChoosing
    ) {
      const huntChosen = randomizeChoices(state.selectedChoices);
      munchContext.setMunchHuntChoice(huntChosen);
      localStorage.setItem("choice", huntChosen);
      mergeState({ showSelectionModal: true });
    }
  }, [state.selectedChoices, state.isLoading, state.isHuntChoosing]);

  useEffect(() => {
    if (state.showSelectionModal) {
      setTimeout(() => {
        mergeState({ showSelectionModal: false });
        navigate("/restaurants");
      }, 3000); //3s
    }
  }, [state.showSelectionModal]);

  const sidePanel = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const isOpen = state.excludedChoices.length > 0;
    if (!isOpen) {
      gsap.to(sidePanel.current, {
        width: 0,
        translateX: 100,
        duration: 1,
        ease: "power3.out",
      });
    } else {
      gsap.to(sidePanel.current, {
        width: 400,
        translateX: 0,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, [sidePanel, state.excludedChoices]);

  ////

  function handleSelect(choice: string) {
    if (state.excludedChoices.includes(choice)) {
      const filtered = state.excludedChoices.filter(
        (_choice) => _choice !== choice
      );
      mergeState({ excludedChoices: filtered });
    } else if (state.selectedChoices.includes(choice)) {
      const filtered = state.selectedChoices.filter(
        (_choice) => _choice !== choice
      );

      mergeState({
        selectedChoices: filtered,
        excludedChoices: [...state.excludedChoices, choice],
      });
    } else {
      mergeState({ selectedChoices: [...state.selectedChoices, choice] });
    }
  }

  function randomizeSelection(delay: number): Promise<void> {
    mergeState({ isLoading: true, isHuntChoosing: true });

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setState((prevState) => {
          return {
            ...prevState,
            selectedChoices: [
              ...prevState.selectedChoices,
              randomizeChoices(filteredFoodChoices),
            ],
          };
        });
        resolve();
      }, delay);
    });
  }

  async function runLoop() {
    for (let i = 0; i < 5; i++) {
      await randomizeSelection(i + 1 * 1000);
    }
  }

  function handleSubmit() {
    const hasNoSelections = state.selectedChoices.length === 0;

    if (hasNoSelections) {
      runLoop().then(() => {
        setTimeout(() => {
          mergeState({ isLoading: false });
        }, 600);
      });
    } else {
      const huntChosen = randomizeChoices(state.selectedChoices);
      munchContext.setMunchHuntChoice(huntChosen);
      localStorage.setItem("choice", huntChosen);
      mergeState({ showSelectionModal: true });
    }
  }

  return (
    <div className=' w-full flex md:flex-row flex-col justify-center items-center'>
      {state.showSelectionModal && SelectionModal(munchContext.munchHuntChoice)}

      <div className='h-full md:w-3/4 w-5/6 text-center md:text-left  flex flex-col justify-start items-center md:p-10 '>
        {state.isLoading ? (
          <div className='flex min-h-[60px] flex-col justify-center items-center'>
            <Loader2 className='h-[60px] w-[60px] animate-spin text-customOrange duration-1000' />
            <p className='mt-3 font-inter text-slate-700'>chosing for you...</p>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <p className='font-anton font-bold text-[25px]'>
              Lets get started!
            </p>
            <p className='font-roboto'>
              Select several cuisines or categories you would want to eat.
            </p>
            <p className='font-roboto'>
              If none are selected, <strong>Munch Hunt</strong> will choose one
              for you
            </p>
          </div>
        )}

        <div className='2xl:w-2/3 md:w-5/6 w-full  mt-5 max-h-96 min-h-96  overflow-auto py-2'>
          {state.isHuntChoosing ? (
            <XyzTransitionGroup
              className='md:grid grid-cols-4 gap-4 p-1 py-3'
              xyz='fade small out-down out-rotate-right appear-stagger'
            >
              {state.selectedChoices.map((choice, index) => (
                <div key={`${index}-${choice}`}>
                  <Button
                    className={` h-full w-full flex justify-center border p-3 rounded-xl shadow-sm bg-slate-900 hover:text-white`}
                  >
                    <p className='font-semibold text-lg'>{choice}</p>
                  </Button>
                </div>
              ))}
            </XyzTransitionGroup>
          ) : (
            <Grid
              choices={filteredFoodChoices}
              selected={state.selectedChoices}
              onSelect={handleSelect}
            />
          )}
        </div>

        <div className='mt-10 md:mb-0 mb-5 2xl:mt-20 '>
          <Button
            disabled={state.isLoading}
            className='w-[200px] h-[50px] text-[25px] font-archivo bg-customOrange text-slate-900 shadow-lg hover:text-white'
            onClick={handleSubmit}
          >
            Hunt
          </Button>
        </div>
      </div>

      <div
        ref={sidePanel}
        className={`min-h-[500px] max-h-[500px]  flex flex-col overflow-hidden ${
          state.excludedChoices.length > 0
            ? "w-[400px] py-3 px-4 border-l-2 "
            : "w-0 hidden md:flex "
        }`}
      >
        <div className='h-full w-full '>
          <div className='h-1/5 w-full flex justify-between '>
            <p className='font-inter text-slate-500 text-[20px] mb-3 font-semibold '>
              Excluded Choices
            </p>

            <ToolTip
              className='bg-slate-500 opacity-80 '
              side='left'
              content={<p className='text-white'>Remove all from excluded</p>}
            >
              <X
                className=' text-slate-400 '
                onClick={(e) => {
                  e.preventDefault();
                  mergeState({ excludedChoices: [] });
                }}
              />
            </ToolTip>
          </div>
          <div className='max-h-[28rem] flex flex-col overflow-auto'>
            {state.excludedChoices.map((choice, index) => (
              <Button
                key={index}
                variant='secondary'
                className='mb-1 hover:bg-slate-900 hover:text-white border-2 w-full flex justify-start'
                onClick={() => handleSelect(choice)}
              >
                {windowWidth > 700 ? <ArrowLeft /> : <X />}
                {choice}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type GridProps = {
  choices: string[];
  selected: string[];
  onSelect: (value: string) => void;
};

function Grid(props: GridProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='h-full'>
      {isVisible && (
        <XyzTransitionGroup
          appear
          className='md:grid md:grid-cols-4 md:gap-4 md:p-1 md:py-3 grid grid-cols-2 '
          xyz='fade small out-down out-rotate-right-0 duration-3 '
        >
          {props.choices.map((item, index) => (
            <div key={`${index}-${item}`} className='h-[50px]'>
              <Button
                className={` h-full w-full flex justify-center border p-3 rounded-xl shadow-sm
              ${
                props.selected.includes(item)
                  ? `bg-slate-900 hover:text-white hover:bg-red-500 `
                  : `bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white`
              }
             `}
                onClick={() => props.onSelect(item)}
              >
                <p className='font-semibold text-lg'>{item}</p>
              </Button>
            </div>
          ))}
        </XyzTransitionGroup>
      )}
    </div>
  );
}

function SelectionModal(munchChoice: string) {
  return (
    <Modal>
      <XyzTransition
        appear
        className='bg-customOrange rounded-[15px]
        ring-[9px] ring-customOrange ring-offset-1 ring-offset-transparent ring-opacity-45
        '
        xyz='small-100% origin-center'
      >
        <div className='flex flex-col justify-center items-center  h-[200px] md:min-w-[400px] min-w-72 md:max-w-[600px] rounded-[30px] md:p-4 px-2'>
          <p className='font-roboto text-[18px] font-semibold text-white'>
            The Hunt Chose
          </p>
          <p className='font-archivo font-bold md:text-[65px] text-[40px] text-wrap'>
            {munchChoice}
          </p>
          <XyzTransition
            appear
            className='mb-1'
            xyz='fade flip-left perspective-1 delay-10 duration-10'
          >
            <div className='mt-4 md:mt-0'>
              <UtensilsCrossed size={35} />
            </div>
          </XyzTransition>
        </div>
      </XyzTransition>
    </Modal>
  );
}

function randomizeChoices(choices: string[]): string {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}
