-- journal_entries テーブルの作成
create table if not exists public.journal_entries (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  date       date        not null,
  mood       text        not null check (mood in ('great', 'good', 'neutral', 'bad', 'terrible')),
  text       text        not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

-- user_id + date の複合インデックス（日付降順での一覧取得を最適化）
create index if not exists journal_entries_user_id_date_idx
  on public.journal_entries (user_id, date desc);

-- Row Level Security を有効化
alter table public.journal_entries enable row level security;

-- 自分のエントリのみ参照可能
create policy "Users can view their own journal entries"
  on public.journal_entries
  for select
  using (auth.uid() = user_id);

-- 自分のエントリのみ作成可能
create policy "Users can insert their own journal entries"
  on public.journal_entries
  for insert
  with check (auth.uid() = user_id);

-- 自分のエントリのみ更新可能
create policy "Users can update their own journal entries"
  on public.journal_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分のエントリのみ削除可能
create policy "Users can delete their own journal entries"
  on public.journal_entries
  for delete
  using (auth.uid() = user_id);
