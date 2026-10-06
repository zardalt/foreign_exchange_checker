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

type Prop = {
  children: React.ReactNode;
};

const CurrencyContext: React.FC<Prop> = ({ children }) => {
  const [currencyState, setCurrencyState] = useState<CurrencyState>({
    base: "USD",
    quote: "EUR",
    rate: 0.853, // rate will be fetched and updated. This is just a default
  });
  const [sendValue, setSendValue] = useState<string>("");
  const [isFetching, setIsFetching] = useState(false);
  const [favorited, setFavorited] = useState(
    new Set<string>(getLSItem("favorites", [])),
  );
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

  useEffect(() => {
    async function getCurrentRate() {
      setIsFetching(true);

      const currentRate = await fetchJsonData<CurrencyState>(
        `/rate/${currencyState.base}/${currencyState.quote}`,
      );
      setCurrencyState({ ...currentRate });

      setIsFetching(false);
    }

    getCurrentRate();
  }, [currencyState.base, currencyState.quote]);

  return (
    <CurrencyStateContext value={{ currencyState, setCurrencyState }}>
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
