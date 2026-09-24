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

export type TimePeriod = {
  duration: 1 | 3 | 5 | 7;
  unit: "day" | "month" | "year";
};

const initialValue: CurrencyState = {
  base: "USD",
  quote: "EUR",
  rate: 0.853,
};

export const timePeriodInitialPeriod = {
  duration: 1,
  unit: "month",
} as TimePeriod;

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
export const TimePeriodContext = createContext<{
  timePeriod: TimePeriod;
  setTimePeriod: State<TimePeriod>;
}>({
  timePeriod: timePeriodInitialPeriod,
  setTimePeriod: () => timePeriodInitialPeriod,
});
