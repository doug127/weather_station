import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { api } from "../../api/apiRoutes";

export const LineChart = ({ title }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchLineData = async () => {
      try {
        const response = await api.get('/value/line'); // Ajusta tu endpoint real
        const data = response.data;
        setSeries([{ name: "Visitors", data: data.values }]);
        setOptions({
          chart: { type: "line", height: 300, toolbar: { show: false } },
          stroke: { curve: "smooth", width: 2 },
          xaxis: { categories: data.labels },
          colors: ["#1C64F2"]
        });
      } catch (error) {
        console.error("Error fetching line chart data:", error);
      }
    };
    fetchLineData();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:p-6">
      {title && <h5 className="text-xl font-bold leading-none text-gray-900 mb-4">{title}</h5>}
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
};
