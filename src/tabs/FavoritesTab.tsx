import React, { Suspense, use, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  CurrencyStateContext,
  FavoritedCurrencyPairs,
  type CurrencyState,
} from "../contexts/CurrencyContext";
import { fetchJsonData, getColors, sliceNum, type State } from "../util";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../Livemarkets";
import StarSVG from "../components/StarSVG";
import type { CurrencyAbbr } from "../currency";

const FavoriteHeaderLoading = () => {
  return (
    <div className="uppercase flex justify-between items-center">
      <p className="text-preset-3 font-medium">Pinned Pairs</p>
      <p className="flex gap-x-2 items-center">
        <span className="size-4 bg-neutral-600 rounded-sm animate-pulse"></span>
        <span className="text-preset-5">Favorites</span>
      </p>
    </div>
  );
};

type FavoriteHeaderProp = {
  length: number;
};

const FavoriteHeader: React.FC<FavoriteHeaderProp> = ({ length }) => {
  return (
    <div className="uppercase flex justify-between items-center">
      <p className="text-preset-3 font-medium">Pinned Pairs</p>
      <p className="text-preset-5 opacity-70">
        {length} favorite{length !== 1 && "s"}
      </p>
    </div>
  );
};

const FavoritePairContainerLoading = () => {
  return (
    <div className="space-y-3">
      {new Array(4).fill(0).map((_, index) => (
        <div
          className="flex gap-x-5 p-3 rounded-[0.625em] bg-neutral-600 border border-neutral-500 hover:border-neutral-300 focus:outline-shadow-lime-500"
          key={index}
        >
          <p className="flex items-center gap-x-2 grow">
            <span className="w-[3ch] h-4 bg-neutral-500 rounded-sm animate-pulse"></span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.10938 0.0878906C5.20312 -0.0292969 5.39062 -0.0292969 5.50781 0.0878906L10.4062 4.98633C10.5234 5.10352 10.5234 5.26758 10.4062 5.38477L5.50781 10.2832C5.39062 10.4004 5.20312 10.4004 5.10938 10.2832L4.64062 9.83789C4.52344 9.7207 4.52344 9.5332 4.64062 9.43945L8.27344 5.7832H0.28125C0.117188 5.7832 0 5.66602 0 5.50195V4.8457C0 4.70508 0.117188 4.56445 0.28125 4.56445H8.27344L4.64062 0.931641C4.52344 0.837891 4.52344 0.650391 4.64062 0.533203L5.10938 0.0878906Z"
                fill={getColors("neutral-200")}
              />
            </svg>
            <span className="w-[3ch] h-4 bg-neutral-500 rounded-sm animate-pulse"></span>
          </p>
          <p className="flex flex-col items-end gap-y-1.5">
            <span className="w-[7ch] h-4 bg-neutral-500 rounded-sm animate-pulse"></span>
            <span className="w-[5ch] h-3 bg-neutral-500 rounded-sm animate-pulse"></span>
          </p>
          <button className="size-8 rounded-lg border border-neutral-500 flex-center">
            <StarSVG isFavorited={false} />
          </button>
        </div>
      ))}
    </div>
  );
};

type FavoritePairContainerProp = {
  favorited: Set<string>;
  setFavorited: State<Set<string>>;
};

const oneMonthAgo = dayjs().subtract(1, "month").format(DATE_FORMAT);

type Pair = {
  base: CurrencyAbbr;
  quote: CurrencyAbbr;
  rate: number;
  change: number;
};

const FavoritePairContainer: React.FC<FavoritePairContainerProp> = ({
  favorited,
  setFavorited,
}) => {
  const { setCurrencyState } = useContext(CurrencyStateContext);

  const favoritePairs: Pair[] = [...favorited]
    .map((pair) => {
      const [base, quote] = pair.split("/");

      const currentRate = use(
        fetchJsonData<CurrencyState>(`/rate/${base}/${quote}`),
      );
      const prevRate = use(
        fetchJsonData<CurrencyState>(
          `/rate/${base}/${quote}?date=${oneMonthAgo}`,
        ),
      );

      return currentRate.rate !== undefined && prevRate.rate !== undefined
        ? {
            base: currentRate.base,
            quote: currentRate.quote,
            rate: currentRate.rate,
            change:
              (100 * (currentRate.rate - prevRate.rate)) /
              Math.abs(currentRate.rate),
          }
        : undefined;
    })
    .filter((el) => el !== undefined);

  const removeFromFavorite = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    base: string,
    quote: string,
  ) => {
    e.stopPropagation();

    const parentElement = e.currentTarget.parentElement as HTMLDivElement;
    parentElement
      .animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 150,
        easing: "ease-out",
        fill: "forwards",
      })
      .finished.then(
        () =>
          parentElement.animate(
            [
              {
                height: window
                  .getComputedStyle(parentElement)
                  .getPropertyValue("height"),
              },
              { height: 0 },
            ],
            {
              duration: 150,
              fill: "forwards",
              easing: "ease-in-out",
            },
          ).finished,
      )
      .then(() => {
        setFavorited(
          (prev) =>
            new Set([...prev].filter((pair) => pair !== `${base}/${quote}`)),
        );
      });
  };

  const setCurrencies = (pair: Pair) => {
    setCurrencyState(pair);
  };

  return (
    <div className="space-y-3">
      {favoritePairs.map((pair) => (
        <button
          className="flex gap-x-5 p-3 rounded-[0.625em] w-full bg-neutral-600 border border-neutral-500 hover:border-neutral-300 focus:outline-shadow-lime-500"
          key={`${pair.base}/${pair.quote}`}
          onClick={() => setCurrencies(pair)}
        >
          <p className="flex items-center gap-x-2 grow">
            <span className="text-preset-4">{pair.base}</span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.10938 0.0878906C5.20312 -0.0292969 5.39062 -0.0292969 5.50781 0.0878906L10.4062 4.98633C10.5234 5.10352 10.5234 5.26758 10.4062 5.38477L5.50781 10.2832C5.39062 10.4004 5.20312 10.4004 5.10938 10.2832L4.64062 9.83789C4.52344 9.7207 4.52344 9.5332 4.64062 9.43945L8.27344 5.7832H0.28125C0.117188 5.7832 0 5.66602 0 5.50195V4.8457C0 4.70508 0.117188 4.56445 0.28125 4.56445H8.27344L4.64062 0.931641C4.52344 0.837891 4.52344 0.650391 4.64062 0.533203L5.10938 0.0878906Z"
                fill={getColors("neutral-200")}
              />
            </svg>
            <span className="text-preset-4">{pair.quote}</span>
          </p>
          <div className="flex flex-col items-end gap-y-1.5">
            <p className="text-preset-3 text-neutral-50">
              {sliceNum(pair.rate, 4)}
            </p>
            <p
              className="text-preset-6"
              style={{
                color: getColors(pair.change > 0 ? "green-500" : "red-500"),
              }}
            >
              {pair.change > 0 ? "▲ +" : "▼ "}
              {sliceNum(pair.change)}%
            </p>
          </div>
          <button
            className="flex-center size-8 rounded-lg bg-neutral-600 border border-lime-500 focus:outline-shadow-lime-500 hover:bg-neutral-500"
            onClick={(e) => removeFromFavorite(e, pair.base, pair.quote)}
          >
            <StarSVG isFavorited />
          </button>
        </button>
      ))}
    </div>
  );
};

const FavoritesTabLoading = () => {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-neutral-700 border border-neutral-600">
      <FavoriteHeaderLoading />
      <FavoritePairContainerLoading />
    </div>
  );
};

const FavoritesTab: React.FC = () => {
  const { favorited, setFavorited } = useContext(FavoritedCurrencyPairs);

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-neutral-700 border border-neutral-600">
      <FavoriteHeader length={favorited.size} />
      <FavoritePairContainer
        favorited={favorited}
        setFavorited={setFavorited}
      />
    </div>
  );
};

const FavoritesTabWrapped = () => {
  return (
    <ErrorBoundary fallback={<p>An error occured</p>}>
      <Suspense fallback={<FavoritesTabLoading />}>
        <FavoritesTab />
      </Suspense>
    </ErrorBoundary>
  );
};

export default FavoritesTabWrapped;
