import React from "react";
import TimePeriodContainer from "./TimePeriodContainer";

type ConversionStatProp = {
  title: string;
  value: string;
  color: string;
};

const ConversionStat: React.FC<ConversionStatProp> = ({
  title,
  value,
  color,
}) => {
  return (
    <div className="space-y-4 px-5 py-3 rounded-2xl bg-neutral-700 border border-neutral-600">
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

const StatsContainer: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2.5">
        <ConversionStat title="Open" value="0.8516" color="#FFF" />
        <ConversionStat title="Last" value="0.8530" color="#FFF" />
        <ConversionStat title="Change" value="+0.0014" color="#42eb05" />
        <ConversionStat title="% Change" value="▲ +0.16%" color="#42eb05" />
      </div>
      <TimePeriodContainer />
    </div>
  );
};

export default StatsContainer;
