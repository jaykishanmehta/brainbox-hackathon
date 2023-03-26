import React from "react";
import ReactApexCharts from "react-apexcharts";

const SplineChart = (obj) => {
  console.log(
    "expected_consumption===",
    obj.expected_consumption,
    "actual====",
    obj.actual_consumption
  );
  let actual_arr = [],
    expected_arr = [],
    actual_hourly_cost = [],
    expected_hourly_cost = [];

  actual_arr.push(obj.actual_consumption);
  actual_hourly_cost.push(obj.actual_consumption * 10);
  expected_arr.push(obj.expected_consumption);
  expected_hourly_cost.push(obj.expected_consumption * 10);

  const test = {
    series: [
      {
        name: "Dummy Line",
        data: [200],
      },
      {
        name: "Dummy Line 2",
        data: [200],
      },
      {
        name: "Expected Consumption (kwh)",
        data: expected_arr,
      },
      {
        name: "Actual Consumption(kwh)",
        data: actual_arr,
      },
      {
        name: "Expected Hourly Cost (INR)",
        data: expected_hourly_cost,
      },
      {
        name: "Actual Hourly Cost(INR)",
        data: actual_hourly_cost,
      },
    ],
    options: {
      chart: {
        height: 250,
        type: "bar",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  };
  return (
    <div id="chart">
      <ReactApexCharts
        options={test.options}
        series={test.series}
        type="bar"
        height={450}
      />
    </div>
  );
};

export default SplineChart;
