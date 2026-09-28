import React, { useContext, use } from "react";
import StatsContainer, { StatsContainerLoading } from "../StatsContainer";
import ChartContainer, { ChartContainerLoading } from "../Charts";
import {
  TimePeriodContext,
  CurrencyStateContext,
  type CurrencyState,
} from "../contexts/CurrencyContext";
import { getDatesFromRange, fetchJsonData } from "../util";

export function HistoryTabLoading() {
  return (
    <>
      <StatsContainerLoading />
      <ChartContainerLoading />
    </>
  );
}

const HistoryTab: React.FC = () => {
  const { timePeriod } = useContext(TimePeriodContext);
  const currencyState = useContext(CurrencyStateContext);

  const dates = getDatesFromRange(timePeriod, 50);
  const rates = dates
    .map((date) =>
      currencyState.base !== currencyState.quote
        ? use(
            fetchJsonData<CurrencyState>(
              `/rate/${currencyState.base}/${currencyState.quote}?from=${date}`,
            ),
          )
        : { rate: 1 },
    )
    .map((state) => state.rate);
  return (
    <>
      <StatsContainer rates={rates} />
      <ChartContainer
        dates={dates}
        rates={rates}
        currencyState={currencyState}
      />
    </>
  );
};

export default HistoryTab;
