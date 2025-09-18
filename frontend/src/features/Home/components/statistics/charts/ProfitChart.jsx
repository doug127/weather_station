import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { api } from "../../../api/apiRoutes";

export const ProfitChart = () => {
  const [options, setOptions] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Datos ficticios para pruebas
    const mockData = [
      { month: "Jan", value: 120 },
      { month: "Feb", value: 90 },
      { month: "Mar", value: 150 },
      { month: "Apr", value: 80 },
      { month: "May", value: 110 },
      { month: "Jun", value: 130 }
    ];
    const cats = mockData.map(item => item.month);
    setCategories(cats);

    setOptions({
      series: [{ name: "Precipitación (mm)", color: "#31C48D", data: mockData.map(d => d.value) }],
      chart: { type: "bar", height: 400, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, columnWidth: "50%", borderRadius: 6 } },
      dataLabels: { enabled: false },
      legend: { show: true, position: "bottom" },
      xaxis: { categories: cats },
      yaxis: { title: { text: "mm de lluvia" } },
      tooltip: { shared: true, intersect: false },
    });

    // Si quieres volver a usar la API, comenta las líneas de mock y descomenta esto:
    /*
    const fetchProfitData = async () => {
      try {
        const response = await api.get('/value/profit');
        const data = response.data; 
        const cats = data.map(item => item.month);
        setCategories(cats);

        setOptions({
          series: [{ name: "Precipitación (mm)", color: "#31C48D", data: data.map(d => d.value) }],
          chart: { type: "bar", height: 400, toolbar: { show: false } },
          plotOptions: { bar: { horizontal: false, columnWidth: "50%", borderRadius: 6 } },
          dataLabels: { enabled: false },
          legend: { show: true, position: "bottom" },
          xaxis: { categories: cats },
          yaxis: { title: { text: "mm de lluvia" } },
          tooltip: { shared: true, intersect: false },
        });
      } catch (error) {
        console.error("Error fetching profit data:", error);
      }
    };
    fetchProfitData();
    */
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
      <h5 className="text-2xl font-bold text-gray-900 pb-2">Profit Report</h5>
      <p className="text-base text-gray-500">Income vs Expense (last 6 months)</p>
      <div className="mt-4">
        <Chart options={options} series={options.series || []} type="bar" height={400} />
      </div>
    </div>
  );}