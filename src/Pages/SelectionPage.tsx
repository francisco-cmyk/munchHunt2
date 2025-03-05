import { useEffect, useMemo, useState } from "react";
import getMergeState, {
  randomizeChoice,
  randomizeMultipleChoices,
} from "../utils";
import { Button } from "../Components/Button";
import { XyzTransitionGroup, XyzTransition } from "@animxyz/react";
import { useMunchContext } from "../Context/MunchContext";
import { useNavigate } from "react-router-dom";
import { LoaderIcon, Shuffle, UtensilsCrossed, X } from "lucide-react";
import GenericModal from "../Components/GenericModal";
import useGetCategories from "../Hooks/useGetCategories";
import { Skeleton } from "../Components/Skeleton";

const CuisineStates = {
  Unselected: "unselected",
  Selected: "selected",
  Excluded: "excluded",
} as const;

type CuisineState = (typeof CuisineStates)[keyof typeof CuisineStates];

type CuisineOption = {
  id: string;
  name: string;
  state: CuisineState;
};

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

  const { data: _categories = [], isFetching: isLoadingCategories } =
    useGetCategories({
      coordinates: munchContext.currentCoordinates,
    });

  let categories: CuisineOption[] = _categories.map((category) => ({
    id: category,
    name: category,
    state: CuisineStates.Unselected,
  }));

  ////

  const filteredFoodChoices = useMemo(() => {
    let filteredCategories = categories;

    if (state.excludedChoices.length > 0) {
      filteredCategories = filteredCategories.map((choice) => {
        if (state.excludedChoices.includes(choice.name)) {
          return {
            ...choice,
            state: CuisineStates.Excluded,
          };
        }
        return choice;
      });
    }
    if (state.selectedChoices.length > 0) {
      filteredCategories = filteredCategories.map((choice) => {
        if (state.selectedChoices.includes(choice.name)) {
          return {
            ...choice,
            state: CuisineStates.Selected,
          };
        }
        return choice;
      });
    }
    return filteredCategories;
  }, [categories, state.excludedChoices, state.selectedChoices]);

  const categoriesLimit =
    filteredFoodChoices.length < 8 ? filteredFoodChoices.length : 8;

  useEffect(() => {
    if (
      state.selectedChoices.length > 0 &&
      !state.isLoading &&
      state.isHuntChoosing
    ) {
      const huntChosen = randomizeChoice(state.selectedChoices);
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
      }, 3000);
    }
  }, [state.showSelectionModal]);

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

  async function processChoices(choices: CuisineOption[]): Promise<void> {
    for (const choice of choices) {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          setState((prevState) => {
            return {
              ...prevState,
              selectedChoices: [...prevState.selectedChoices, choice.name],
            };
          });
          resolve();
        }, 500)
      );
    }
  }

  function handleSubmit() {
    const hasNoSelections = state.selectedChoices.length === 0;

    if (hasNoSelections) {
      mergeState({ isLoading: true, isHuntChoosing: true });
      const newChoices = randomizeMultipleChoices(
        filteredFoodChoices,
        categoriesLimit
      );
      processChoices(newChoices).then(() => {
        setTimeout(() => {
          mergeState({ isLoading: false });
        }, 1000);
      });
    } else {
      const huntChosen = randomizeChoice(state.selectedChoices);
      munchContext.setMunchHuntChoice(huntChosen);
      localStorage.setItem("choice", huntChosen);
      mergeState({ isLoading: true });
      setTimeout(() => {
        mergeState({ showSelectionModal: true, isLoading: false });
      }, 2000);
    }
  }

  return (
    <div className='max-h-screendark:bg-transparent px-4 sm:py-12 py-6'>
      {state.showSelectionModal && SelectionModal(munchContext.munchHuntChoice)}

      <div className='mx-auto max-w-6xl'>
        {state.isLoading ? (
          <div className='flex h-16 mb-6 flex-col justify-center items-center'>
            <LoaderIcon className='sm:h-[60px] sm:w-[60px] h-7 w-7 animate-spin text-customOrange dark:text-slate-400 duration-1000' />
            <p className='mt-2 font-semibold text-slate-700 sm:text-base text-sm'>
              Munch Hunt is choosing for you...
            </p>
          </div>
        ) : (
          <div className='sm:text-center'>
            <h1 className='sm:mb-4 md:text-4xl text-2xl text-center font-bold tracking-tight text-slate-900 dark:text-slate-100'>
              Let's get started!
            </h1>
            <p className='mb-2 sm:text-base text-xs text-slate-600 dark:text-slate-300'>
              Choose multiple cuisines or categories you'd like, or double-click
              to exclude an option.
            </p>
            <p className='sm:mb-12 mb-6 sm:text-base text-xs text-slate-600 dark:text-slate-300'>
              Can't decide? Munch Hunt will pick one for you if no options are
              selected
            </p>
          </div>
        )}

        <div className='mb-6'>
          {state.isHuntChoosing ? (
            <XyzTransitionGroup
              className='md:grid grid-cols-4 gap-4 p-1 py-3'
              xyz='fade small out-down out-rotate-right appear-stagger'
            >
              {state.selectedChoices.map((choice, index) => (
                <div key={`${index}-${choice}`}>
                  <Button
                    className={`relative bg-slate-700 dark:text-white flex sm:h-14 h-11 w-full items-center justify-center rounded-lg border border-gray-200 text-center font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FF7043] focus:dark:ring-slate-300 focus:ring-offset-2`}
                  >
                    <p className='font-semibold text-lg'>{choice}</p>
                  </Button>
                </div>
              ))}
            </XyzTransitionGroup>
          ) : (
            <Grid
              cuisines={filteredFoodChoices}
              selected={state.selectedChoices}
              isLoading={isLoadingCategories}
              onSelect={handleSelect}
            />
          )}
        </div>

        <div className='text-center'>
          <Button
            size='lg'
            className={`sm:h-14 sm:mb-0 mb-5 h-11 bg-[#FF7043] dark:bg-slate-800 dark:text-white px-8 text-lg font-semibold hover:bg-orange-600 hover:dark:bg-slate-500 ${
              state.isHuntChoosing ? "hidden" : ""
            }`}
            onClick={handleSubmit}
          >
            <Shuffle className='mr-2 h-5 w-5' />
            Hunt
          </Button>
        </div>
      </div>
    </div>
  );
}

type GridProps = {
  cuisines: CuisineOption[];
  selected: string[];
  isLoading: boolean;
  onSelect: (value: string) => void;
};

function Grid(props: GridProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!props.isLoading) {
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }
  }, [props.isLoading]);

  return (
    <div className='2xl:max-h-fit md:max-h-2/3 max-h-80 overflow-y-scroll '>
      {isVisible ? (
        <XyzTransitionGroup
          appear
          className='sm:p-1 p-2 grid sm:gap-4 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '
          xyz='fade small out-down out-rotate-right-0 duration-3 '
        >
          {props.cuisines.map((cuisine, index) => (
            <div key={`${index}-${cuisine}`}>
              <Button
                className={`relative flex sm:h-14 h-11 w-full items-center justify-center rounded-lg border border-gray-200 text-center font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FF7043] focus:dark:ring-slate-300 focus:ring-offset-2 ${getButtonStyles(
                  cuisine.state
                )}`}
                onClick={() => props.onSelect(cuisine.name)}
              >
                {cuisine.name}
              </Button>
            </div>
          ))}
        </XyzTransitionGroup>
      ) : (
        <div className='sm:p-1 p-2 grid sm:gap-4 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {new Array(16).fill(null).map((_, index) => (
            <Skeleton
              key={index}
              className='relative flex sm:h-14 h-11 w-full items-center justify-center rounded-lg  text-center font-medium shadow-sm transition-all'
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getButtonStyles(state: CuisineState) {
  switch (state) {
    case "selected":
      return "bg-[#FF7043] dark:bg-slate-500 text-white hover:bg-[#FF7043]/90 hover:dark:bg-slate-700";
    case "excluded":
      return "bg-red-100 dark:bg-red-300 dark:text-red-800 text-red-500 hover:bg-red-200";
    default:
      return "bg-white dark:bg-slate-200 text-black hover:bg-gray-50 hover:dark:bg-gray-500";
  }
}

function SelectionModal(munchChoice: string) {
  return (
    <GenericModal class='md:bg-transparent'>
      <XyzTransition
        appear
        className='bg-customOrange dark:bg-slate-700 ring-customOrange dark:ring-slateDark rounded-[15px]
        ring-[9px] ring-offset-1 ring-offset-transparent ring-opacity-45 dark:ring-opacity-45
        '
        xyz='small-100% origin-center'
      >
        <div className='flex flex-col justify-evenly items-center  sm:h-[200px] h-[150px] md:min-w-[400px] min-w-64 md:max-w-[600px] rounded-[30px] md:p-4 px-2'>
          <p className='font-roboto sm:text-lg text-base font-semibold text-white dark:text-slate-200'>
            The Hunt Chose
          </p>
          <p className='font-archivo font-bold sm:text-4xl text-2xl text-wrap dark:text-slate-200'>
            {munchChoice}
          </p>
          <XyzTransition
            appear
            className='mb-1'
            xyz='fade flip-left perspective-1 delay-10 duration-10'
          >
            <div>
              <UtensilsCrossed className='dark:text-slate-200 w-8 h-10' />
            </div>
          </XyzTransition>
        </div>
      </XyzTransition>
    </GenericModal>
  );
}
