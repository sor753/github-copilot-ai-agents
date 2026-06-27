export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export type JournalEntry = {
  date: string;
  mood: Mood;
  text: string;
  updatedAt: string;
};

export type JournalSummary = {
  totalEntries: number;
  recentEntries: number;
  streakDays: number;
  latestMood: Mood | null;
};

export type UpsertJournalEntryInput = {
  date: string;
  mood: Mood;
  text: string;
};
