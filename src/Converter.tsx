import React, { useContext, useEffect, useRef, useState } from "react";
import CurrencyPicker from "./components/CurrencyPicker";
import * as utils from "./util";
import {
  ConversionLogsContext,
  CurrencyStateContext,
  CurrencyUpdateContext,
  FavoritedCurrencyPairs,
  FetchingContext,
  type Log,
} from "./contexts/CurrencyContext";
import Check from "./components/Check";

type LogConversionLabelProp = Omit<Log, "loggedOn"> & {
  isLogged: boolean;
  setIsLogged: utils.State<boolean>;
};

const LogConversionLabel: React.FC<LogConversionLabelProp> = ({
  isLogged,
  setIsLogged,
  base,
  quote,
  baseValue,
  quoteValue,
}) => {
  const { setLogs } = useContext(ConversionLogsContext);

  function handleInputChange() {
    if (isLogged || !baseValue) return;

    setLogs((prev) => [
      ...prev,
      {
        loggedOn: new Date(),
        base,
        quote,
        baseValue,
        quoteValue,
      },
    ]);
    setIsLogged(true);
  }

  return (
    <label
      className={
        "select-none py-2 border rounded-lg text-preset-5 uppercase text-neutral-200 focus-within:outline-shadow-lime-500 cursor-pointer transition-colors " +
        (isLogged
          ? "px-8.25 bg-lime-500 border-lime-500 text-neutral-900"
          : "px-3 hover:bg-lime-800 hover:border-lime-500 hover:text-neutral-50 border-neutral-300")
      }
    >
      <input
        className="sr-only"
        onChange={handleInputChange}
        type="checkbox"
        checked={isLogged}
      />
      {!isLogged ? (
        <>Log Conversion</>
      ) : (
        <p className="flex gap-x-2 items-center justify-center normal-case">
          <Check color="#0a0a0a" />
          Logged
        </p>
      )}
    </label>
  );
};

type FavoriteLabelProp = {
  base: string;
  quote: string;
};

const FavoriteLabel: React.FC<FavoriteLabelProp> = ({ base, quote }) => {
  const starSvg = useRef<SVGSVGElement | null>(null);
  const favoritedContext = useContext(FavoritedCurrencyPairs);

  const currPair = `${base}/${quote}`;

  const isFavorited = favoritedContext.favorited.has(currPair);

  function handleInputChange() {
    favoritedContext.setFavorited((prev) =>
      isFavorited
        ? new Set([...prev].filter((pair) => pair !== currPair))
        : new Set([...prev, currPair]),
    );
  }

  return (
    <label
      className={
        "select-none flex items-center gap-x-2 px-3 py-2 rounded-lg border text-preset-5 uppercase transition-colors focus-within:outline-shadow-lime-500 cursor-pointer " +
        (isFavorited
          ? "text-neutral-900 bg-lime-500 border-lime-500"
          : "bg-neutral-600 hover:border-neutral-400 hover:bg-neutral-500 border-neutral-500 text-neutral-50")
      }
    >
      <input
        className="sr-only"
        type="checkbox"
        checked={isFavorited}
        onChange={handleInputChange}
      />
      <svg
        className="inline"
        ref={starSvg}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.33248 2.41081C7.61373 1.84831 8.41061 1.87175 8.66842 2.41081L10.2153 5.528L13.6372 6.02019C14.2465 6.11394 14.4809 6.86394 14.0356 7.30925L11.5747 9.72331L12.1606 13.1218C12.2544 13.7311 11.5981 14.1999 11.059 13.9186L8.01217 12.3014L4.94186 13.9186C4.40279 14.1999 3.74654 13.7311 3.84029 13.1218L4.42623 9.72331L1.96529 7.30925C1.51998 6.86394 1.75436 6.11394 2.36373 6.02019L5.80904 5.528L7.33248 2.41081Z"
          fill={isFavorited ? "#0a0a0a" : "#0A0A0A00"}
          stroke={isFavorited ? "none" : "#FFF"}
        />
      </svg>
      {isFavorited ? "Favorited" : "Favorite "}
    </label>
  );
};

const Converter: React.FC = () => {
  const [sendValue, setSendValue] = useState("");
  const [recieveValue, setRecieveValue] = useState("0");
  const [isLogged, setIsLogged] = useState(false);

  const sendInput = useRef<HTMLInputElement | null>(null);

  const currencyState = useContext(CurrencyStateContext);
  const setCurrencyState = useContext(CurrencyUpdateContext);
  const isFetching = useContext(FetchingContext);

  function submitForm() {
    if (!sendInput.current) return;

    if (!sendValue) {
      sendInput.current.focus();
      return;
    }

    const result = Number(sendValue.replaceAll(",", "")) * currencyState.rate;

    setRecieveValue(utils.addCommas(utils.sliceNum(result)));
    setIsLogged(false);
  }

  useEffect(submitForm, [sendValue]);

  function handleFromCurrencyInputChange(
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    const filtered = [...e.target.value]
      .filter((char) => /\d|\./.test(char))
      .join("");

    if (Number.isNaN(Number(filtered))) return;

    setSendValue(utils.addCommas(filtered));
  }

  function swapCurrencies() {
    setCurrencyState((prev) => {
      return {
        base: prev.quote,
        quote: prev.base,
        rate: prev.rate,
      };
    });
    setRecieveValue("0");
  }

  return (
    <main className="space-y-4">
      <h2 className="uppercase text-preset-2">Check the Rate</h2>

      <div className="bg-neutral-700 shadow-[0_12px_40px_0_rgb(0_0_0/0.4)] rounded-[1.25em]">
        <form className="p-4 space-y-4">
          <div className="space-y-5 p-4 rounded-2xl container-preset-1">
            <h3 className="uppercase text-preset-4 text-neutral-100">Send</h3>
            <div className="flex flex-wrap gap-y-2 justify-between items-center">
              <input
                className="text-preset-1 placeholder:text-neutral-200 border-b border-b-transparent hover:border-b-neutral-200 focus-visible:outline-none focus-visible:rounded-lg focus:outline-shadow-lime-500 max-w-[60%]"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={sendValue}
                onChange={handleFromCurrencyInputChange}
                ref={sendInput}
              />
              <CurrencyPicker
                id="sendCurrency"
                anchorName="--send-currency"
                selectedCurrency={currencyState.base}
                setSelectedCurrency={(base) =>
                  setCurrencyState({ ...currencyState, base })
                }
              />
            </div>
          </div>
          <button
            className="size-12 disabled:opacity-75 disabled:cursor-not-allowed rounded-lg bg-neutral-600 border border-neutral-500 bg-no-repeat bg-center bg-[url(/images/vertical_exchange.svg)] bg-size-[1.25em] mx-auto block hover:not-disabled:bg-neutral-400 transition-colors focus-visible:outline-shadow-lime-500"
            type="button"
            aria-label="Swap currencies"
            disabled={isFetching}
            onClick={swapCurrencies}
          ></button>
          <div className="space-y-5 p-4 rounded-2xl container-preset-1">
            <h3 className="text-preset-4 uppercase text-neutral-100">
              Recieve
            </h3>
            <div className="flex items-center justify-between flex-wrap gap-y-2">
              <output className="text-preset-1 text-lime-500 w-fit max-w-full overflow-x-auto">
                {recieveValue}
              </output>
              <CurrencyPicker
                id="recieveCurrency"
                anchorName="--recieve-currency"
                selectedCurrency={currencyState.quote}
                setSelectedCurrency={(quote) =>
                  setCurrencyState({ ...currencyState, quote })
                }
              />
            </div>
          </div>
        </form>
        <div className="flex flex-col items-center gap-4 p-4 border-bs border-bs-neutral-500 border-dashed">
          <p className="flex items-center text-preset-6 text-neutral-50">
            {isFetching ? (
              <>
                <span>1 {currencyState.base} = </span>
                <span className="w-8 mx-2 h-3 inline-block bg-neutral-600 rounded-sm animate-pulse"></span>
                <span> {currencyState.quote}</span>
              </>
            ) : (
              <>
                1 {currencyState.base} = {utils.sliceNum(currencyState.rate)}{" "}
                {currencyState.quote}
              </>
            )}
          </p>
          <div className="flex space-x-2">
            <FavoriteLabel
              base={currencyState.base}
              quote={currencyState.quote}
            />
            <LogConversionLabel
              isLogged={isLogged}
              setIsLogged={setIsLogged}
              base={currencyState.base}
              quote={currencyState.quote}
              baseValue={sendValue}
              quoteValue={recieveValue}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Converter;
