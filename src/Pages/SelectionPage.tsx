import { useEffect, useState } from "react";
import { foodChoices } from "../foodChoices";
import getMergeState from "../utils";
import { Button } from "../Components/Button";
import { XyzTransitionGroup, XyzTransition } from "@animxyz/react";
import { useMunchContext } from "../Context/MunchContext";
import { useNavigate } from "react-router-dom";
import { Loader2, UtensilsCrossed } from "lucide-react";
import Modal from "../Components/Modal";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type State = {
  selectedChoices: string[];
  isLoading: boolean;
  showSelectionModal: boolean;
  isHuntChoosing: boolean;
};

const initialState: State = {
  selectedChoices: [],
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

  useEffect(() => {
    //TODO: make this better
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

  ////

  function handleSelect(choice: string) {
    if (state.selectedChoices.includes(choice)) {
      const filtered = state.selectedChoices.filter(
        (_choice) => _choice !== choice
      );

      mergeState({ selectedChoices: filtered });
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
              randomizeChoices(foodChoices),
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

  function renderSelection() {
    return (
      <Modal>
        <XyzTransition
          appear
          className='bg-customOrange rounded-[15px]
          ring-[9px] ring-customOrange ring-offset-1 ring-offset-transparent ring-opacity-45
          '
          xyz='small-100% origin-center'
        >
          <div className='flex flex-col justify-center items-center  h-[200px] min-w-[400px] max-w-[600px] rounded-[30px] p-4'>
            <p className='font-roboto text-[18px] font-semibold text-white'>
              The Hunt Chose
            </p>
            <p className='font-archivo font-bold text-[65px]'>
              {munchContext.munchHuntChoice}
            </p>
            <XyzTransition
              appear
              className='mb-1'
              xyz='fade flip-left perspective-1 delay-10 duration-10'
            >
              <div>
                <UtensilsCrossed size={35} />
              </div>
            </XyzTransition>
          </div>
        </XyzTransition>
      </Modal>
    );
  }

  return (
    <div className='w-full flex justify-center items-center'>
      {state.showSelectionModal && renderSelection()}
      <div className='h-full w-full flex flex-col justify-start items-center p-10 '>
        {state.isLoading ? (
          <div className='flex min-h-[60px] flex-col justify-center items-center'>
            <Loader2 className='h-[60px] w-[60px] animate-spin text-customOrange duration-1000' />
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <p className='font-inter font-bold text-[25px]'>
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

        <div className='w-2/3 mt-5 max-h-96 min-h-96 overflow-auto py-2'>
          {state.isHuntChoosing ? (
            <XyzTransitionGroup
              className='grid grid-cols-4 gap-4 p-1 py-3'
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
              choices={foodChoices}
              selected={state.selectedChoices}
              onSelect={handleSelect}
            />
          )}
        </div>

        <div className='mt-5 2xl:mt-20'>
          <Button
            disabled={state.isLoading}
            className='w-[200px] h-[50px] text-[25px] font-archivo bg-customOrange text-slate-900 shadow-lg hover:text-white'
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
          className='grid grid-cols-4 gap-4 p-1 py-3'
          xyz='fade small out-down out-rotate-right duration-3 '
        >
          {props.choices.map((item, index) => (
            <div key={index} className='h-[50px]'>
              <Button
                className={` h-full w-full flex justify-center border p-3 rounded-xl shadow-sm
              ${
                props.selected.includes(item)
                  ? `bg-slate-900 hover:text-white`
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

function randomizeChoices(choices: string[]): string {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}
