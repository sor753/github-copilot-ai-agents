import { useNavigate } from 'react-router-dom';

import { AppLayout } from '../shared/components/app-layout';

import { JournalList } from '../features/journal/components/journal-list';
import {
  useDeleteJournalEntry,
  useJournalEntries,
} from '../features/journal/hooks/use-journal-queries';

const MyJournalPage = () => {
  const navigate = useNavigate();
  const entriesQuery = useJournalEntries();
  const deleteMutation = useDeleteJournalEntry();

  if (entriesQuery.isLoading) {
    return (
      <AppLayout title="マイジャーナル" subtitle="過去の記録を一覧で確認できます。">
        <p className="text-stone-600">読み込み中...</p>
      </AppLayout>
    );
  }

  if (entriesQuery.isError) {
    return (
      <AppLayout title="マイジャーナル" subtitle="過去の記録を一覧で確認できます。">
        <p className="text-danger">データの読み込みに失敗しました。</p>
      </AppLayout>
    );
  }

  const entries = entriesQuery.data ?? [];

  return (
    <AppLayout title="マイジャーナル" subtitle="開く・編集・削除が可能です。">
      <div className="flex justify-end">
        <button
          type="button"
          className="min-h-11 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => navigate('/journal/new')}
        >
          新しいジャーナルを追加
        </button>
      </div>

      <JournalList
        entries={entries}
        isDeleting={deleteMutation.isPending}
        onDelete={(date) => {
          void deleteMutation.mutateAsync(date);
        }}
      />
    </AppLayout>
  );
};

export default MyJournalPage;
