import React, { Suspense, use, useContext, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  CurrencyStateContext,
  FavoritedCurrencyPairs,
  type CurrencyState,
} from "../contexts/CurrencyContext";
import {
  animateContainerDeletion,
  fetchJsonData,
  getColors,
  sliceNum,
  type State,
} from "../util";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../Livemarkets";
import StarSVG from "../components/StarSVG";
import type { CurrencyAbbr } from "../currency";
import RightArrow from "../components/RightArrow";
import EmptyDefault from "../components/EmptyDefault";

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
            <RightArrow />
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
  const sendInput = useRef(document.getElementById("sendInput"));

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
    animateContainerDeletion(parentElement).then(() => {
      setFavorited(
        (prev) =>
          new Set([...prev].filter((pair) => pair !== `${base}/${quote}`)),
      );
    });
  };

  const setCurrencies = (pair: Pair) => {
    setCurrencyState(pair);
    sendInput.current?.scrollIntoView();
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
            <RightArrow />
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

const NoFavorites = () => {
  return (
    <EmptyDefault
      heading="No pinned pairs yet"
      subHeading="Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row."
      width={460}
    />
  );
};

const FavoritesError = () => {
  return (
    <EmptyDefault
      heading="Cannot load favorites"
      subHeading="An error occured when trying to load favorites. Please check your connection then refresh the page"
      width={490}
    />
  );
};

const FavoritesTab: React.FC = () => {
  const { favorited, setFavorited } = useContext(FavoritedCurrencyPairs);

  return favorited.size ? (
    <div className="space-y-4 sm:space-y-5 p-4 sm:p-5 rounded-2xl bg-neutral-700 border border-neutral-600">
      <FavoriteHeader length={favorited.size} />
      <FavoritePairContainer
        favorited={favorited}
        setFavorited={setFavorited}
      />
    </div>
  ) : (
    <NoFavorites />
  );
};

const BoundedFavoritesTab = () => {
  return (
    <ErrorBoundary fallback={<FavoritesError />}>
      <Suspense fallback={<FavoritesTabLoading />}>
        <FavoritesTab />
      </Suspense>
    </ErrorBoundary>
  );
};

export default BoundedFavoritesTab;
