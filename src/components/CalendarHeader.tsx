type Props = {
  month: number;
  year: number;
  changeMonth: (delta: number) => void;
  goToToday: () => void;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  isMobile: boolean;
};

export default function CalendarHeader({
  month,
  year,
  changeMonth,
  goToToday,
  setSidebarOpen,
  sidebarOpen,
  isMobile,
}: Props) {
  return (
    <>
      <div className="header">
        <button className="nav" onClick={() => changeMonth(-1)}>
          ◀
        </button>
        <div className="title">
          {new Date(year, month)
            .toLocaleString("default", { month: isMobile ? "short" : "long" })
            .toUpperCase()}{" "}
          {year}
        </div>

        <button className="nav" onClick={() => changeMonth(1)}>
          ▶
        </button>
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </div>
      <div className="controls">
        <button onClick={goToToday} className="today-btn">
          Today
        </button>
      </div>
    </>
  );
}
