import { formatDateLocal } from "../utils/utils";

type Props = {
  year: number;
  month: number;
  data: Record<string, string>;
  selectedKey: string | null;
  setSelectedKey: (key: string) => void;
  today: Date;
};

export default function CalendarGrid({
  year,
  month,
  data,
  selectedKey,
  setSelectedKey,
  today,
}: Props) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const cells: { date: Date; inCurrentMonth: boolean; key: string }[] = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - firstDayIndex + 1;
    const d = new Date(year, month, dayNum);
    const inCurrentMonth = d.getMonth() === month;
    cells.push({ date: d, inCurrentMonth, key: formatDateLocal(d) });
  }

  return (
    <>
      <div className="weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="wd">
            {d}
          </div>
        ))}
      </div>
      <div className="grid">
        {cells.map(({ date, inCurrentMonth, key }, index) => {
          const isToday = date.getTime() === today.getTime();
          const isSelected = key === selectedKey;

          // Determinar inicio de semana (domingo) para cada fila
          const weekStartIndex = index - (index % 7);
          const weekCells = cells.slice(weekStartIndex, weekStartIndex + 7);

          // Verificar si todos los días de la semana son "🥦"
          const fullWeekBroccoli = weekCells.every((c) => data[c.key] === "🥦");

          const fullWeekHamburger = weekCells.every((c) => data[c.key] === "🍔");
          return (
            <div
              key={key}
              className={`day ${inCurrentMonth ? "current" : "muted"} ${
                isToday ? "today-cell" : ""
              } ${isSelected ? "selected-cell" : ""} ${
                fullWeekBroccoli ? "good-week" : ""
              } ${
                fullWeekHamburger ? "bad-week" : ""
              }`}
              onClick={() => setSelectedKey(key)}
            >
              <span className="day-number">{date.getDate()}</span>
              <div className="emoji">{data[key] ?? ""}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
