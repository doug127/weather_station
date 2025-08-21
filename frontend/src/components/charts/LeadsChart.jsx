import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { api } from "../../api/apiRoutes";

export const LeadsChart = () => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    setOptions({
      colors: ["#1A56DB", "#FDBA8C"],
      series: [
        {
          name: "Organic",
          color: "#1A56DB",
          data: [
            { x: "Mon", y: 231 },
            { x: "Tue", y: 122 },
            { x: "Wed", y: 63 },
            { x: "Thu", y: 421 },
            { x: "Fri", y: 122 },
            { x: "Sat", y: 323 },
            { x: "Sun", y: 111 },
          ],
        },
        {
          name: "Social media",
          color: "#FDBA8C",
          data: [
            { x: "Mon", y: 232 },
            { x: "Tue", y: 113 },
            { x: "Wed", y: 341 },
            { x: "Thu", y: 224 },
            { x: "Fri", y: 522 },
            { x: "Sat", y: 411 },
            { x: "Sun", y: 243 },
          ],
        },
      ],
      chart: { type: "bar", height: 300, fontFamily: "Inter, sans-serif", toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, columnWidth: "70%", borderRadiusApplication: "end", borderRadius: 8 } },
      tooltip: { shared: true, intersect: false },
      grid: { show: false },
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: { labels: { show: true, style: { colors: "#000", fontSize: "12px", fontFamily: "Inter, sans-serif" } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { show: false },
    });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">3.4k Leads</h5>
      <p className="text-sm font-normal text-gray-500">Generated per week</p>
      <div className="mt-4">
        <Chart options={options} series={options.series} type="bar" height={300} />
      </div>
    </div>
  );
};
