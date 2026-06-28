import { Link } from 'react-router-dom';

import { AppLayout } from '../shared/components/app-layout';

import { JournalEntryForm } from '../features/journal/components/journal-entry-form';
import { MoodBadge } from '../features/journal/components/mood-badge';
import {
  useJournalEntry,
  useJournalSummary,
  useUpsertJournalEntry,
} from '../features/journal/hooks/use-journal-queries';

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const HomePage = () => {
  const today = formatLocalDate(new Date());
  const summaryQuery = useJournalSummary();
  const todayEntryQuery = useJournalEntry(today);
  const upsertMutation = useUpsertJournalEntry();
  const submitErrorMessage =
    upsertMutation.isError && upsertMutation.error instanceof Error
      ? upsertMutation.error.message
      : upsertMutation.isError
        ? '保存に失敗しました。時間をおいて再度お試しください。'
        : undefined;

  if (summaryQuery.isLoading || todayEntryQuery.isLoading) {
    return (
      <AppLayout title="ホーム" subtitle="今日の気分と最近の状況を確認できます。">
        <p className="text-stone-600">読み込み中...</p>
      </AppLayout>
    );
  }

  if (summaryQuery.isError || todayEntryQuery.isError) {
    return (
      <AppLayout title="ホーム" subtitle="今日の気分と最近の状況を確認できます。">
        <p className="text-danger">データの読み込みに失敗しました。</p>
      </AppLayout>
    );
  }

  if (!summaryQuery.data) {
    return (
      <AppLayout title="ホーム" subtitle="今日の気分と最近の状況を確認できます。">
        <p className="text-danger">サマリーデータを取得できませんでした。</p>
      </AppLayout>
    );
  }

  const summary = summaryQuery.data;
  const todayEntry = todayEntryQuery.data;

  return (
    <AppLayout title="ホーム" subtitle="サマリー確認と今日のクイック追加ができます。">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">総エントリ数</p>
          <p className="text-2xl font-bold text-stone-900">{summary.totalEntries}</p>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">直近7日</p>
          <p className="text-2xl font-bold text-stone-900">{summary.recentEntries}</p>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">連続記録</p>
          <p className="text-2xl font-bold text-stone-900">{summary.streakDays}日</p>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">最新の気分</p>
          <div className="pt-2">
            {summary.latestMood ? (
              <MoodBadge mood={summary.latestMood} />
            ) : (
              <p className="text-sm text-stone-500">まだ未記録</p>
            )}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-stone-900">今日のクイック追加</h2>
        <p className="mt-1 text-sm text-stone-600">
          日付は本日固定です。すでに存在する場合は更新されます。
        </p>
        <div className="mt-4">
          <JournalEntryForm
            initialValue={{
              date: today,
              mood: todayEntry?.mood ?? 'neutral',
              text: todayEntry?.text ?? '',
            }}
            submitLabel={todayEntry ? '今日の記録を更新' : '今日の記録を作成'}
            helperText={todayEntry ? '本日の既存エントリを編集中です。' : undefined}
            errorMessage={submitErrorMessage}
            isSubmitting={upsertMutation.isPending}
            onSubmit={async (value) => {
              try {
                await upsertMutation.mutateAsync(value);
              } catch {
                // Error is displayed via mutation state.
              }
            }}
          />
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-stone-900">マイジャーナルへ</h2>
        <p className="mt-1 text-sm text-stone-600">過去エントリの一覧・閲覧・編集・削除ができます。</p>
        <div className="mt-4">
          <Link
            to="/journal"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            マイジャーナルを開く
          </Link>
        </div>
      </section>
    </AppLayout>
  );
};

export default HomePage;
