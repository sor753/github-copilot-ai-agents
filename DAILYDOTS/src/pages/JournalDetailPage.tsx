import { Link, useParams } from 'react-router-dom';

import { AppLayout } from '../shared/components/app-layout';

import { MoodBadge } from '../features/journal/components/mood-badge';
import { useJournalEntry } from '../features/journal/hooks/use-journal-queries';

const JournalDetailPage = () => {
  const params = useParams();
  const date = params.date;

  if (!date) {
    throw new Error('date route param is required');
  }

  const entryQuery = useJournalEntry(date);

  if (entryQuery.isLoading) {
    return (
      <AppLayout title="ジャーナル詳細" subtitle="記録内容を確認できます。">
        <p className="text-stone-600">読み込み中...</p>
      </AppLayout>
    );
  }

  if (entryQuery.isError || !entryQuery.data) {
    return (
      <AppLayout title="ジャーナル詳細" subtitle="記録内容を確認できます。">
        <p className="text-danger">該当するエントリが見つかりません。</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`ジャーナル詳細: ${entryQuery.data.date}`} subtitle="記録の閲覧と編集ができます。">
      <article className="rounded-lg border border-stone-200 bg-white p-5">
        <div className="space-y-2">
          <p className="text-sm text-stone-500">日付</p>
          <p className="text-base font-semibold text-stone-900">{entryQuery.data.date}</p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-stone-500">気分</p>
          <MoodBadge mood={entryQuery.data.mood} />
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-stone-500">本文</p>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-stone-800">{entryQuery.data.text}</p>
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            to={`/journal/${entryQuery.data.date}/edit`}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            編集する
          </Link>
          <Link
            to="/journal"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            一覧に戻る
          </Link>
        </div>
      </article>
    </AppLayout>
  );
};

export default JournalDetailPage;
