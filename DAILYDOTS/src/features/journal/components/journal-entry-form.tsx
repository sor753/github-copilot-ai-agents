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

      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700" htmlFor="entry-mood">
        気分
        <div className="relative">
          <select
            id="entry-mood"
            className="w-full appearance-none rounded-md border border-stone-300 bg-white px-3 py-2 pr-12 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            value={mood}
            onChange={(event) => setMood(event.target.value as Mood)}
          >
            {MOOD_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-500"
            aria-hidden
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.123l3.71-3.894a.75.75 0 111.08 1.04l-4.25 4.46a.75.75 0 01-1.08 0l-4.25-4.46a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </label>

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
