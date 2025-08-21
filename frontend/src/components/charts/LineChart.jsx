import Chart from "react-apexcharts";

export const LineChart = ({ options, series, title }) => (
  <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:p-6">
    {title && <h5 className="text-xl font-bold leading-none text-gray-900 mb-4">{title}</h5>}
    <Chart options={options} series={series} type="line" height={300} />
  </div>
);
