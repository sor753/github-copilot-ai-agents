import { useMemo, useState, type FormEvent } from 'react';

import { MOOD_OPTIONS } from './mood-badge';
import type { Mood, UpsertJournalEntryInput } from '../types';

interface JournalEntryFormProps {
  initialValue: UpsertJournalEntryInput;
  submitLabel: string;
  isSubmitting: boolean;
  helperText?: string;
  onSubmit: (value: UpsertJournalEntryInput) => Promise<void>;
}

export const JournalEntryForm = ({
  initialValue,
  submitLabel,
  isSubmitting,
  helperText,
  onSubmit,
}: JournalEntryFormProps) => {
  const [date, setDate] = useState(initialValue.date);
  const [mood, setMood] = useState<Mood>(initialValue.mood);
  const [text, setText] = useState(initialValue.text);

  const quickDateOptions = useMemo(() => {
    const formatDate = (value: Date): string => {
      const year = value.getFullYear();
      const month = `${value.getMonth() + 1}`.padStart(2, '0');
      const day = `${value.getDate()}`.padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const buildDate = (offset: number): Date => {
      const now = new Date();
      const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      base.setDate(base.getDate() - offset);
      return base;
    };

    return Array.from({ length: 7 }, (_, offset) => {
      const targetDate = buildDate(offset);
      const label =
        offset === 0
          ? '今日'
          : offset === 1
            ? '昨日'
            : `${new Intl.DateTimeFormat('ja-JP', { weekday: 'long' }).format(targetDate)}`;

      return {
        label,
        value: formatDate(targetDate),
      };
    });
  }, []);

  const canSubmit = useMemo(() => {
    return date.length > 0 && text.trim().length > 0;
  }, [date, text]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await onSubmit({
      date,
      mood,
      text: text.trim(),
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700" htmlFor="entry-date">
        日付
        <input
          id="entry-date"
          type="date"
          className="w-full max-w-72 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </label>

      <div className="flex flex-wrap gap-2" aria-label="クイック日付選択">
        {quickDateOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setDate(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-stone-700">気分</legend>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((option) => {
            const isActive = mood === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? 'border-accent bg-accent text-white'
                    : 'border-stone-300 bg-white text-stone-700 hover:border-accent hover:text-accent'
                }`}
                onClick={() => setMood(option.value)}
                aria-pressed={isActive}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700" htmlFor="entry-text">
        ジャーナル
        <textarea
          id="entry-text"
          className="min-h-40 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="今日の出来事や気持ちを書いてください"
          required
        />
        <span className="text-right text-xs font-normal text-stone-500">{text.length}文字</span>
      </label>

      {helperText ? <p className="text-sm text-stone-600">{helperText}</p> : null}

      <button
        type="submit"
        className="min-h-11 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? '保存中...' : submitLabel}
      </button>
    </form>
  );
};
