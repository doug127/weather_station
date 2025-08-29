export const InputTimestamp = ({
    label,
    type = "time", // "time" | "date"
    value,
    onChange,
}) => {
    return (
        <div className="w-full">
            <label className="block mb-1">{label}</label>

            {type === "time" ? (
                <select
                className="w-full border p-2 rounded-md cursor-pointer outline-none"
                value={value}
                onChange={onChange}
                >
                {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={`${String(i).padStart(2, "0")}:00`}>
                    {String(i).padStart(2, "0")}:00
                    </option>
                ))}
                </select>
            ) : (
                <input
                className="w-full border p-2 rounded-md cursor-pointer outline-none"
                type="date"
                value={value}
                onChange={onChange}
                />
            )}
        </div>
    );
}