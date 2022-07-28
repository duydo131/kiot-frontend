import { useState, useEffect } from 'react';
import { Doughnut } from "react-chartjs-2";
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

export default function DoughnutChart(props) {
  const {chartData, nameChart, legendDisplay} = props

  return (
    <div style={{width: '40%', height:'auto'}}>
      <Doughnut
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