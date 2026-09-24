import React, { useContext } from "react";
import { TimePeriodContext, type TimePeriod } from "./contexts/CurrencyContext";

type TimePeriodButtonProp = {
  text: string;
} & TimePeriod;

const TimePeriodButton: React.FC<TimePeriodButtonProp> = ({
  text,
  duration,
  unit,
}) => {
  const { timePeriod, setTimePeriod } = useContext(TimePeriodContext);

  const isChecked =
    timePeriod.unit === unit && timePeriod.duration === duration;

  return (
    <button
      className={
        "px-4 py-3 rounded-lg text-preset-5 text-neutral-200 transition-colors " +
        (isChecked ? "bg-neutral-500 text-neutral-50" : "hover:bg-neutral-600")
      }
      aria-checked={isChecked}
      onClick={() => setTimePeriod({ duration, unit })}
    >
      {text}
    </button>
  );
};

const TimePeriodContainer: React.FC = () => {
  return (
    <div className="w-fit p-0.5 relative rounded-lg bg-neutral-700">
      <TimePeriodButton text="1D" duration={1} unit="day" />
      <TimePeriodButton text="1W" duration={7} unit="day" />
      <TimePeriodButton text="1M" duration={1} unit="month" />
      <TimePeriodButton text="3M" duration={3} unit="month" />
      <TimePeriodButton text="1Y" duration={1} unit="year" />
      <TimePeriodButton text="5Y" duration={5} unit="year" />
    </div>
  );
};

export default TimePeriodContainer;
