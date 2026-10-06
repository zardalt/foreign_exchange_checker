import React, { Suspense, use, useContext, useRef } from "react";
import {
  CurrencyStateContext,
  FavoritedCurrencyPairs,
  SendValueContext,
  type CurrencyState,
} from "../contexts/CurrencyContext";
import {
  addCommas,
  fetchJsonData,
  getColors,
  getRandomCurrencies,
  sliceNum,
  type State,
} from "../util";
import { ErrorBoundary } from "react-error-boundary";
import type { Currency } from "../components/CurrencyPicker";
import StarSVG from "../components/StarSVG";
import EmptyDefault from "../components/EmptyDefault";

type CompareHeaderProp = {
  currencyState: CurrencyState;
  currencies: CurrencyState[];
  sendValue: string;
};

const CompareHeaderLoading = () => {
  return (
    <div className="gap-y-2.5 flex flex-wrap items-center justify-between uppercase">
      <div className="flex gap-x-3 items-center">
        <p className="text-preset-4 text-neutral-200">Multi-Currency</p>
        <p className="w-40 rounded-sm h-5 bg-neutral-600 animate-pulse"></p>
      </div>
      <p className="flex gap-x-2 items-center">
        <span className="w-5 h-4 bg-neutral-600 rounded-sm animate-pulse"></span>
        <span className="text-preset-5 text-neutral-50 opacity-70">Pairs</span>
      </p>
    </div>
  );
};

const CompareHeader: React.FC<CompareHeaderProp> = ({
  currencyState,
  currencies,
  sendValue,
}) => {
  return (
    <div className="gap-y-2.5 flex flex-wrap items-center justify-between uppercase">
      <div className="flex gap-x-3 items-center">
        <p className="text-preset-4 text-neutral-200">Multi-Currency</p>
        <p className="text-preset-3 font-medium text-neutral-50">
          {sendValue || 1} from {currencyState.base}
        </p>
      </div>
      <p className="text-preset-5 text-neutral-50 opacity-70">
        {currencies.length} Pairs
      </p>
    </div>
  );
};

const CompareCurrenciesLoading = () => {
  return (
    <div className="space-y-3">
      {new Array(8).fill(0).map((_, index) => (
        <div
          className="flex gap-x-2.5 p-3 rounded-[0.625em] bg-neutral-600 border border-neutral-500 items-center"
          key={index}
        >
          <span className="size-6 rounded-full bg-neutral-500 animate-pulse"></span>
          <div className="space-y-1.5 grow">
            <span className="block w-25 h-4 bg-neutral-500 animate-pulse rounded-sm"></span>
            <span className="block w-10 h-3 bg-neutral-500 animate-pulse rounded-sm"></span>
          </div>
          <div className="gap-y-1.5 flex flex-col items-end">
            <span className="block w-25 h-4 bg-neutral-500 animate-pulse rounded-sm"></span>
            <span className="block w-10 h-3 bg-neutral-500 animate-pulse rounded-sm"></span>
          </div>

          <button className="size-8 p-2 rounded-lg bg-neutral-600 border flex-center border-neutral-500">
            <svg
              className="inline animate-pulse"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33248 2.41081C7.61373 1.84831 8.41061 1.87175 8.66842 2.41081L10.2153 5.528L13.6372 6.02019C14.2465 6.11394 14.4809 6.86394 14.0356 7.30925L11.5747 9.72331L12.1606 13.1218C12.2544 13.7311 11.5981 14.1999 11.059 13.9186L8.01217 12.3014L4.94186 13.9186C4.40279 14.1999 3.74654 13.7311 3.84029 13.1218L4.42623 9.72331L1.96529 7.30925C1.51998 6.86394 1.75436 6.11394 2.36373 6.02019L5.80904 5.528L7.33248 2.41081Z"
                fill={getColors("neutral-500")}
                stroke={getColors("neutral-500")}
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

const CompareCurrencies: React.FC<
  CompareHeaderProp & { setCurrencyState: State<CurrencyState> }
> = ({ currencies, sendValue, setCurrencyState }) => {
  const { favorited, setFavorited } = useContext(FavoritedCurrencyPairs);
  const sendInput = useRef(document.getElementById("sendInput"));

  const currenciesWithName = currencies.map((curr) => {
    return {
      ...curr,
      name: use(fetchJsonData<Currency>(`/currency/${curr.quote}`)).name,
    };
  });

  const toggleIsFavorited = (pair: string) => {
    setFavorited((prev) =>
      prev.has(pair)
        ? new Set([...prev].filter((p) => p !== pair))
        : new Set([...prev, pair]),
    );
  };

  const setCurrencies = (curr: CurrencyState) => {
    setCurrencyState(curr);
    sendInput.current?.scrollIntoView();
  };

  return (
    <div className="space-y-3">
      {currenciesWithName.map((curr) => {
        const pair = `${curr.base}/${curr.quote}`;
        const isFavorited = favorited.has(pair);

        return (
          <button
            className="w-full text-left flex gap-x-2.5 p-3 rounded-[0.625em] bg-neutral-600 border border-neutral-500 items-center hover:border-neutral-300 transition-colors focus:outline-shadow-lime-500"
            key={`${curr.base}/${curr.quote}`}
            onClick={() => setCurrencies(curr)}
          >
            <img
              className="size-6 rounded-full"
              src={`/flags/${curr.quote.substring(0, 2).toLowerCase()}.webp`}
              alt=""
            />
            <div className="space-y-1.5 grow">
              <p className="text-preset-4 text-neutral-50">{curr.quote}</p>
              <p className="text-preset-5 text-neutral-200">{curr.name}</p>
            </div>
            <div
              className="max-w-[40%] overflow-x-auto space-y-1.5"
              tabIndex={-1}
            >
              <p className="text-preset-3 text-neutral-50">
                {addCommas(
                  sliceNum(
                    curr.rate * Number(sendValue.split(",").join("")),
                    4,
                  ),
                )}
              </p>
              <p className="text-preset-6 text-right text-neutral-200">
                @ {addCommas(sliceNum(curr.rate, 4))}
              </p>
            </div>
            <button
              className="size-8 p-2 rounded-lg bg-neutral-600 border flex-center hover:bg-neutral-500 hover:border-neutral-400 transition-colors focus:outline-shadow-lime-500"
              style={{
                borderColor: getColors(
                  isFavorited ? "lime-500" : "neutral-500",
                ),
              }}
              aria-checked={isFavorited}
              onClick={(e) => {
                e.stopPropagation();
                toggleIsFavorited(pair);
              }}
            >
              <StarSVG isFavorited={isFavorited} />
            </button>
          </button>
        );
      })}
    </div>
  );
};

const CompareTabLoading = () => {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-neutral-700 border border-neutral-600">
      <CompareHeaderLoading />
      <CompareCurrenciesLoading />
    </div>
  );
};

const NoSendValue = () => {
  return (
    <EmptyDefault
      heading="No comparison available"
      subHeading={
        <>
          Enter an amount in <span className="uppercase">send</span> above to
          see what your money is worth in other currencies
        </>
      }
      width={460}
    />
  );
};

const CompareTabError = () => {
  return (
    <EmptyDefault
      heading="Cannot load currencies to compare"
      subHeading="An error occured when trying to load compare currencies. Please check your connection then refresh the page"
      width={580}
    />
  );
};

type CompareTabProp = {
  sendValue: string;
};

const CompareTab: React.FC<CompareTabProp> = ({ sendValue }) => {
  const { currencyState, setCurrencyState } = useContext(CurrencyStateContext);

  const randomCurrencies = getRandomCurrencies(currencyState.base);

  const currencies = randomCurrencies
    .map((currency) => {
      const request = use(
        fetchJsonData<CurrencyState>(`/rate/${currencyState.base}/${currency}`),
      );

      if (!request.rate) return undefined;

      return request;
    })
    .filter((state) => state !== undefined);

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-neutral-700 border border-neutral-600">
      <CompareHeader
        currencyState={currencyState}
        currencies={currencies}
        sendValue={sendValue}
      />
      <CompareCurrencies
        currencyState={currencyState}
        setCurrencyState={setCurrencyState}
        currencies={currencies}
        sendValue={sendValue}
      />
    </div>
  );
};

const CompareTabWrapped = () => {
  const { sendValue } = useContext(SendValueContext);

  return sendValue ? (
    <ErrorBoundary fallback={<CompareTabError />}>
      <Suspense fallback={<CompareTabLoading />}>
        <CompareTab sendValue={sendValue} />
      </Suspense>
    </ErrorBoundary>
  ) : (
    <NoSendValue />
  );
};

export default CompareTabWrapped;
