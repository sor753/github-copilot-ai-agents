import { useNavigate, useParams } from 'react-router-dom';

import { AppLayout } from '../shared/components/app-layout';

import { JournalEntryForm } from '../features/journal/components/journal-entry-form';
import {
  useJournalEntries,
  useJournalEntry,
  useUpsertJournalEntry,
} from '../features/journal/hooks/use-journal-queries';

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const JournalFormPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const editingDate = params.date;
  const isEditMode = Boolean(editingDate);
  const today = formatLocalDate(new Date());

  const allEntriesQuery = useJournalEntries();
  const entryQuery = useJournalEntry(editingDate ?? '');
  const upsertMutation = useUpsertJournalEntry();
  const submitErrorMessage =
    upsertMutation.isError && upsertMutation.error instanceof Error
      ? upsertMutation.error.message
      : upsertMutation.isError
        ? '保存に失敗しました。時間をおいて再度お試しください。'
        : undefined;

  if (allEntriesQuery.isLoading || (isEditMode && entryQuery.isLoading)) {
    return (
      <AppLayout title="新しいジャーナルを追加" subtitle="日付が存在する場合は更新されます。">
        <p className="text-stone-600">読み込み中...</p>
      </AppLayout>
    );
  }

  if (allEntriesQuery.isError || (isEditMode && entryQuery.isError)) {
    return (
      <AppLayout title="新しいジャーナルを追加" subtitle="日付が存在する場合は更新されます。">
        <p className="text-danger">データの読み込みに失敗しました。</p>
      </AppLayout>
    );
  }

  const initialValue = isEditMode
    ? {
        date: entryQuery.data?.date ?? editingDate ?? today,
        mood: entryQuery.data?.mood ?? 'neutral',
        text: entryQuery.data?.text ?? '',
      }
    : {
        date: today,
        mood: 'neutral' as const,
        text: '',
      };

  const entries = allEntriesQuery.data ?? [];
  const existingDateCount = new Set(entries.map((entry) => entry.date)).size;

  return (
    <AppLayout
      title={isEditMode ? 'ジャーナルを編集' : '新しいジャーナルを追加'}
      subtitle="日付が重複する場合は新規作成ではなく更新になります。"
    >
      <section className="rounded-lg border border-stone-200 bg-white p-5">
        <JournalEntryForm
          initialValue={initialValue}
          submitLabel={isEditMode ? '変更を保存' : '作成または更新'}
          isSubmitting={upsertMutation.isPending}
          helperText={isEditMode ? '既存エントリを編集中です。' : '同じ日付が存在すると上書きされます。'}
          errorMessage={submitErrorMessage}
          onSubmit={async (value) => {
            try {
              await upsertMutation.mutateAsync(value);
              navigate(`/journal/${value.date}`);
            } catch {
              // Error is displayed via mutation state.
            }
          }}
        />
      </section>

      {!isEditMode ? (
        <section className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-600">
            既存の日付数: <span className="font-semibold text-stone-900">{existingDateCount}</span>
          </p>
        </section>
      ) : null}
    </AppLayout>
  );
};

export default JournalFormPage;
