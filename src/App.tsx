import { useState, useEffect } from "react";
import "./App.css";

// constants
const EMOJIS = ["🥦", "🍔"];
const STORAGE_KEY = "emoji-calendar-data-v1";

// health tracking
const HEALTHY = ["🥦"];
const UNHEALTHY = ["🍔"];

// format date as YYYY-MM-DD in local time
function formatDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD (local)
}

export default function App() {
  // Date.now() is UTC, so we need to use local time to get the current month/year
  const today = new Date();

  // states
  const [month, setMonth] = useState<number>(today.getMonth()); // 0-11
  const [year, setYear] = useState<number>(today.getFullYear());
  const [data, setData] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // change month
  const changeMonth = (delta: number) => {
    const newDate = new Date(year, month + delta, 1);
    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
  };

  // go to today
  const goToToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  // build 6x7 grid (42 cells). Using Date overflow makes previous/next month days simple.
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0..6
  const cells: { date: Date; inCurrentMonth: boolean; key: string }[] = [];
  for (let i = 0; i < 42; i++) {
    // i - firstDayIndex + 1 becomes the day-of-month (may be <=0 or >daysInMonth)
    const dayNum = i - firstDayIndex + 1;
    const d = new Date(year, month, dayNum); // JS handles overflow into prev/next month
    const inCurrentMonth = d.getMonth() === month;
    cells.push({ date: d, inCurrentMonth, key: formatDateLocal(d) });
  }

  // emoji picker handlers
  // set emoji
  function setEmoji(key: string, emoji: string) {
    setData((prev) => ({ ...prev, [key]: emoji }));
    setSelectedKey(null);
  }

  // clear emoji
  function clearEmoji(key: string) {
    setData((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setSelectedKey(null);
  }

  // compute stats
  const total = Object.keys(data).length;
  let healthyCount = 0;
  let unhealthyCount = 0;

  for (const emoji of Object.values(data)) {
    if (HEALTHY.includes(emoji)) healthyCount++;
    if (UNHEALTHY.includes(emoji)) unhealthyCount++;
  }

  const healthyPct = total > 0 ? Math.round((healthyCount / total) * 100) : 0;
  const unhealthyPct =
    total > 0 ? Math.round((unhealthyCount / total) * 100) : 0;

  return (
    <div className="app">
      {/* main content */}
      <div className="main-content">
        {/* calendar */}
        <div className="calendar">
          {/* header */}
          <div className="header">
            <button className="nav" onClick={() => changeMonth(-1)}>
              ◀
            </button>
            <div className="title">
              {new Date(year, month)
                .toLocaleString("default", { month: "long" })
                .toUpperCase()}{" "}
              {year}
            </div>
            <button className="nav" onClick={() => changeMonth(1)}>
              ▶
            </button>
          </div>

          {/* controls */}
          <div className="controls">
            <button onClick={goToToday} className="today-btn">
              Today
            </button>
          </div>

          {/* weekdays */}
          <div className="weekdays">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="wd">
                {d}
              </div>
            ))}
          </div>

          {/* grid */}
          <div className="grid">
            {cells.map(({ date, inCurrentMonth, key }) => (
              <div
                key={key}
                className={`day ${inCurrentMonth ? "current" : "muted"}`}
                onClick={() => setSelectedKey(key)}
              >
                <span className="day-number">{date.getDate()}</span>
                <div className="emoji">{data[key] ?? ""}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right panel */}
        <div className="right-panel">
          🥦 {healthyPct}% <br />
          🍔 {unhealthyPct}%
        </div>
      </div>

      {/* emoji picker */}
      {selectedKey && (
        <div className="picker">
          <div className="picker-title">Choose emoji for {selectedKey}</div>
          <div className="picker-row">
            {EMOJIS.map((e) => (
              <button
                key={e}
                className="emoji-btn"
                onClick={() => setEmoji(selectedKey, e)}
              >
                {e}
              </button>
            ))}
            <button
              className="clear-btn"
              onClick={() => clearEmoji(selectedKey)}
            >
              Clear
            </button>
            <button className="close-btn" onClick={() => setSelectedKey(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

