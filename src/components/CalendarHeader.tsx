type Props = {
  month: number;
  year: number;
  changeMonth: (delta: number) => void;
  goToToday: () => void;
};

export default function CalendarHeader({ month, year, changeMonth, goToToday }: Props) {
  return (
    <>
      <div className="header">
        <button className="nav" onClick={() => changeMonth(-1)}>◀</button>
        <div className="title">
          {new Date(year, month)
            .toLocaleString("default", { month: "long" })
            .toUpperCase()}{" "}
          {year}
        </div>
        <button className="nav" onClick={() => changeMonth(1)}>▶</button>
      </div>
      <div className="controls">
        <button onClick={goToToday} className="today-btn">Today</button>
      </div>
    </>
  );
}
