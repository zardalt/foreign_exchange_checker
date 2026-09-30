import React, { useContext, use, Suspense } from "react";
import StatsContainer, { StatsContainerLoading } from "../StatsContainer";
import ChartContainer, { ChartContainerLoading } from "../Charts";
import {
  TimePeriodContext,
  CurrencyStateContext,
  type CurrencyState,
} from "../contexts/CurrencyContext";
import { getDatesFromRange, fetchJsonData } from "../util";
import { ErrorBoundary } from "react-error-boundary";
import EmptyDefault from "../components/EmptyDefault";

function HistoryTabLoading() {
  return (
    <>
      <StatsContainerLoading />
      <ChartContainerLoading />
    </>
  );
}

type HistoryTabProp = {
  currencyState: CurrencyState;
};

const HistoryTab: React.FC<HistoryTabProp> = ({ currencyState }) => {
  const { timePeriod } = useContext(TimePeriodContext);

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

const HistoryTabError: React.FC<HistoryTabProp> = ({ currencyState }) => {
  return (
    <EmptyDefault
      heading="No chart data available"
      subHeading={
        "We couldn't load rate history for " +
        `${currencyState.base}/${currencyState.quote}.` +
        " This usually clears up in a minute"
      }
      width={508}
    />
  );
};

const BoundedHistoryTab = () => {
  const { currencyState } = useContext(CurrencyStateContext);

  return (
    <ErrorBoundary fallback={<HistoryTabError currencyState={currencyState} />}>
      <Suspense fallback={<HistoryTabLoading />}>
        <HistoryTab currencyState={currencyState} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default BoundedHistoryTab;
