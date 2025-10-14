import { PrcpChart } from "../components/statistics/charts/PrcpChart";
import { TempChart } from "../components/statistics/charts/TempChart";
import { MultiChart } from "../components/statistics/charts/MultiChart";
import { KPIs } from "../components/statistics/kpi/Kpi";

export const Statistics = () => {
  const dateLastYear = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
  const sensorPrcpChart = "Pluviómetro";
  const sensorTempChart = ["Sensor Temperatura Promedio", "Sensor Temperatura Máxima", "Sensor Temperatura Mínima"];
  const excludedSensors = [sensorPrcpChart, ...sensorTempChart];
  const components = [
    { Component: KPIs, props: {} },
    { Component: PrcpChart, props: { dateLastYear, sensorPrcpChart } },
    { Component: TempChart, props: { dateLastYear, sensorTempChart } },
    { Component: MultiChart, props: { dateLastYear, excludedSensors } },
  ];

  return (
    <div className="p-4 space-y-6 w-full min-h-[75vh] flex flex-col items-center">
      {components.map(({ Component, props }, index) => (
        <div className="w-[calc(100vw-30vw)]" key={index}>
          <Component {...props} />
        </div>
      ))}
    </div>
  );
};
