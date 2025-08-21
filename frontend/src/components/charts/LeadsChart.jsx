import Chart from "react-apexcharts";

export const LeadsChart = ({ options }) => (
  <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 md:p-6">
    <h5 className="leading-none text-2xl font-bold text-gray-900 pb-2">3.4k Leads</h5>
    <p className="text-sm font-normal text-gray-500">Generated per week</p>
    <div className="mt-4">
      <Chart options={options} series={options.series} type="bar" height={300} />
    </div>
  </div>
);
