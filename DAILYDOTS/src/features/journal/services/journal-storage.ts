import type {
  JournalEntry,
  JournalSummary,
  Mood,
  UpsertJournalEntryInput,
} from '../types';

interface JournalRepository {
  list(): Promise<JournalEntry[]>;
  getByDate(date: string): Promise<JournalEntry | null>;
  upsert(input: UpsertJournalEntryInput): Promise<JournalEntry>;
  removeByDate(date: string): Promise<void>;
  getSummary(): Promise<JournalSummary>;
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = 'dailydots:journal-entries:v1';
const VALID_MOODS: Mood[] = ['great', 'good', 'neutral', 'bad', 'terrible'];

const isMood = (value: unknown): value is Mood => {
  return typeof value === 'string' && VALID_MOODS.includes(value as Mood);
};

const isJournalEntry = (value: unknown): value is JournalEntry => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.date === 'string' &&
    isMood(candidate.mood) &&
    typeof candidate.text === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
};

const sortByDateDesc = (entries: JournalEntry[]): JournalEntry[] => {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
};

const toIsoDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const countStreakDays = (entries: JournalEntry[]): number => {
  if (entries.length === 0) {
    return 0;
  }

  const allDates = new Set(entries.map((entry) => entry.date));
  const cursor = new Date();
  let streak = 0;

  while (allDates.has(toIsoDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const countRecentEntries = (entries: JournalEntry[]): number => {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 6);

  return entries.filter((entry) => {
    const date = new Date(`${entry.date}T00:00:00`);
    return date >= from && date <= today;
  }).length;
};

class LocalStorageJournalRepository implements JournalRepository {
  private readonly storage: StorageLike;

  public constructor(storage: StorageLike) {
    this.storage = storage;
  }

  public async list(): Promise<JournalEntry[]> {
    const entries = this.readAll();
    return sortByDateDesc(entries);
  }

  public async getByDate(date: string): Promise<JournalEntry | null> {
    const entries = this.readAll();
    return entries.find((entry) => entry.date === date) ?? null;
  }

  public async upsert(input: UpsertJournalEntryInput): Promise<JournalEntry> {
    const entries = this.readAll();
    const now = new Date().toISOString();
    const nextEntry: JournalEntry = {
      date: input.date,
      mood: input.mood,
      text: input.text,
      updatedAt: now,
    };

    const nextEntries = entries.some((entry) => entry.date === input.date)
      ? entries.map((entry) => (entry.date === input.date ? nextEntry : entry))
      : [...entries, nextEntry];

    this.writeAll(sortByDateDesc(nextEntries));
    return nextEntry;
  }

  public async removeByDate(date: string): Promise<void> {
    const entries = this.readAll();
    const nextEntries = entries.filter((entry) => entry.date !== date);
    this.writeAll(sortByDateDesc(nextEntries));
  }

  public async getSummary(): Promise<JournalSummary> {
    const entries = sortByDateDesc(this.readAll());
    return {
      totalEntries: entries.length,
      recentEntries: countRecentEntries(entries),
      streakDays: countStreakDays(entries),
      latestMood: entries[0]?.mood ?? null,
    };
  }

  private readAll(): JournalEntry[] {
    const raw = this.storage.getItem(STORAGE_KEY);

    if (raw === null) {
      return [];
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      throw new Error('Failed to parse journal entries from localStorage');
    }

    if (!Array.isArray(parsed) || !parsed.every((item) => isJournalEntry(item))) {
      throw new Error('Journal storage contains invalid payload');
    }

    return parsed;
  }

  private writeAll(entries: JournalEntry[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}

const resolveStorage = (): StorageLike => {
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('localStorage is unavailable in this environment');
  }

  return window.localStorage;
};

let repositoryInstance: JournalRepository | null = null;

export const getJournalRepository = (): JournalRepository => {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  repositoryInstance = new LocalStorageJournalRepository(resolveStorage());
  return repositoryInstance;
};

export { LocalStorageJournalRepository };
