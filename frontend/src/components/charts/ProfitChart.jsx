import Chart from "react-apexcharts";

export const ProfitChart = ({ options }) => (
  <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
    <h5 className="text-2xl font-bold text-gray-900 pb-2">Profit Report</h5>
    <p className="text-base text-gray-500">Income vs Expense (last 6 months)</p>
    <div className="mt-4">
      <Chart options={options} series={options.series} type="bar" height={400} />
    </div>
  </div>
);
