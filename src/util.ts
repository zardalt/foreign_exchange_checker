import dayjs from "dayjs";
import { type TimePeriod } from "./contexts/CurrencyContext";
import { DATE_FORMAT } from "./Livemarkets";

export const apiUrl = "https://api.frankfurter.dev/v2";

export function addCommas(n: string): string {
  const [numeric, decimal] = n.split(".");

  if (numeric.length < 4) return n;

  let newNumeric = "";
  let foundMultiple = false;

  let index = 1;
  while (numeric.length - index >= 3) {
    if (foundMultiple) {
      newNumeric += ",";
      newNumeric += numeric.substring(index, index + 3);
      index += 3;
      continue;
    }

    newNumeric += numeric[index - 1]!;

    if ((numeric.length - index) % 3 === 0) {
      foundMultiple = true;
      continue;
    }

    index += 1;
  }

  return newNumeric + (decimal !== undefined ? "." + decimal : "");
}

const TEN_MINUTES_AS_MS = 10 * 60 * 1000;

const cache = new Map();

function fetchAndAssignJsonData(url: string) {
  cache.set(url, {
    wasSet: Number(new Date()),
    promise: fetch(`${apiUrl}${url}`).then((res) => res.json()),
  });
}

export function fetchJsonData<T>(url: string): Promise<T> {
  if (!cache.has(url)) fetchAndAssignJsonData(url);

  const value = cache.get(url);

  if (Number(new Date()) - value.wasSet > TEN_MINUTES_AS_MS) {
    fetchAndAssignJsonData(url);
    return cache.get(url).promise;
  }

  return value.promise;
}

export function sliceNum(n: number, stopAt: number = 2): string {
  const nAsString = String(n);
  if (!nAsString.includes(".")) return nAsString + ".00";

  const [numeric, decimal] = nAsString.split(".");

  return numeric + "." + decimal.substring(0, stopAt).padEnd(2, "0");
}

export type State<T> = React.Dispatch<React.SetStateAction<T>>;

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export function getDatesFromRange(
  timePeriod: TimePeriod,
  num?: number,
): string[] {
  if (!num) {
    if (window.innerWidth < 400) num = 3;
    else if (window.innerWidth < 800) num = 4;
    else num = 5;
  }

  const end = dayjs();
  const start = end.subtract(timePeriod.duration, timePeriod.unit);
  const intervalInDays = (end.diff(start, "days") / num) * TWENTY_FOUR_HOURS_MS;

  const dates = new Array(num)
    .fill(0)
    .map((_, index) =>
      dayjs(+start + intervalInDays * index).format(DATE_FORMAT),
    );

  return dates.filter((date, index) => date !== dates[index - 1]);
}

type Color =
  | "neutral-900"
  | "neutral-700"
  | "neutral-600"
  | "neutral-500"
  | "neutral-400"
  | "neutral-300"
  | "neutral-200"
  | "neutral-100"
  | "neutral-50"
  | "lime-800"
  | "lime-500"
  | "green-500"
  | "red-500";

export function getColors(color: Color): string {
  return window
    .getComputedStyle(document.body)
    .getPropertyValue(`--color-${color}`);
}

export const TABS = Object.freeze({
  HISTORY: 0,
  COMPARE: 1,
  FAVORITES: 2,
  LOG: 3,
});
