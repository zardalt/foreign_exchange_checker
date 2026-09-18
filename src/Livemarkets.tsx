import React, { useEffect, useRef } from "react";
import "./Livemarkets.css";

type ExchangeRate = {
  currencyPair: string;
  exchangeRate: number;
  change: number;
};

const MOCK_RATES: (ExchangeRate & { id: string })[] = [
  {
    currencyPair: "USD/JPY",
    exchangeRate: 157.91,
    change: 0.04,
    id: "66ee4b86-23e2-4b69-bc45-7c44b1d8228b",
  },
  {
    currencyPair: "GBP/USD",
    exchangeRate: 1.3575,
    change: -0.22,
    id: "28f43068-813c-4fdc-8533-520754bce3ef",
  },
  {
    currencyPair: "USD/CHF",
    exchangeRate: 0.9098,
    change: 0.13,
    id: "0b900f15-f32f-4741-a9ee-a235247488a1",
  },
  {
    currencyPair: "EUR/GBP",
    exchangeRate: 0.8633,
    change: 0.11,
    id: "5e93cd76-8387-45ba-80f4-1f5f3b220c7a",
  },
  {
    currencyPair: "AUD/USD",
    exchangeRate: 0.7288,
    change: 0.08,
    id: "cd9e7362-579f-452b-8f7a-29caf97179ed",
  },
  {
    currencyPair: "USD/CAD",
    exchangeRate: 1.3815,
    change: 0.04,
    id: "382bbd5b-9e55-4b14-8028-ae9bc6084b2b",
  },
] as const;

const LiveRates: React.FC<ExchangeRate> = ({
  currencyPair,
  exchangeRate,
  change,
}) => {
  return (
    <div className="p-3 flex gap-2.5 border-r border-neutral-500 shrink-0 bg-neutral-700">
      <span className="text-preset-6 text-neutral-200">{currencyPair}</span>
      <span className="text-preset-6 text-neutral-50">{exchangeRate}</span>
      <span
        className={
          (change > 0 ? "text-green-500 positive" : "text-red-500 negative") +
          " text-preset-6"
        }
      >
        {change > 0 ? "+" : ""}
        {change}%
      </span>
    </div>
  );
};

type RateContainerProp = {
  ref?: React.RefObject<HTMLDivElement | null>;
};

const RatesContainer: React.FC<RateContainerProp> = ({ ref }) => {
  return (
    <div className="flex shrink-0" ref={ref}>
      {MOCK_RATES.map((mockRate) => (
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

const Livemarkets: React.FC = () => {
  const rateContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleWindowResize() {
      if (!rateContainer.current) return;

      const rateContainerWidth = window.parseFloat(
        window
          .getComputedStyle(rateContainer.current)
          .getPropertyValue("width"),
      );

      [...rateContainer.current.parentElement!.children].forEach((child) => {
        child.animate(
          [{ translate: "0" }, { translate: `-${rateContainerWidth * 2}px` }],
          {
            duration: rateContainerWidth * 20,
            iterations: Infinity,
          },
        );
      });
    }

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

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
        <RatesContainer ref={rateContainer} />
        <RatesContainer />
        <RatesContainer />
      </div>
    </div>
  );
};

export default Livemarkets;
