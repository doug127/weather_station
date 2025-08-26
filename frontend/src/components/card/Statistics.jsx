import { PrcpChart } from "../charts/PrcpChart";
import { TempChart } from "../charts/TempChart";
import { MultiChart } from "../../components/charts/MultiChart";
import { ChirpsMap } from "../../components/charts/ChirpsMap";

export const Statistics = () => {
  const dateLastYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
  const sensorPrcpChart = "Pluviómetro";
  const sensorTempChart = ["Sensor Temperatura Promedio", "Sensor Temperatura Máxima", "Sensor Temperatura Mínima"];
  const excludedSensors = [sensorPrcpChart, ...sensorTempChart];

  return (
    <div className="p-4 space-y-6">
      {/* Sensor Chart */}
      <div className="w-full">
        <PrcpChart dateLastYear={dateLastYear} sensorPrcpChart={sensorPrcpChart} />
      </div>

      {/* Temperature Chart */}
      <div className="w-full">
        <TempChart dateLastYear={dateLastYear} sensorTempChart={sensorTempChart} />
      </div>

      {/* Pie & Line Charts */}
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
