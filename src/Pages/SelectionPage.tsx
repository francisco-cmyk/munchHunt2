import { useEffect, useState } from "react";
import { foodChoices } from "../foodChoices";
import getMergeState from "../utils";
import { Button } from "../Components/Button";
import { XyzTransitionGroup } from "@animxyz/react";
import { useMunchContext } from "../Context/MunchContext";
import { useNavigate } from "react-router-dom";
import { Loader2, } from "lucide-react";

type State = {
  selectedChoices: string[];
  isLoading: boolean;
};

const initialState: State = {
  selectedChoices: [],
  isLoading: false,
};

export default function SelectionPage(): JSX.Element {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const munchContext = useMunchContext();
  const navigate = useNavigate();

  ////

  useEffect(() => {
    //TODO: make this better
    if (state.selectedChoices.length === 5 && !state.isLoading) {
      const huntChosen = randomizeChoices(state.selectedChoices);
      munchContext.setMunchHuntChoice(huntChosen);
      localStorage.setItem("choice", huntChosen);
      navigate("/restaurants");
    }
  }, [state.selectedChoices, state.isLoading]);

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
    mergeState({ isLoading: true });

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
        mergeState({ isLoading: false });
      });
    } else {
      const huntChosen = randomizeChoices(state.selectedChoices);
      munchContext.setMunchHuntChoice(huntChosen);
      localStorage.setItem("choice", huntChosen);
      navigate("/restaurants");
    }
  }

  return (
    <div className='w-full flex justify-center items-center'>
      <div className='h-full w-full flex flex-col justify-start items-center p-10 '>
        {state.isLoading ? (
          <div className='flex min-h-[60px] flex-col justify-center items-center'>
            <Loader2 className='h-[40px] w-[40px] animate-spin text-customOrange duration-1000' />
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <p className='font-inter font-bold text-[25px]'>
              Lets get started!
            </p>
            <p className='font-roboto'>
              Select up to 6 possible cuisines or categories you would want to
              eat.
            </p>
            <p className='font-roboto'>
              If none are selected, <strong>Munch Hunt</strong> will choose one
              for you
            </p>
          </div>
        )}

        <div className='w-2/3 mt-5 min-h-[420px] max-h-[450px] overflow-auto py-2'>
          <Grid
            choices={foodChoices}
            selected={state.selectedChoices}
            onSelect={handleSelect}
          />
        </div>

        <div className='mt-20'>
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
          xyz='fade small out-down out-rotate-right duration-2 appear-stagger '
        >
          {props.choices.map((item, index) => (
            <div key={index} className='h-[50px]'>
              <Button
                className={`
      h-full w-full
     flex justify-center border p-3 rounded-xl shadow-sm
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
