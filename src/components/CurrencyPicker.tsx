import React, { Suspense, use, useRef } from "react";
import { CURRENCIES, POPULAR_CURRENCIES, type CurrencyAbbr } from "../currency";
import { fetchJsonData } from "../util";
import { ErrorBoundary } from "react-error-boundary";

type CurrencyPickerProp = {
  anchorName: string;
  id: string;
  selectedCurrency: CurrencyAbbr;
  setSelectedCurrency: (iso_code: CurrencyAbbr) => void;
};

type Currency = {
  name: string;
  iso_code: CurrencyAbbr;
};

type CurrencyGroupProp = {
  groupTitle: string;
  currencies: Currency[];
  selectedCurrency: CurrencyAbbr;
  setCurrency: (iso_code: CurrencyAbbr) => void;
};

const CurrencyGroup: React.FC<CurrencyGroupProp> = ({
  groupTitle,
  currencies,
  selectedCurrency,
  setCurrency,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center p-2 border-b border-b-neutral-500 *:text-preset-5 *:text-neutral-200 *:uppercase">
        <span>{groupTitle}</span>
        <span>{currencies.length}</span>
      </div>

      <div>
        {currencies.map((currency) => (
          <button
            className={
              "w-full flex items-center gap-x-3 px-2 py-3 rounded-sm" +
              (selectedCurrency === currency.iso_code
                ? " bg-no-repeat bg-[url(/images/check.svg)] bg-size-[0.75rem] bg-position-[calc(100%_-_0.5rem)_50%]"
                : "")
            }
            key={crypto.randomUUID()}
            aria-checked={currency.iso_code === selectedCurrency}
            onClick={() => setCurrency(currency.iso_code)}
            type="button"
          >
            <img
              className="size-5 rounded-full"
              src={`/flags/${currency.iso_code.substring(0, 2).toLowerCase()}.webp`}
              alt=""
            />
            <span className="text-preset-4 text-neutral-50">
              {currency.iso_code}
            </span>
            <span className="text-preset-5 text-neutral-200">
              {currency.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const LoadingButton = () => (
  <button
    className="flex items-center p-2.5 gap-x-2 rounded-lg bg-neutral-500 border border-neutral-400 *:block *:bg-neutral-400 *:animate-pulse"
    type="button"
  >
    <span className="size-5 rounded-full"></span>
    <span className="h-4 w-7"></span>
    <span className="size-3"></span>
  </button>
);

const InitCurrencyPicker: React.FC<CurrencyPickerProp> = ({
  anchorName,
  id,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const currencyPopover = useRef<HTMLDivElement | null>(null);

  function setCurrency(iso_code: CurrencyAbbr) {
    if (selectedCurrency === iso_code) return;

    setSelectedCurrency(iso_code);
    currencyPopover.current?.hidePopover();
  }

  const popularCurrencies = POPULAR_CURRENCIES.map((iso_code) => {
    return use(fetchJsonData(`/currency/${iso_code}`)) as Currency;
  });
  const otherCurrencies: Currency[] = CURRENCIES.map((iso_code) => {
    return use(fetchJsonData(`/currency/${iso_code}`)) as Currency;
  });

  return (
    <>
      <button
        className="flex gap-x-2 items-center text-preset-4 py-2.5 ps-2.5 pe-7.5 bg-neutral-500 border border-neutral-400 rounded-lg text-neutral-50 bg-no-repeat bg-center bg-[url(/images/chevron_down.svg)] bg-position-[calc(100%-0.625em)_50%] hover:bg-neutral-400 transition-colors focus-visible:outline-shadow-lime-500"
        popoverTarget={id}
        type="button"
        style={{ anchorName }}
      >
        <img
          className="w-5 rounded-full"
          src={`/flags/${selectedCurrency.substring(0, 2).toLowerCase()}.webp`}
          alt=""
        />
        {selectedCurrency}
      </button>

      <div
        className="overflow-scroll bottom-0 w-full max-w-[19.4375em] rounded-lg space-y-2.5 p-2 pbs-0 bg-neutral-600 border border-neutral-400 shadow-[0_1.25em_3.75_0_rgb(0_0_0/0.5)] starting:scale-0 transition-transform origin-top-right"
        popover="auto"
        id={id}
        style={{
          positionAnchor: anchorName,
          positionArea: "end span-start",
          top: "calc(anchor(bottom) + 0.4em)",
        }}
        ref={currencyPopover}
      >
        <div className="sticky top-0 bg-inherit pbs-2">
          <input
            className="w-full p-3 ps-9 rounded-[0.375em] border border-neutral-200 text-preset-5 text-neutral-200 bg-[url(/images/search.svg)] bg-position-[0.75em_50%] bg-size-[0.875rem] bg-no-repeat"
            type="text"
            placeholder="Search currencies..."
          />
        </div>

        <div className="space-y-1">
          <CurrencyGroup
            groupTitle="Popular"
            currencies={popularCurrencies}
            selectedCurrency={selectedCurrency}
            setCurrency={setCurrency}
          />
          <CurrencyGroup
            groupTitle="Other Currencies"
            currencies={otherCurrencies}
            selectedCurrency={selectedCurrency}
            setCurrency={setCurrency}
          />
        </div>
      </div>
    </>
  );
};

const CurrencyPicker: React.FC<CurrencyPickerProp> = ({
  anchorName,
  id,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  return (
    <ErrorBoundary fallback={<p>An error occured</p>}>
      <Suspense fallback={<LoadingButton />}>
        <InitCurrencyPicker
          anchorName={anchorName}
          id={id}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CurrencyPicker;
