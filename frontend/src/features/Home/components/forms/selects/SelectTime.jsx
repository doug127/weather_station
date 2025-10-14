export const SelectTime = ({ value, setValue, loading }) => {
    return (
        <select
            value={value}
            onChange={(e) => {
              e.preventDefault();
              setValue(e.target.value);
            }}
            className="border border-gray-300 rounded pl-0 text-xs py-1 cursor-pointer outline-none"
            disabled={loading}
          >
            <option value="all">Todos</option>
            <option value="15d">Últimos 15 días</option>
            <option value="1m">Último mes</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1a">Último año</option>
          </select>
    );
}
