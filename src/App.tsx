import { useState, useEffect } from "react";
import {
  ConversionLogsContext,
  CurrencyStateContext,
  CurrencyUpdateContext,
  FavoritedCurrencyPairs,
  FetchingContext,
  TimePeriodContext,
  timePeriodInitialPeriod,
  type Log,
} from "./contexts/CurrencyContext";
import type { CurrencyState, TimePeriod } from "./contexts/CurrencyContext";
import Header from "./Header";
import Converter from "./Converter";
import { fetchJsonData } from "./util";
import DetailsContainer from "./DetailsContainer";

type Prop = {
  children: React.ReactNode;
};

const CurrencyContext: React.FC<Prop> = ({ children }) => {
  const [currencyState, setCurrencyState] = useState<CurrencyState>({
    base: "USD",
    quote: "EUR",
    rate: 0.853,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [favorited, setFavorited] = useState(new Set<string>());
  const [loggedConversions, setLoggedConversions] = useState<Log[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    timePeriodInitialPeriod,
  );

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
    <CurrencyStateContext value={currencyState}>
      <CurrencyUpdateContext value={setCurrencyState}>
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
                {children}
              </TimePeriodContext>
            </ConversionLogsContext>
          </FavoritedCurrencyPairs>
        </FetchingContext>
      </CurrencyUpdateContext>
    </CurrencyStateContext>
  );
};

function App() {
  return (
    <CurrencyContext>
      <Header />
      <div className="space-y-10 px-4 py-8">
        <Converter />
        <DetailsContainer />
      </div>
    </CurrencyContext>
  );
}

export default App;
