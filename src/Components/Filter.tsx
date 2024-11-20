import { Button } from "./Button";

export type Option = {
  label: string;
  value: string;
};

type FilterProps = {
  options: Option[];
  filterName: string;
  disabled?: boolean;
  label?: string;
  value: string;
  handleChange: (params: { name: string; value: string }) => void;
};

export default function Filter(props: FilterProps) {
  const isDisabled = props.disabled ?? false;
  return (
    <div className='flex flex-col '>
      {props.label && (
        <p className='font-roboto text-slate-500 mt-2 dark:text-slate-100'>
          {props.label}
        </p>
      )}

      {props.options.map((option, index) => (
        <Button
          key={index}
          disabled={isDisabled}
          variant='outline'
          className={`mb-1 hover:bg-slate-900 dark:bg-slate-700 dark:text-slate-100 hover:text-white border-[1px] w-full h-[30px] flex justify-between ${
            props.value === option.value
              ? `bg-customOrange dark:bg-orange-600 text-white `
              : ``
          }`}
          onClick={() =>
            props.handleChange({ name: props.filterName, value: option.value })
          }
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
