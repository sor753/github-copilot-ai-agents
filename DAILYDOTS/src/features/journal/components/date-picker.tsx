import { useState } from 'react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

const toDateStr = (year: number, month: number, day: number): string => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const getTodayStr = (): string => {
  const now = new Date();
  return toDateStr(now.getFullYear(), now.getMonth(), now.getDate());
};

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const initial = value.length > 0 ? new Date(value + 'T00:00:00') : new Date();

  const [viewYear, setViewYear] = useState(() => initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => initial.getMonth());

  const todayStr = getTodayStr();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div
      role="group"
      aria-label="日付選択"
      className="w-full max-w-xs select-none rounded-lg border border-stone-200 bg-white p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="前の月"
          className="flex h-8 w-8 items-center justify-center rounded-md text-lg text-stone-500 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={goPrev}
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-stone-900">
          {viewYear}年{viewMonth + 1}月
        </span>
        <button
          type="button"
          aria-label="次の月"
          className="flex h-8 w-8 items-center justify-center rounded-md text-lg text-stone-500 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={goNext}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex h-8 items-center justify-center text-xs font-medium text-stone-400"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const isSelected = dateStr === value;
          const isToday = dateStr === todayStr;

          const baseClass =
            'flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';
          const stateClass = isSelected
            ? 'bg-accent font-semibold text-white'
            : isToday
              ? 'border border-accent font-medium text-accent hover:bg-accent-soft'
              : 'text-stone-700 hover:bg-stone-100';

          return (
            <button
              key={day}
              type="button"
              aria-label={`${viewYear}年${viewMonth + 1}月${day}日`}
              aria-pressed={isSelected}
              className={`${baseClass} ${stateClass}`}
              onClick={() => onChange(dateStr)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
