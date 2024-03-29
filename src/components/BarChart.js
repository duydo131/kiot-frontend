import { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

export default function BarChart(props) {
  const {chartData, nameChart, legendDisplay, width} = props
  const displatWidth = width || '80%';

  return (
    <div style={{width: displatWidth, height:'auto'}}>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: nameChart
            },
            legend: {
              display: legendDisplay,
              position: "bottom"
            }
          }
        }}
      />
    </div>
  );
}