# データベース / 永続化

## 現在の永続化方式

現時点の DailyDots は、ブラウザの localStorage を永続化先として使用しています。

- 実装: `src/features/journal/services/journal-storage.ts`
- ストレージキー: `dailydots:journal-entries:v1`

## 保存データ構造

localStorage には、以下のエントリ配列を JSON 形式で保存します。

- `date`: 日付（YYYY-MM-DD）
- `mood`: 気分（`great` / `good` / `neutral` / `bad` / `terrible`）
- `text`: 本文
- `updatedAt`: 更新日時（ISO 8601）

## リポジトリ責務

`LocalStorageJournalRepository` は以下の操作を提供します。

- `list()`: 全件取得（日付降順）
- `getByDate(date)`: 日付で1件取得
- `upsert(input)`: 同日付は更新、なければ作成
- `removeByDate(date)`: 日付で削除
- `getSummary()`: サマリー算出（総数、直近7日、連続記録、最新気分）

## バリデーション

読み込み時に payload を検証し、不正データの場合はエラーを送出します。

- JSON パース失敗時: 例外
- 配列構造・要素型の不整合時: 例外

## テスト

リポジトリ層の主要挙動は以下で検証されています。

- `src/features/journal/services/journal-storage.test.ts`
- 検証内容: upsert、日付降順ソート、削除

## Supabase 移行メモ

現在、`supabase/` ディレクトリおよびマイグレーションは未配置です。
このため、以下は移行時に作成する想定です。

1. `journal_entries` テーブル定義
2. 必要なインデックス（例: `date`）
3. RLS ポリシー
4. マイグレーション手順のドキュメント化

## 想定テーブル（移行時の案）

| カラム名 | 型 | 説明 |
|---|---|---|
| id | uuid | 主キー |
| date | date | 記録日 |
| mood | text | 気分 |
| text | text | 本文 |
| updated_at | timestamptz | 更新日時 |
| user_id | uuid | 所有ユーザー |

上記は現時点では設計案であり、実際の運用定義は Supabase 導入時に確定します。
