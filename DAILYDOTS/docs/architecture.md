# アーキテクチャ

DailyDots は、機能別（feature-based）構成を採用したフロントエンドアプリです。
ルーティングと画面層、機能層、共通層を分離し、データアクセスの責務を段階的に切り分けています。

## フォルダ構成と責務

### src/pages

- ルート単位の画面コンポーネントを配置します
- 画面の構成と遷移を担当し、データ取得はフック層に委譲します

### src/features/journal

- `components/`: ジャーナル機能専用の UI 部品
- `hooks/`: TanStack Query を使ったデータ取得・更新フック
- `api.ts`: フックから呼び出される API 関数
- `services/`: 永続化の実体（現在は localStorage リポジトリ）
- `types.ts`: ジャーナル機能のドメイン型

### src/shared

- `components/`: 画面横断で利用するレイアウトなどの共通 UI
- `lib/`: QueryClient などの初期化処理

## レイヤー構造

1. UI レイヤー（pages / feature components）
2. データアクセスフック層（features/*/hooks）
3. API 関数層（features/*/api.ts）
4. リポジトリ層（features/*/services）
5. ストレージ層（localStorage）

この分離により、UI と永続化実装を疎結合に保てます。

## データフロー

1. 画面コンポーネントが `useJournalEntries` などのフックを呼び出す
2. フックが `api.ts` の関数（`fetchJournalEntries` など）を実行する
3. API 関数が `getJournalRepository()` を通じてリポジトリを取得する
4. リポジトリが localStorage の読み書きを行う
5. Mutation 成功時に Query キャッシュを invalidate / 更新して UI を再描画する

## ルーティング

`src/App.tsx` で以下のルートを定義しています。

- `/`: ホーム
- `/journal`: ジャーナル一覧
- `/journal/new`: 新規作成
- `/journal/:date`: 詳細
- `/journal/:date/edit`: 編集
- `/404`: Not Found

## 設計上のポイント

- 日付単位の upsert を採用し、同日エントリの重複を防止
- TanStack Query の queryKey を機能別に構造化
- 永続化アクセスを services 層へ集約し、将来の Supabase 移行を容易化
