import { useState } from "react";
import { HEALTHY, UNHEALTHY } from "../consts/constants";
import ProgressDonut from "../svg/ProgressDonut";

type Props = {
  data: Record<string, string>;
  sidebarOpen: boolean;
  month: number;
  year: number;
};

export default function RightPanel({ data, sidebarOpen, month, year }: Props) {
  const [showMonthly, setShowMonthly] = useState(false);

  function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day); // local time, no UTC shift
}


  // Filter data depending on toggle
  //only show data for current month
  //const now = new Date();
  const filteredData = showMonthly
  ? Object.fromEntries(
      Object.entries(data).filter(([key]) => {
        const date = parseDateKey(key);
        return (
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      })
    )
  : data;


  const total = Object.keys(filteredData).length;
  let healthyCount = 0;
  let unhealthyCount = 0;

  // Count healthy/unhealthy for percentages
  for (const emoji of Object.values(filteredData)) {
    if (HEALTHY.includes(emoji)) healthyCount++;
    if (UNHEALTHY.includes(emoji)) unhealthyCount++;
  }

  const healthyPct = total > 0 ? Math.round((healthyCount / total) * 100) : 0;
  const unhealthyPct =
    total > 0 ? Math.round((unhealthyCount / total) * 100) : 0;

  // Calculate streaks
  const sortedKeys = Object.keys(filteredData).sort();
  let currentHealthy = 0;
  let maxHealthy = 0;
  let currentUnhealthy = 0;
  let maxUnhealthy = 0;
  let prevDate: Date | null = null;

  for (const key of sortedKeys) {
    const emoji = filteredData[key];
    const date = parseDateKey(key);

    // check if consecutive day
    const isConsecutive =
      prevDate && date.getTime() - prevDate.getTime() === 24 * 60 * 60 * 1000;

    // Healthy streak
    if (HEALTHY.includes(emoji)) {
      currentHealthy = isConsecutive ? currentHealthy + 1 : 1;
      maxHealthy = Math.max(maxHealthy, currentHealthy);
      currentUnhealthy = 0; // reset opposite streak
    }

    // Unhealthy streak
    if (UNHEALTHY.includes(emoji)) {
      currentUnhealthy = isConsecutive ? currentUnhealthy + 1 : 1;
      maxUnhealthy = Math.max(maxUnhealthy, currentUnhealthy);
      currentHealthy = 0; // reset opposite streak
    }

    prevDate = date;
  }

  return (
    <div className={`right-panel ${sidebarOpen ? "open" : ""}`}>
      <div className="flex justify-between items-center">
        <h2>Statistics 📈</h2>
        <button
          className="toggle-btn"
          onClick={() => setShowMonthly((prev) => !prev)}
        >
          {showMonthly ? "Show All Time" : "Show This Month"}
        </button>
      </div>

      <hr />
      <p>
        <strong>
          {showMonthly ? "This Month’s Stats" : "All Time Stats"}
        </strong>
      </p>
      Total days logged: {total}
      <br />
      🥦 {healthyPct}% <span>({healthyCount})</span> <br />
      🍔 {unhealthyPct}% <span>({unhealthyCount})</span>
      <br />
      <br />
      <ProgressDonut healthyPct={healthyPct} unhealthyPct={unhealthyPct} />
      <h2>Streaks 🔥</h2>
      <hr />
      <div>🥦 Current streak: {currentHealthy}</div>
      <div>🥦 Longest streak: {maxHealthy}</div>
      <div>🍔 Current streak: {currentUnhealthy}</div>
      <div>🍔 Longest streak: {maxUnhealthy}</div>
    </div>
  );
}
