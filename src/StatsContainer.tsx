import React from "react";
import TimePeriodContainer from "./TimePeriodContainer";
import { getColors, sliceNum } from "./util";

type ConversionStatProp = {
  title: string;
  value: string;
  color: string;
};

export function ConversionStatLoading() {
  return (
    <>
      <div className="sm:min-w-35 space-y-4 px-5 py-3 rounded-2xl bg-neutral-700 border border-neutral-600">
        <p className="text-preset-4 uppercase opacity-70">Open</p>
        <span className="block h-6 w-20 bg-neutral-600 rounded-lg animate-pulse"></span>
      </div>
      <div className="sm:min-w-35 space-y-4 px-5 py-3 rounded-2xl bg-neutral-700 border border-neutral-600">
        <p className="text-preset-4 uppercase opacity-70">Last</p>
        <span className="block h-6 w-20 bg-neutral-600 rounded-lg animate-pulse"></span>
      </div>
      <div className="sm:min-w-35 space-y-4 px-5 py-3 rounded-2xl bg-neutral-700 border border-neutral-600">
        <p className="text-preset-4 uppercase opacity-70">Change</p>
        <span className="block h-6 w-20 bg-neutral-600 rounded-lg animate-pulse"></span>
      </div>
      <div className="sm:min-w-35 space-y-4 px-5 py-3 rounded-2xl bg-neutral-700 border border-neutral-600">
        <p className="text-preset-4 uppercase opacity-70">% Change</p>
        <span className="block h-6 w-20 bg-neutral-600 rounded-lg animate-pulse"></span>
      </div>
    </>
  );
}

const ConversionStat: React.FC<ConversionStatProp> = ({
  title,
  value,
  color,
}) => {
  return (
    <div className="sm:min-w-35 space-y-4 px-5 py-3 rounded-2xl bg-neutral-700 border border-neutral-600">
      <p className="text-preset-4 uppercase opacity-70">{title}</p>
      <p
        className="text-preset-2"
        style={{
          color,
        }}
      >
        {value}
      </p>
    </div>
  );
};

export function StatsContainerLoading() {
  return (
    <div className="flex flex-col gap-y-5 lg:flex-row lg:justify-between lg:items-center">
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(4,auto)] gap-2.5 justify-start">
        <ConversionStatLoading />
      </div>
      <TimePeriodContainer />
    </div>
  );
}

type StatsContainerProp = {
  rates: number[];
};

const StatsContainer: React.FC<StatsContainerProp> = ({ rates }) => {
  const change = rates.at(-1)! - rates[0],
    percentageChange = (change / rates.at(-1)!) * 100;

  return (
    <div className="flex flex-col gap-y-5 lg:flex-row lg:justify-between lg:items-center">
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(4,auto)] gap-2.5 justify-start">
        <ConversionStat
          title="Open"
          value={sliceNum(rates[0], 4)}
          color={getColors("neutral-50")}
        />
        <ConversionStat
          title="Last"
          value={sliceNum(rates.at(-1)!, 4)}
          color={getColors("neutral-50")}
        />
        <ConversionStat
          title="Change"
          value={sliceNum(change, 4)}
          color={change > 0 ? getColors("green-500") : getColors("red-500")}
        />
        <ConversionStat
          title="% Change"
          value={
            (percentageChange > 0 ? "▲ +" : "▼ ") +
            sliceNum(percentageChange) +
            "%"
          }
          color={
            percentageChange > 0 ? getColors("green-500") : getColors("red-500")
          }
        />
      </div>
      <TimePeriodContainer />
    </div>
  );
};

export default StatsContainer;
