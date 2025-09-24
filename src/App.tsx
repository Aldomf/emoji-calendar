import { useState, useEffect } from "react";
import "./App.css";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import RightPanel from "./components/RightPanel";
import EmojiPicker from "./components/EmojiPicker";
import { STORAGE_KEY } from "./consts/constants";

export default function App() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [data, setData] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const changeMonth = (delta: number) => {
    const newDate = new Date(year, month + delta, 1);
    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
  };

  const goToToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  const setEmoji = (key: string, emoji: string) => {
    setData((prev) => ({ ...prev, [key]: emoji }));
    setSelectedKey(null);
  };

  const clearEmoji = (key: string) => {
    setData((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setSelectedKey(null);
  };

  return (
    <div className="app">
      <div className="main-content">
        <div className="calendar">
          <CalendarHeader
            month={month}
            year={year}
            changeMonth={changeMonth}
            goToToday={goToToday}
          />
          <CalendarGrid
            year={year}
            month={month}
            data={data}
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
            today={today}
          />
        </div>
        <RightPanel data={data} />
      </div>

      {selectedKey && (
        <EmojiPicker
          selectedKey={selectedKey}
          setEmoji={setEmoji}
          clearEmoji={clearEmoji}
          close={() => setSelectedKey(null)}
        />
      )}
    </div>
  );
}
