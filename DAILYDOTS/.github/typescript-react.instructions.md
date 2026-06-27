---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript / React 標準

`.ts` および `.tsx` ファイル全体に適用される標準。

---

## TypeScript

### 基本方針

- `strict` モードを前提とする。型の緩和は一切行わない
- `any` 型は禁止。不明な型は `unknown` を使用し、型ガードで絞り込む
- 型推論が明確な場合は型注釈を省略してよい。ただし関数の戻り値は必ず明示する
- `!`（Non-null assertion）は禁止。型ガードまたは早期リターンで代替する

### 型定義

- Props の型定義は `interface` に限定する（`extends` による拡張のため）
- それ以外の型定義（ユニオン型・ドメイン型・エイリアス）は `type` に限定する
- 判別ユニオンを活用し、網羅性チェックを `never` で担保する

```typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

const handle = (result: Result<string>) => {
  switch (result.status) {
    case 'success': return result.data;
    case 'error': return result.message;
    default: {
      const _exhaustive: never = result; // 網羅性チェック
      throw new Error(`Unhandled: ${_exhaustive}`);
    }
  }
};
```

### 不変性

- 配列・オブジェクトの直接変更は禁止。スプレッド構文またはイミュータブルな操作を使用する
- ネストが深いオブジェクトのコピーには `structuredClone` を使用する。シャローな更新はスプレッド構文で十分
- 関数・クラスインスタンスを含むオブジェクトには `structuredClone` を使用しない
- `const` を基本とする。`let` は再代入が必要な場合のみ使用する。`var` は禁止

```typescript
// ✅ Good: シャローな更新はスプレッド構文
const next = [...entries, newEntry];
const updated = { ...entry, content: 'updated' };

// ✅ Good: ネストが深い場合は structuredClone
const snapshot = structuredClone(complexNestedState);

// ❌ Bad
entries.push(newEntry);
```

### 型アサーション

- `as` は最小限にとどめる
- 使用する場合は、安全である理由を必ずコメントする

```typescript
// ✅ Good
// onAuthStateChange は認証済み状態でのみ呼ばれるため session は必ず存在する
const session = rawSession as Session;

// ❌ Bad
const session = rawSession as Session;
```

---

## React

### コンポーネント

- 関数コンポーネント + Hooks のみ使用する。クラスコンポーネントは禁止
- すべての関数はアロー関数で記述する（`pages/` 配下も含む）
- コンポーネントは UI の宣言のみを担う。ロジックはカスタムフックに切り出す
- 1コンポーネントの JSX は150行を目安に分割を検討する
- named export を優先する。`export default` が必要な場合も宣言と分けて記述する

```typescript
// ✅ Good
export const JournalCard = ({ entry, onDelete }: JournalCardProps) => {
  const { handleDelete } = useJournalCard(entry.id, onDelete);
  return <div onClick={handleDelete}>{entry.content}</div>;
};

// ✅ Good: export default が必要な場合
const HomePage = () => <div>...</div>;
export default HomePage;
```

### Props

- Props の型は `interface` で定義し、コンポーネントと同一ファイルに置く
- 引数で分割代入する
- オプショナルな Props は最小限にとどめる。デフォルト値を必ず設定する

```typescript
interface JournalCardProps extends BaseCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
  isHighlighted?: boolean; // オプショナルはデフォルト値とセットで
}

export const JournalCard = ({
  entry,
  onDelete,
  isHighlighted = false,
}: JournalCardProps) => { ... };
```

### フック

- `use` プレフィックスを必ず付ける
- 1フック1責務。複数の関心事を混在させない
- `useEffect` を書く前に TanStack Query で代替できないか検討する
- 依存配列の省略・虚偽の記載は禁止

```typescript
// ✅ Good
export const useJournalEntries = () =>
  useQuery({
    queryKey: ['journal', 'entries'],
    queryFn: fetchJournalEntries,
  });
```

---

## 状態管理

- **サーバー状態:** TanStack Query で管理する。`useEffect` + `useState` による手動フェッチは禁止
- **グローバル状態:** React Context に限定する。認証・テーマなどアプリ全体で共有する値のみ対象
- **ローカル状態:** `useState` / `useReducer` を使用する
- Mutation 後は `queryClient.invalidateQueries` で関連キャッシュを必ず無効化する

---

## エラーハンドリング

- 攻撃的プログラミングを採用する。前提条件違反は即座にクラッシュさせる
- 外部 I/O（Supabase・API）のエラーは `api.ts` 層で必ず処理し、上位に伝播させる
- コンポーネント境界には `ErrorBoundary` を設置し、ランタイムエラーを捕捉する
- ローディング・エラー状態はコンポーネント側で必ずハンドリングする

```typescript
// ✅ Good
export const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*');
  if (error) throw new Error(`journal_entries の取得に失敗: ${error.message}`);
  return data;
};
```

---

## インポート順序

以下の順序でグループ化し、グループ間は空行で区切る:

1. React および外部ライブラリ
2. 内部共有モジュール（`shared/`）
3. 機能ローカルモジュール・型定義

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/shared/lib/supabase';

import { fetchJournalEntries } from '../api';
import type { JournalEntry } from '../types';
```