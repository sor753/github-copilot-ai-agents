# DailyDots

Vite + React + Tailwind CSS で構築したデイリージャーナルアプリです。  
1日につき1件のエントリを保存し、作成・編集・閲覧・削除できます。

## 主要機能

- ホーム: サマリー表示 + 今日のクイック追加
- マイジャーナル: 一覧 + 開く/編集/削除
- 新規/更新: 日付指定で作成または更新（同日がある場合は上書き）
- データ保存: localStorage（サービス層経由）

## 技術スタック

- Vite
- React + TypeScript
- React Router v6
- TanStack Query
- Tailwind CSS
- Vitest

## セットアップ（Docker）

```bash
docker compose up --build
```

別ターミナルでコンテナに入って操作:

```bash
docker compose exec app sh
npm install
npm run dev
```

## 検証コマンド

```bash
npm run lint
npm run typecheck
npm run test
```

## Supabase への切り替え方

データアクセスはサービス層で抽象化しています。  
以下を差し替えるだけで移行可能です。

- `src/features/journal/services/journal-storage.ts`
- `src/features/journal/api.ts`

UI 層は TanStack Query フック経由で呼び出しているため、画面側の変更は最小で済みます。
