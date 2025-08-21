import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { api } from "../../api/apiRoutes";

export const PieChart = ({ title }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const response = await api.get('/value/pie'); // Ajusta tu endpoint real
        const data = response.data;
        setSeries(data.values);
        setOptions({
          colors: ["#1C64F2", "#16BDCA", "#9061F9"],
          chart: { type: "pie", height: 350 },
          stroke: { colors: ["#fff"], lineCap: "round" },
          labels: data.labels,
          dataLabels: { enabled: true, style: { fontFamily: "Inter, sans-serif", fontSize: "14px" } },
          legend: { position: "bottom", fontFamily: "Inter, sans-serif" }
        });
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };
    fetchPieData();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:p-6">
      {title && <h5 className="text-xl font-bold leading-none text-gray-900 mb-4">{title}</h5>}
      <Chart options={options} series={series} type="pie" height={350} />
    </div>
  );
};
