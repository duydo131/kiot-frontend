import React from 'react';
import {Line} from 'react-chartjs-2';
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

export default function LineChart(props) {
  const {chartData, nameChart, legendDisplay} = props

  return (
    <div style={{width: '700px', height:'auto'}}>
      <Line
          data={chartData}
          options={{
            plugins: {
              title: {
                display: true,
                text: nameChart,
                fontSize:20
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