import React, { createContext } from "react";
import { type CurrencyAbbr } from "../currency";
import type { State } from "../util";

export type CurrencyState = {
  base: CurrencyAbbr;
  quote: CurrencyAbbr;
  rate: number;
};

export type Log = {
  loggedOn: Date;
  base: CurrencyAbbr;
  quote: CurrencyAbbr;
  baseValue: string;
  quoteValue: string;
};

const initialValue: CurrencyState = {
  base: "USD",
  quote: "EUR",
  rate: 0.853,
};

const set = new Set<string>();

export const CurrencyStateContext = createContext<CurrencyState>(initialValue);
export const CurrencyUpdateContext = createContext<
  React.Dispatch<React.SetStateAction<CurrencyState>>
>(() => initialValue);
export const FetchingContext = createContext(false);
export const FavoritedCurrencyPairs = createContext<{
  favorited: Set<string>;
  setFavorited: React.Dispatch<React.SetStateAction<Set<string>>>;
}>({
  favorited: set,
  setFavorited: () => set,
});
export const ConversionLogsContext = createContext<{
  logs: Log[];
  setLogs: State<Log[]>;
}>({
  logs: [],
  setLogs: () => {},
});
