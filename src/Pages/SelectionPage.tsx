import { useEffect, useMemo, useRef, useState } from "react";
import { foodChoices } from "../foodChoices";
import getMergeState, { randomizeChoices } from "../utils";
import { Button } from "../Components/Button";
import { XyzTransitionGroup, XyzTransition } from "@animxyz/react";
import { useMunchContext } from "../Context/MunchContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, UtensilsCrossed, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ToolTip from "../Components/Tooltip";
import GenericModal from "../Components/GenericModal";

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
      state.selectedChoices.length === 8 &&
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
        translateX: -400,
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
    for (let i = 0; i < 8; i++) {
      await randomizeSelection(i + 1 * 700);
    }
  }

  function handleSubmit() {
    const hasNoSelections = state.selectedChoices.length === 0;

    if (hasNoSelections) {
      runLoop().then(() => {
        setTimeout(() => {
          mergeState({ isLoading: false });
        }, 2000);
      });
    } else {
      const huntChosen = randomizeChoices(state.selectedChoices);
      munchContext.setMunchHuntChoice(huntChosen);
      localStorage.setItem("choice", huntChosen);
      mergeState({ isLoading: true });
      setTimeout(() => {
        mergeState({ showSelectionModal: true, isLoading: false });
      }, 2000);
    }
  }

  return (
    <div className='w-full flex md:flex-row flex-col-reverse md:pt-0 pt-10 justify-center items-center '>
      {state.showSelectionModal && SelectionModal(munchContext.munchHuntChoice)}

      <div
        ref={sidePanel}
        className={`sm:min-h-[500px] max-h-[500px]  flex flex-col  overflow-hidden ${
          state.excludedChoices.length > 0
            ? "sm:w-[400px] sm:px-4 max-w-full md:border-r-2 py-3 items-center "
            : "w-0 hidden md:flex "
        }`}
      >
        <div className='h-full sm:w-full w-4/6'>
          <div className='h-1/5 w-full flex justify-between item '>
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
                className='mb-1 hover:bg-slate-900 dark:hover:bg-slate-600 hover:text-white border-2 w-full flex justify-between'
                onClick={() => handleSelect(choice)}
              >
                {choice}
                {windowWidth > 700 ? <ArrowRight /> : <X />}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className='h-full md:w-3/4 w-5/6 text-center md:text-left  flex flex-col justify-start items-center md:p-10 '>
        {state.isLoading ? (
          <div className='flex min-h-[60px] flex-col justify-center items-center'>
            <Loader2 className='h-[60px] w-[60px] animate-spin text-customOrange dark:text-slate-400 duration-1000' />
            <p className='mt-2 font-inter text-slate-700'>
              choosing for you...
            </p>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <p className='font-anton font-bold sm:text-[25px] text-lg'>
              Lets get started!
            </p>
            <p className='font-roboto sm:text-xl text-[12px]'>
              Select several cuisines or categories you would want to eat.
            </p>
            <p className='font-roboto sm:text-xl text-[12px]'>
              If none are selected, <strong>Munch Hunt</strong> will choose one
              for you
            </p>
          </div>
        )}

        <div className='2xl:w-full md:w-5/6 w-full  mt-5 sm:max-h-96 sm:min-h-96 max-h-72 min-h-64 overflow-auto py-2'>
          {state.isHuntChoosing ? (
            <XyzTransitionGroup
              className='md:grid grid-cols-4 gap-4 p-1 py-3'
              xyz='fade small out-down out-rotate-right appear-stagger'
            >
              {state.selectedChoices.map((choice, index) => (
                <div key={`${index}-${choice}`}>
                  <Button
                    className={`sm:h-full h-[45px] w-full flex justify-center border p-3 rounded-xl shadow-sm bg-slate-900 dark:bg-slate-300 hover:text-white`}
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

        <div className='mt-5 md:mb-0 mb-5 2xl:mt-20 '>
          <Button
            disabled={state.isLoading}
            className='w-[200px] sm:h-[50px] text-[25px] font-archivo bg-customOrange dark:bg-slate-500 text-slate-900 shadow-lg hover:text-white dark:hover:bg-slate-600'
            onClick={handleSubmit}
          >
            Hunt
          </Button>
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
          className='md:grid md:grid-cols-4 md:gap-4 md:p-1 md:py-3 grid grid-cols-1 '
          xyz='fade small out-down out-rotate-right-0 duration-3 '
        >
          {props.choices.map((item, index) => (
            <div key={`${index}-${item}`} className='sm:h-[50px] h-[45px]'>
              <Button
                className={` h-full w-full flex justify-center border p-3 rounded-xl shadow-sm overflow-hidden
              ${
                props.selected.includes(item)
                  ? `bg-slate-900 dark:bg-slate-600 dark:text-white hover:text-white hover:bg-red-500 `
                  : `bg-slate-50 text-slate-900 dark:text-slate-200 hover:bg-slate-900 hover:text-white dark:bg-transparent dark:hover:bg-slate-600`
              }
             `}
                onClick={() => props.onSelect(item)}
              >
                <p className='font-semibold sm:text-lg text-sm text-ellipsis'>
                  {item}
                </p>
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
    <GenericModal class='md:bg-transparent'>
      <XyzTransition
        appear
        className='bg-customOrange dark:bg-slate-500  rounded-[15px]
        ring-[9px] ring-customOrange dark:ring-slate-500 ring-offset-1 ring-offset-transparent ring-opacity-45
        '
        xyz='small-100% origin-center'
      >
        <div className='flex flex-col justify-center items-center  h-[200px] md:min-w-[400px] min-w-72 md:max-w-[600px] rounded-[30px] md:p-4 px-2'>
          <p className='font-roboto text-[18px] font-semibold text-white dark:text-slate-200'>
            The Hunt Chose
          </p>
          <p className='font-archivo font-bold md:text-[65px] text-[40px] text-wrap dark:text-slate-200'>
            {munchChoice}
          </p>
          <XyzTransition
            appear
            className='mb-1'
            xyz='fade flip-left perspective-1 delay-10 duration-10'
          >
            <div className='mt-4 md:mt-0'>
              <UtensilsCrossed size={35} className='dark:text-slate-200' />
            </div>
          </XyzTransition>
        </div>
      </XyzTransition>
    </GenericModal>
  );
}
