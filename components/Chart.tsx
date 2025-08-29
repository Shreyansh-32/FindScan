"use client";

import {
  computeBollingerBands,
  Data,
  BollingerBandsOptions,
  defaultBollingerBandsOptions,
} from "@/lib/indicator/bollinger";
import { useEffect, useState, useRef } from "react";
import { init, dispose, KLineData, TooltipShowRule, TooltipShowType, Chart as ChartInstanceType } from "klinecharts";
import BollingerSettings from "./BollingerSettings";

function ChartComponent({ data, options }: { data: KLineData[], options: BollingerBandsOptions }) {
  const chartRef = useRef<ChartInstanceType | null>(null);

  useEffect(() => {
    const chart = init("chart");
    chartRef.current = chart;
    if(!chart)return;
    chart.createIndicator("BOLL", true, { id: "candle_pane" });
    
    return () => {
      if (chartRef.current) {
        dispose(chartRef.current);
        chartRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.setStyles({
      candle: {
        bar: {
          upColor: '#26A69A', downColor: '#EF5350',
          upBorderColor: '#26A69A', downBorderColor: '#EF5350',
          upWickColor: '#26A69A', downWickColor: '#EF5350',
        },
        tooltip: {
          showRule: TooltipShowRule.FollowCross,
          showType: TooltipShowType.Rect,
        },
      },
      indicator: {
        lines: [
          { color: options.style.basis.visibility ? options.style.basis.color : 'transparent', size: options.style.basis.lineWidth },
          { color: options.style.upper.visibility ? options.style.upper.color : 'transparent', size: options.style.upper.lineWidth },
          { color: options.style.lower.visibility ? options.style.lower.color : 'transparent', size: options.style.lower.lineWidth },
        ],
        bars: [{
          upColor: `rgba(130, 130, 130, ${options.style.background.visibility ? options.style.background.opacity : 0})`,
          downColor: `rgba(130, 130, 130, ${options.style.background.visibility ? options.style.background.opacity : 0})`,
          noChangeColor: `rgba(130, 130, 130, ${options.style.background.visibility ? options.style.background.opacity : 0})`,
        }],
        tooltip: {
          showRule: TooltipShowRule.FollowCross,
          showType: TooltipShowType.Rect,
          text: { color: '#EAF0F3', size: 12 }
        },
      },
    });
    
    chart.applyNewData(data);
    
    chart.overrideIndicator({
      name: 'BOLL',
      // FIX: This function is now type-safe and provides a correctly shaped default object.
      calc: (kLineDataList: KLineData[]) => {
        return kLineDataList.map(d => {
          const indicator = d.indicator as { BOLL?: { mid: number | null; upper: number | null; lower: number | null } };
          return indicator?.BOLL ?? { mid: null, upper: null, lower: null };
        });
      },
      figures: [
        { key: 'mid', title: 'MID: ', type: 'line' },
        { key: 'upper', title: 'UP: ', type: 'line' },
        { key: 'lower', title: 'DN: ', type: 'line' },
      ],
    });

  }, [data, options]);

  return <div id="chart" style={{ width: "100%", height: "100%" }} />;
}


export default function Chart() {
  const [rawData, setRawData] = useState<Data[] | null>(null);
  const [chartData, setChartData] = useState<KLineData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<BollingerBandsOptions>(defaultBollingerBandsOptions);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/data/ohlcv.json");
        if (!response.ok) throw new Error("Error fetching data");
        const data: Data[] = await response.json();
        data.sort((a, b) => a.timestamp - b.timestamp);
        setRawData(data);
      } catch (error) {
        if (error instanceof Error) { setError(error.message); } 
        else { setError("An unknown error occurred"); }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (rawData) {
      const { upper, lower, basis } = computeBollingerBands(rawData, options);
      const combinedData: KLineData[] = rawData.map((candle, i) => ({
        ...candle,
        indicator: {
          BOLL: {
            mid: basis[i],
            upper: upper[i],
            lower: lower[i],
          },
        },
      }));
      setChartData(combinedData);
    }
  }, [rawData, options]);

  if (error) { return <div>Error loading chart data: {error}</div>; }
  if (!chartData) { return <div>Loading chart ...</div>; }

  return (
    <div className="w-[90%] h-[90%] flex flex-col p-4 border border-neutral-700 rounded-lg gap-4">
      <div className="flex justify-end">
        <BollingerSettings options={options} setOptions={setOptions} />
      </div>
      <div className="flex-grow w-full h-full">
        <ChartComponent data={chartData} options={options} />
      </div>
    </div>
  );
}