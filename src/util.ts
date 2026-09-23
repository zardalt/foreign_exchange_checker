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

  if (Number(new Date()) - value.wasSet > TEN_MINUTES_AS_MS)
    fetchAndAssignJsonData(url);

  return value.promise;
}

export function sliceNum(n: number): string {
  const nAsString = String(n);
  if (!nAsString.includes(".")) return nAsString + ".00";

  const [numeric, decimal] = nAsString.split(".");

  return numeric + "." + decimal.substring(0, 2).padEnd(2, "0");
}

export type State<T> = React.Dispatch<React.SetStateAction<T>>;
