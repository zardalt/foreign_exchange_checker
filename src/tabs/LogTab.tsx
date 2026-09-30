import React, { Suspense, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ConversionLogsContext,
  CurrencyStateContext,
  SendValueContext,
  type Log,
} from "../contexts/CurrencyContext";
import {
  animateContainerDeletion,
  getTimeSince,
  sliceNum,
  type State,
} from "../util";
import RightArrow from "../components/RightArrow";

type LogTabHeaderProp = {
  length: number;
  setLogs: State<Log[]>;
};

const LogTabHeader: React.FC<LogTabHeaderProp> = ({ length, setLogs }) => {
  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="flex flex-col gap-y-2.5 uppercase">
      <h2 className="text-preset-3 font-medium text-neutral-50">
        Conversion Log
      </h2>
      <div className="flex justify-between items-center">
        <p className="text-preset-5 opacity-70">{length} logged</p>
        <button
          className="uppercase px-3 py-2 rounded-lg bg-neutral-600 border border-neutral-400 text-preset-5 text-neutral-200 hover:bg-neutral-500 focus:outline-shadow-lime-500 transition-colors"
          onClick={clearLogs}
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

type LogTabContainersProp = {
  logs: Log[];
  setLogs: State<Log[]>;
};

const LogTabContainers: React.FC<LogTabContainersProp> = ({
  logs,
  setLogs,
}) => {
  const { setCurrencyState } = useContext(CurrencyStateContext);
  const { setSendValue } = useContext(SendValueContext);

  const rerunConversion = (log: Log) => {
    setCurrencyState({
      base: log.base,
      quote: log.quote,
      rate: 1,
    });
    setSendValue(log.baseValue);
  };

  const deleteLog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.stopPropagation();
    e.currentTarget.disabled = true;

    animateContainerDeletion(e.currentTarget.parentElement!).then(() => {
      setLogs((prev) => prev.filter((log) => log.id !== id));
    });
  };

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <button
          className="w-full uppercase flex gap-x-2.5 p-3 rounded-[0.625em] bg-neutral-600 border border-neutral-500 items-center text-left hover:border-neutral-300 focus:outline-shadow-lime-500"
          onClick={() => rerunConversion(log)}
        >
          <div className="flex flex-col gap-1 grow">
            <p className="text-preset-4 text-neutral-200">
              {getTimeSince(log.loggedOn)}
            </p>
            <p className="flex items-center gap-x-2">
              <span className="text-preset-4 text-neutral-50">{log.base}</span>
              <RightArrow />
              <span className="text-preset-4 text-neutral-50">{log.quote}</span>
            </p>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <p className="text-preset-3 text-neutral-100">
              {sliceNum(Number(log.baseValue.split(",").join("")))}
            </p>
            <p className="text-preset-3 text-lime-500">
              {sliceNum(Number(log.quoteValue.split(",").join("")))}
            </p>
          </div>
          <button
            className="size-8 p-2 rounded-lg bg-neutral-600 border border-neutral-500 bg-[url(/images/trash.svg)] bg-no-repeat bg-center bg-size-[1rem] focus:outline-shadow-lime-500 hover:bg-neutral-500 hover:border-neutral-400 hover:bg-[url(/images/filled_trash.svg)]"
            onClick={(e) => {
              deleteLog(e, log.id);
            }}
            aria-label="Delete log"
          ></button>
        </button>
      ))}
    </div>
  );
};

const LogTab: React.FC = () => {
  const { logs, setLogs } = useContext(ConversionLogsContext);

  return (
    <div className="space-y-5 px-4 py-5 rounded-2xl bg-neutral-700 border border-neutral-600">
      <LogTabHeader length={logs.length} setLogs={setLogs} />
      <LogTabContainers logs={logs} setLogs={setLogs} />
    </div>
  );
};

export default LogTab;
