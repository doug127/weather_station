export const InputDate = ({ dateRange, setDateRange, id }) => {
  const isStart = id === "date-start";
  
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-center">
        {isStart ? "Fecha Inicio" : "Fecha Fin"}
      </label>
      <input
        type="date"
        id={id}
        value={isStart ? dateRange.min : dateRange.max}
        onChange={(e) =>
          setDateRange({
            ...dateRange,
            [isStart ? "min" : "max"]: e.target.value,
          })
        }
        className="border p-2"
        {...(isStart
          ? { max: dateRange.max || undefined }
          : { min: dateRange.min || undefined })}
      />
    </div>
  );
};