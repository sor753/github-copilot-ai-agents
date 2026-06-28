import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  deleteJournalEntryByDate,
  fetchJournalEntries,
  fetchJournalEntryByDate,
  fetchJournalSummary,
  JOURNAL_QUERY_KEYS,
  upsertJournalEntry,
} from '../api';
import type { JournalEntry, JournalSummary, UpsertJournalEntryInput } from '../types';

export const useJournalEntries = (): UseQueryResult<JournalEntry[], Error> => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.entries,
    queryFn: fetchJournalEntries,
  });
};

export const useJournalEntry = (date: string): UseQueryResult<JournalEntry | null, Error> => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.entry(date),
    queryFn: () => fetchJournalEntryByDate(date),
    enabled: date.length > 0,
  });
};

export const useJournalSummary = (): UseQueryResult<JournalSummary, Error> => {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.summary,
    queryFn: fetchJournalSummary,
  });
};

export const useUpsertJournalEntry = (): UseMutationResult<
  JournalEntry,
  Error,
  UpsertJournalEntryInput
> => {
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

export const useDeleteJournalEntry = (): UseMutationResult<void, Error, string> => {
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
