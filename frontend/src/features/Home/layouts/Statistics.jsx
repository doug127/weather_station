import { PrcpChart } from "../components/statistics/charts/PrcpChart";
import { TempChart } from "../components/statistics/charts/TempChart";
import { MultiChart } from "../components/statistics/charts/MultiChart";
// import { ChirpsMap } from "./charts/ChirpsMap";
import { KPIs } from "../components/statistics/kpi/Kpi";

export const Statistics = () => {
  const dateLastYear = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
  const sensorPrcpChart = "Pluviómetro";
  const sensorTempChart = ["Sensor Temperatura Promedio", "Sensor Temperatura Máxima", "Sensor Temperatura Mínima"];
  const excludedSensors = [sensorPrcpChart, ...sensorTempChart];

  return (
    <div className="p-4 space-y-6">
      <div className="w-full">
        <KPIs />
      </div>

      <div className="w-full">
        <PrcpChart dateLastYear={dateLastYear} sensorPrcpChart={sensorPrcpChart} />
      </div>

      <div className="w-full">
        <TempChart dateLastYear={dateLastYear} sensorTempChart={sensorTempChart} />
      </div>

      <div className="flex flex-wrap gap-5">
        <div className="flex-1 min-w-[300px]">
          <MultiChart dateLastYear={dateLastYear} excludedSensors={excludedSensors} />
        </div>
        {/* <div className="flex-1 min-w-[300px]">
          <ChirpsMap title="Visitors Overview" />
        </div> */}
      </div>
    </div>
  );
};
