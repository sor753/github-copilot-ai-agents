import { getJournalRepository } from './services/journal-storage';
import type { JournalEntry, JournalSummary, UpsertJournalEntryInput } from './types';

export const JOURNAL_QUERY_KEYS = {
  entries: ['journal', 'entries'] as const,
  entry: (date: string): readonly ['journal', 'entry', string] => ['journal', 'entry', date],
  summary: ['journal', 'summary'] as const,
};

export const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
  const journalRepository = getJournalRepository();
  return journalRepository.list();
};

export const fetchJournalEntryByDate = async (date: string): Promise<JournalEntry | null> => {
  const journalRepository = getJournalRepository();
  return journalRepository.getByDate(date);
};

export const upsertJournalEntry = async (
  input: UpsertJournalEntryInput
): Promise<JournalEntry> => {
  const journalRepository = getJournalRepository();
  return journalRepository.upsert(input);
};

export const deleteJournalEntryByDate = async (date: string): Promise<void> => {
  const journalRepository = getJournalRepository();
  await journalRepository.removeByDate(date);
};

export const fetchJournalSummary = async (): Promise<JournalSummary> => {
  const journalRepository = getJournalRepository();
  return journalRepository.getSummary();
};
