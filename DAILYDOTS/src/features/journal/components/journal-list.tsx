import { Link } from 'react-router-dom';

import { MoodBadge } from './mood-badge';
import type { JournalEntry } from '../types';

interface JournalListProps {
  entries: JournalEntry[];
  onDelete: (date: string) => void;
  isDeleting: boolean;
}

export const JournalList = ({ entries, onDelete, isDeleting }: JournalListProps) => {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center text-stone-600">
        まだエントリがありません。最初の1件を書いてみましょう。
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {entries.map((entry) => (
        <li key={entry.date} className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-stone-900">{entry.date}</p>
              <MoodBadge mood={entry.mood} />
              <p className="line-clamp-2 text-sm leading-relaxed text-stone-700">{entry.text}</p>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/journal/${entry.date}`}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                開く
              </Link>
              <Link
                to={`/journal/${entry.date}/edit`}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                編集
              </Link>
              <button
                type="button"
                className="min-h-11 rounded-md bg-danger px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isDeleting}
                onClick={() => onDelete(entry.date)}
              >
                削除
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
