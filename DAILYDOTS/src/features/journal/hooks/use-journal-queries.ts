import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteJournalEntryByDate,
  fetchJournalEntries,
  fetchJournalEntryByDate,
  fetchJournalSummary,
  JOURNAL_QUERY_KEYS,
  upsertJournalEntry,
} from '../api';
import type { JournalEntry, UpsertJournalEntryInput } from '../types';

export const useJournalEntries = () => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.entries,
    queryFn: fetchJournalEntries,
  });
};

export const useJournalEntry = (date: string) => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.entry(date),
    queryFn: () => fetchJournalEntryByDate(date),
    enabled: date.length > 0,
  });
};

export const useJournalSummary = () => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.summary,
    queryFn: fetchJournalSummary,
  });
};

export const useUpsertJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertJournalEntryInput) => upsertJournalEntry(input),
    onSuccess: (entry: JournalEntry) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.entries });
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.summary });
      queryClient.setQueryData(JOURNAL_QUERY_KEYS.entry(entry.date), entry);
    },
  });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => deleteJournalEntryByDate(date),
    onSuccess: (_value, date) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.entries });
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.summary });
      queryClient.removeQueries({ queryKey: JOURNAL_QUERY_KEYS.entry(date) });
    },
  });
};
