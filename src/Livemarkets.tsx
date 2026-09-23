import dayjs from "dayjs";
import { useEffect, useRef, type FC, Suspense, useContext, use } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchJsonData, sliceNum } from "./util";
import "./Livemarkets.css";
import { CurrencyStateContext } from "./contexts/CurrencyContext";

type ExchangeRate = {
  currencyPair: string;
  exchangeRate: string;
  change: string;
};

const DATE_FORMAT = "YYYY-MM-DD";

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

const RatesContainer: FC = () => {
  const rateContainer = useRef<HTMLDivElement | null>(null);

  const currencyState = useContext(CurrencyStateContext);

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
  const currentRates = use(
    fetchJsonData<LiveRates[]>(`/rates?base=${currencyState.base}`),
  );

  const rates = currentRates.slice(0, 50).map((val) => {
    const prevRate = use(
      fetchJsonData<LiveRates>(
        `/rate/${val.base}/${val.quote}?from=${oneMonthAgo}`,
      ),
    );

    return {
      exchangeRate: sliceNum(val.rate),
      currencyPair: `${val.base}/${val.quote}`,
      change: sliceNum(
        (100 * (val.rate - prevRate.rate)) / Math.abs(prevRate.rate),
      ),
      id: crypto.randomUUID(),
    } as ExchangeRate & { id: string };
  });

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
