import { SensorChart } from "../../components/charts/SensorChart";
import { SalesChart } from "../../components/charts/SalesChart";
import { LeadsChart } from "../../components/charts/LeadsChart";
import { ProfitChart } from "../../components/charts/ProfitChart";
import { PieChart } from "../../components/charts/PieChart";
import { LineChart } from "../../components/charts/LineChart";

export const Statistics = () => {
  return (
    <div className="p-4 space-y-6">

      {/* Sensor Chart */}
      <div className="w-full">
        <SensorChart />
      </div>

      {/* Sales Chart */}
      <div className="w-full">
        <SalesChart />
      </div>

      {/* Leads Chart */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        <LeadsChart />
      </div>

      {/* Profit Chart */}
      <div className="w-full">
        <ProfitChart />
      </div>

      {/* Pie & Line Charts */}
      <div className="flex flex-wrap gap-5">
        <div className="flex-1 min-w-[300px]">
          <PieChart title="Website traffic" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <LineChart title="Visitors Overview" />
        </div>
      </div>
    </div>
  );
};
