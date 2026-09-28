import dayjs from "dayjs";
import { useEffect, useRef, type FC, Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchJsonData, sliceNum } from "./util";
import "./Livemarkets.css";
import { CURRENCIES, POPULAR_CURRENCIES } from "./currency";

type ExchangeRate = {
  currencyPair: string;
  exchangeRate: string;
  change: string;
};

export const DATE_FORMAT = "YYYY-MM-DD";

function LoadingLiveMarkets() {
  return (
    <div className="flex overflow-hidden">
      {new Array(10).fill(0).map(() => (
        <div
          className="flex gap-3 bg-neutral-700 border-r border-r-neutral-500 p-3 *:block *:animate-pulse"
          key={crypto.randomUUID()}
        >
          <span className="h-2 w-9 rounded-lg bg-neutral-600"></span>
          <span className="h-2 w-20 rounded-lg bg-neutral-600"></span>
        </div>
      ))}
    </div>
  );
}

const Livemarkets: FC = () => {
  return (
    <div className="flex overflow-hidden">
      <div className="text-preset-6 uppercase bg-lime-500 text-neutral-900 px-2 py-3 flex gap-2 items-center shrink-0 z-10">
        <span
          aria-hidden={true}
          className="size-1.5 rounded-[999px] bg-neutral-900"
        ></span>
        Live Markets
      </div>
      <div className="flex">
        <ErrorBoundary fallback={<p>An error occured</p>}>
          <Suspense fallback={<LoadingLiveMarkets />}>
            <RatesContainer />
            <RatesContainer />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

type LiveRates = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

const randomCurrencyPairs = (() => {
  const currencies = [...CURRENCIES, ...POPULAR_CURRENCIES];
  const randomizedPairs = [];

  const generateCurrency = () =>
    currencies[Math.floor(Math.random() * currencies.length)];

  for (let i = 0; i < 25; i++) {
    const _1 = generateCurrency();
    const _2 = (() => {
      let pair = generateCurrency();
      while (pair === _1) {
        pair = generateCurrency();
      }

      return pair;
    })();

    randomizedPairs.push(`${_1}/${_2}`);
  }

  return randomizedPairs;
})();

const RatesContainer: FC = () => {
  const rateContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleWindowResize() {
      if (!rateContainer.current) return;

      const rateContainerWidth = window.parseFloat(
        window
          .getComputedStyle(rateContainer.current)
          .getPropertyValue("width"),
      );

      rateContainer.current.animate(
        [
          {
            translate: "0",
          },
          { translate: "-100%" },
        ],
        {
          duration: rateContainerWidth * 10,
          iterations: Infinity,
        },
      );
    }
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const oneMonthAgo = dayjs().subtract(1, "month").format(DATE_FORMAT);

  const rates: (ExchangeRate & { id: number })[] = randomCurrencyPairs
    .map((pair, index) => {
      const currentRate = use(fetchJsonData<LiveRates>(`/rate/${pair}`));
      const prevRate = use(
        fetchJsonData<LiveRates>(`/rate/${pair}?from=${oneMonthAgo}`),
      );

      if (currentRate.rate === undefined || prevRate.rate === undefined)
        return undefined;

      return {
        exchangeRate: sliceNum(currentRate.rate),
        currencyPair: `${currentRate.base}/${currentRate.quote}`,
        change: sliceNum(
          (100 * (currentRate.rate - prevRate.rate)) /
            Math.abs(currentRate.rate),
        ),
        id: index,
      };
    })
    .filter((rate) => rate !== undefined);

  return (
    <div className="flex shrink-0" ref={rateContainer}>
      {rates.map((mockRate) => (
        <LiveRates
          exchangeRate={mockRate.exchangeRate}
          currencyPair={mockRate.currencyPair}
          change={mockRate.change}
          key={mockRate.id}
        />
      ))}
    </div>
  );
};

const LiveRates: FC<ExchangeRate> = ({
  currencyPair,
  exchangeRate,
  change,
}) => {
  const changeAsNum = Number(change);
  return (
    <div className="p-3 flex gap-2.5 border-r border-neutral-500 shrink-0 bg-neutral-700">
      <span className="text-preset-6 text-neutral-200">{currencyPair}</span>
      <span className="text-preset-6 text-neutral-50">{exchangeRate}</span>
      <span
        className={
          (changeAsNum > 0
            ? "text-green-500 positive"
            : "text-red-500 negative") + " text-preset-6"
        }
      >
        {changeAsNum > 0 ? "+" : ""}
        {change}%
      </span>
    </div>
  );
};

export default Livemarkets;
