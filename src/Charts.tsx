import React, { useContext, useEffect, useRef } from "react";
import {
  TimePeriodContext,
  type CurrencyState,
} from "./contexts/CurrencyContext";
import { getColors, getDatesFromRange } from "./util";
import { Chart, registerables } from "chart.js";
import dayjs from "dayjs";
import { sliceNum, getElementProperty } from "./util";

Chart.register(...registerables);
Chart.defaults.font = {
  family: "JetBrains",
  size: 10,
  weight: 400,
  lineHeight: 1,
};

type GraphProp = {
  dates: string[];
  rates: number[];
  currencyState: CurrencyState;
};

function GraphContainerLoading() {
  return (
    <div className="w-full h-68 bg-neutral-600 rounded-2xl animate-pulse"></div>
  );
}

const GraphContainer: React.FC<GraphProp> = ({
  rates,
  dates,
  currencyState,
}) => {
  const { timePeriod } = useContext(TimePeriodContext);
  const graphCanvas = useRef<HTMLCanvasElement | null>(null);
  const prevWidth = useRef(0);
  const maxRate = Math.max(...rates),
    minRate = Math.min(...rates);

  useEffect(() => {
    if (!graphCanvas.current) return;

    const ctx = graphCanvas.current.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates.map((date) => dayjs(date).format("MMM DD")),
        datasets: [
          {
            data: rates,
            fill: true,
            borderWidth: 2,
            borderJoinStyle: "round",
            pointStyle: false,
          },
        ],
      },
      options: {
        backgroundColor: (context) => {
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height,
          );

          gradient.addColorStop(0, getColors("lime-500"));
          gradient.addColorStop(1, "transparent");

          return gradient;
        },
        borderColor: getColors("lime-500"),
        layout: {
          autoPadding: false,
        },
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label(context) {
                return context.raw === rates.at(-1)
                  ? `1 ${currencyState.base} is ${context.formattedValue} ${currencyState.quote}`
                  : `1 ${currencyState.base} was ${context.formattedValue} ${currencyState.quote}`;
              },
            },
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
            max: maxRate,
          },
        },
      },
    });

    const cntrl = new AbortController();
    const parent = graphCanvas.current.parentElement!.parentElement!;
    const sibling = graphCanvas.current.parentElement!.previousElementSibling!;
    const getWidth = (el: Element) =>
      getElementProperty(el as HTMLElement, "width");

    prevWidth.current = getWidth(graphCanvas.current);

    window.addEventListener(
      "resize",
      () => {
        const width =
          getWidth(parent) -
          getWidth(sibling) -
          getElementProperty(parent, "column-gap");
        if (width >= prevWidth.current) {
          prevWidth.current = width;
          return;
        }
        chart.resize(width, 272);
        prevWidth.current = width;
      },
      { signal: cntrl.signal },
    );

    return () => {
      chart.destroy();
      cntrl.abort();
    };
  }, [dates]);

  return (
    <div className="space-y-4">
      <div
        className="grid gap-x-4"
        style={{
          gridTemplateAreas: '"yAxis graph" ". xAxis"',
          gridTemplateColumns: "auto 1fr",
        }}
      >
        <div
          className="flex justify-between flex-col *:text-preset-6 *:text-neutral-200"
          style={{
            gridArea: "yAxis",
          }}
        >
          <p>{sliceNum(maxRate, 4)}</p>
          <p>{sliceNum((maxRate + minRate) / 2, 4)}</p>
          <p>{sliceNum(minRate, 4)}</p>
        </div>
        <div
          className="relative h-68"
          style={{
            gridArea: "graph",
          }}
        >
          <canvas
            className="w-full z-10"
            ref={graphCanvas}
            height="272"
          ></canvas>
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between *:w-full *:border *:border-neutral-500 *:border-dashed">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div
          className="flex justify-between pbs-4"
          style={{
            gridArea: "xAxis",
          }}
        >
          {getDatesFromRange(timePeriod)
            .map((date) => dayjs(date).format("MMM DD"))
            .map((date, index) => (
              <span className="text-preset-6 text-neutral-200" key={index}>
                {date}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export function ChartContainerLoading() {
  return (
    <div className="space-y-5 px-3 py-4 rounded-2xl bg-neutral-700 border border-neutral-600">
      <div className="flex justify-between items-center">
        <p className="text-preset-3 font-medium flex items-center">
          <span className="block h-5 w-[3ch] bg-neutral-600 rounded-sm animate-pulse"></span>
          <span>/</span>
          <span className="block h-5 w-[3ch] bg-neutral-600 rounded-sm animate-pulse"></span>
        </p>
        <p className="w-35 h-3 rounded-sm bg-neutral-600 animate-pulse"></p>
      </div>
      <GraphContainerLoading />
    </div>
  );
}

type ChartContainerProp = {
  dates: string[];
  rates: number[];
  currencyState: CurrencyState;
};

const ChartContainer: React.FC<ChartContainerProp> = ({
  rates,
  dates,
  currencyState,
}) => {
  const date = dayjs();

  return (
    <div className="space-y-5 px-3 py-4 sm:p-5 rounded-2xl bg-neutral-700 border border-neutral-600">
      <div className="flex justify-between items-center">
        <p className="text-preset-3 font-medium">
          {currencyState.base}/{currencyState.quote}
        </p>
        <p className="text-preset-5 opacity-70">
          {sliceNum(currencyState.rate)} &middot; {date.format("MMM DD HH:mm")}{" "}
          {date.toString().substring(date.toString().length - 3)}
        </p>
      </div>
      <GraphContainer
        rates={rates}
        dates={dates}
        currencyState={currencyState}
      />
    </div>
  );
};

export default ChartContainer;
