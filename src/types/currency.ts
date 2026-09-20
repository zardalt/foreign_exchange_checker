export const currencyImgTable = {
  USD: "us",
  EUR: "eu",
  GBP: "gb",
  AED: "ae",
  ARS: "ar",
  AUD: "au",
  BDT: "bd",
} as const;

export type CurrencyAbbr = keyof typeof currencyImgTable;
