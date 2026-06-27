# DailyDots

DailyDots は、日々の出来事と気分を記録するデイリージャーナルアプリです。  
1日1件の記録を基準に、作成・更新・閲覧・削除をシンプルに行えます。

## 機能

- ホーム画面でサマリー確認（総エントリ数、直近7日、連続記録、最新の気分）
- 今日のクイック追加（当日分の作成/更新）
- マイジャーナルで一覧表示、詳細表示、編集、削除
- 日付単位の upsert（同一日付は新規作成ではなく更新）
- localStorage を使った永続化（サービス層経由）

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Vite + React 19 |
| 言語 | TypeScript |
| ルーティング | React Router v6 |
| サーバー状態管理 | TanStack Query v5 |
| スタイリング | Tailwind CSS |
| テスト | Vitest |
| リント | ESLint |
| 実行環境 | Docker / Docker Compose |

## 開発環境のセットアップ

### 前提条件

- Docker

### 手順

1. リポジトリをクローン
2. 必要に応じて環境変数ファイルを用意（現状 `.env.example` は未配置）
3. コンテナをビルドして起動

```bash
docker compose up --build
```

4. 別ターミナルでコンテナに入り、依存関係をインストール

```bash
docker compose exec app sh
npm install
```

5. 開発サーバーを起動

```bash
npm run dev
```

## コマンド

```bash
docker compose exec app sh
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test
```

## 環境変数

現時点で、リポジトリに `.env.example` はありません。  
そのため必須環境変数は未定義です。

| 変数名 | 説明 | 必須 |
|---|---|---|
| - | 現在は未定義 | - |

## ディレクトリ構成

```text
.
├── src/
│   ├── features/
│   │   └── journal/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── api.ts
│   │       └── types.ts
│   ├── pages/
│   ├── shared/
│   │   ├── components/
│   │   └── lib/
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   ├── architecture.md
│   ├── database.md
│   └── features.md
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## ドキュメント

- アーキテクチャ: `docs/architecture.md`
- データ構成: `docs/database.md`
- 機能仕様: `docs/features.md`

## ライセンス

ライセンスは未設定です。必要に応じて `LICENSE` を追加してください。
