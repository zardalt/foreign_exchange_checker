import { useState, useEffect } from "react";
import {
  ConversionLogsContext,
  CurrencyStateContext,
  FavoritedCurrencyPairs,
  FetchingContext,
  SendValueContext,
  TimePeriodContext,
  timePeriodInitialPeriod,
  type Log,
} from "./contexts/CurrencyContext.ts";
import type { CurrencyState, TimePeriod } from "./contexts/CurrencyContext";
import Header from "./Header";
import Converter from "./Converter";
import { fetchJsonData, getLSItem, setLSItem } from "./util";
import DetailsContainer from "./DetailsContainer";
import type { CurrencyAbbr } from "./currency.ts";

type Prop = {
  children: React.ReactNode;
};

const CurrencyContext: React.FC<Prop> = ({ children }) => {
  const [sendValue, setSendValue] = useState<string>("");
  const [isFetching, setIsFetching] = useState(false);
  const [favorited, setFavorited] = useState(
    new Set<string>(getLSItem("favorites", [])),
  );
  const [currencyState, setCurrencyState] = useState<CurrencyState>(() => {
    const [base, quote] = ([...favorited].at(-1) || "USD/EUR").split("/") as [
      CurrencyAbbr,
      CurrencyAbbr,
    ];

    return {
      base,
      quote,
      rate: 0.853, // rate will be fetched and updated. This is just a default
    };
  });
  const [loggedConversions, setLoggedConversions] = useState<Log[]>(
    getLSItem("loggedConversions", []),
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    timePeriodInitialPeriod,
  );

  useEffect(() => {
    setLSItem("favorites", [...favorited]);
  }, [favorited]);
  useEffect(() => {
    setLSItem("loggedConversions", loggedConversions);
  }, [loggedConversions]);

  function attemptSettingCurrencyState(
    newCurrencyState: ((prev: CurrencyState) => CurrencyState) | CurrencyState,
  ) {
    (async () => {
      setIsFetching(true);

      newCurrencyState =
        typeof newCurrencyState === "function"
          ? newCurrencyState.apply(null, [currencyState])
          : newCurrencyState;

      const currentRate = await fetchJsonData<CurrencyState>(
        `/rate/${newCurrencyState.base}/${newCurrencyState.quote}`,
      )
        .then()
        .catch(() => {
          return { rate: undefined };
        });

      if (currentRate.rate !== undefined) {
        setCurrencyState({ ...currentRate });

        const currentUrl = new URL(location.href);
        currentUrl.searchParams.set("base", currentRate.base);
        currentUrl.searchParams.set("quote", currentRate.quote);

        window.history.replaceState({}, "", currentUrl);
      }

      setIsFetching(false);
    })();
  }

  useEffect(() => {
    const url = new URL(location.href);
    const base = url.searchParams.get("base") as CurrencyAbbr | null,
      quote = url.searchParams.get("quote") as CurrencyAbbr | null;

    if (base !== null && quote !== null) {
      attemptSettingCurrencyState({
        base,
        quote,
        rate: 1, // will be updated
      });
    } else attemptSettingCurrencyState(currencyState);
  }, []);

  return (
    <CurrencyStateContext
      value={{ currencyState, setCurrencyState: attemptSettingCurrencyState }}
    >
      <FetchingContext value={isFetching}>
        <FavoritedCurrencyPairs value={{ favorited, setFavorited }}>
          <ConversionLogsContext
            value={{
              logs: loggedConversions,
              setLogs: setLoggedConversions,
            }}
          >
            <TimePeriodContext
              value={{
                timePeriod,
                setTimePeriod,
              }}
            >
              <SendValueContext value={{ sendValue, setSendValue }}>
                {children}
              </SendValueContext>
            </TimePeriodContext>
          </ConversionLogsContext>
        </FavoritedCurrencyPairs>
      </FetchingContext>
    </CurrencyStateContext>
  );
};

function App() {
  return (
    <CurrencyContext>
      <Header />
      <div className="max-w-275 lg:mx-auto space-y-10 lg:space-y-8 px-4 lg:px-8 sm:px-6 py-8 sm:py-12">
        <Converter />
        <DetailsContainer />
      </div>
    </CurrencyContext>
  );
}

export default App;
