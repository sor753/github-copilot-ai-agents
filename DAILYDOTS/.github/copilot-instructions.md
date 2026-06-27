# GitHub Copilot Instructions

## プロジェクト概要

**アプリ名:** デイリージャーナル（気分トラッカー付き）  
**技術スタック:** Vite + React + Supabase  
**言語:** TypeScript  

---

## 技術スタック詳細

| カテゴリ | 選択 |
|---|---|
| フレームワーク | Vite + React |
| 言語 | TypeScript |
| バックエンド | Supabase（認証・DB・Storage） |
| スタイリング | Plain CSS（CSS カスタムプロパティ活用） |
| サーバー状態管理 | TanStack Query（React Query v5） |
| クライアント状態管理 | React Context |
| ルーティング | React Router v6 |
| リンター | ESLint |
| フォーマッター | Prettier |
| テスト | Vitest |

---

## フォルダ構成

機能別（Feature-based）構成を採用する。

```
src/
├── features/
│   ├── journal/
│   │   ├── components/    # JournalCard, JournalEditor など
│   │   ├── hooks/         # useJournalEntries, useCreateEntry など
│   │   ├── types.ts       # Journal ドメイン型定義
│   │   └── api.ts         # Supabase クエリ関数
│   └── mood/
│       ├── components/    # MoodPicker, MoodChart など
│       ├── hooks/         # useMoodLog, useMoodStats など
│       ├── types.ts       # Mood ドメイン型定義
│       └── api.ts         # Supabase クエリ関数
├── shared/
│   ├── components/        # Button, Input など汎用 UI
│   ├── hooks/             # useAuth, useTheme など
│   ├── contexts/          # AuthContext, ThemeContext
│   ├── lib/
│   │   ├── supabase.ts    # Supabase クライアント初期化
│   │   └── queryClient.ts # TanStack Query クライアント設定
│   └── types/             # 共通型定義
├── pages/                 # ルートに対応するページコンポーネント
│   ├── HomePage.tsx
│   ├── JournalPage.tsx
│   └── LoginPage.tsx
├── App.tsx
└── main.tsx
```

---

## 設計原則

React の哲学に従い、関数型・宣言的なスタイルで記述する。

- **DRY（Don't Repeat Yourself）:** 同じロジックを複数箇所に書かない。共通処理はカスタムフックまたはユーティリティ関数に切り出す
- **KISS（Keep It Simple, Stupid）:** 過度な抽象化・汎用化をしない。現時点で必要な実装のみを書く

- **攻撃的プログラミング:** 前提条件が満たされない場合は早期にクラッシュさせる。不要な `?.` `?? ''` `if (!x) return` による防御的コードは書かない。ただし Supabase 等の外部 I/O のエラーハンドリングは除く

```typescript
// ✅ Good: 前提条件違反は早期クラッシュ（攻撃的）
const getEntry = (entries: JournalEntry[], id: string): JournalEntry => {
  const entry = entries.find(e => e.id === id);
  if (!entry) throw new Error(`Entry not found: ${id}`);
  return entry;
};

// ❌ Bad: 不要な防御（攻撃的プログラミング違反）
const getEntry = (entries?: JournalEntry[], id?: string): JournalEntry | undefined => {
  return entries?.find(e => e.id === id) ?? undefined;
};

// ✅ Good: 外部 I/O は防御する（攻撃的の例外）
const { data, error } = await supabase.from('journal_entries').select('*');
if (error) throw error;
```

```typescript
// ✅ Good: 共通ロジックをフックに切り出す（DRY）
const useSupabaseMutation = (mutationFn: () => Promise<void>) => { ... };

// ❌ Bad: 同じエラーハンドリングを各コンポーネントに書く（DRY 違反）

// ✅ Good: シンプルに書く（KISS）
const getMoodLabel = (mood: MoodLevel): string => moodLabels[mood];

// ❌ Bad: 将来の拡張を見越した過剰設計（KISS 違反）
const getMoodLabel = (mood: MoodLevel, options?: { locale?: string; fallback?: string; format?: 'short' | 'long' }): string => { ... };
```

---



### TypeScript

- `any` 型は使用禁止。不明な型は `unknown` を使用する
- Props の型定義は `interface` に限定する（`extends` による拡張を活用するため）
- それ以外の型定義（ユニオン型・ドメイン型・エイリアスなど）は `type` に限定する

```typescript
// ✅ Good
interface JournalCardProps extends BaseCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

type MoodLevel = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
type JournalEntry = {
  id: string;
  content: string;
  mood: MoodLevel;
  created_at: string;
};

// ❌ Bad
type JournalCardProps = { entry: JournalEntry; };  // Props に type は使わない
interface MoodLevel { ... }                         // ユニオン型に interface は使えない
```
- Supabase から返る型は `supabase-js` の型推論を活用し、独自定義と二重管理しない
- 型アサーション（`as`）は最小限にとどめる
- 型アサーションを使用する場合は、必ずアサーションして良い理由をコメントする

```typescript
// ✅ Good
// Supabase は認証済みセッションを保証しているため user は必ず存在する
const user = session.user as User;

// ❌ Bad: 理由なしのアサーション
const user = session.user as User;
```

```typescript
// ✅ Good
interface JournalEntry {
  id: string;
  content: string;
  mood: MoodLevel;
  created_at: string;
}

// ❌ Bad
const entry: any = await fetchEntry();
```

### React コンポーネント

- **関数コンポーネント + Hooks のみ**使用する。クラスコンポーネントは書かない
- コンポーネントのエクスポートは `export default` より **named export** を優先する
- Props の分割代入をコンポーネント引数で行う
- JSX の中にビジネスロジックを書かない。ロジックはカスタムフックに切り出す

```typescript
// ✅ Good
export const JournalCard = ({ entry, onDelete }: JournalCardProps) => {
  return <div>{entry.content}</div>;
};

// ✅ Good: pages/ 配下も同様（冗長でも一貫性を優先）
const HomePage = () => {
  return <div>...</div>;
};
export default HomePage;

// ❌ Bad: 関数宣言は使わない
export default function JournalCard(props: any) { ... }
```

### カスタムフック

- `use` プレフィックスを必ず付ける
- 1 フック 1 責務。複数の関心事を混在させない
- TanStack Query のフックをラップして機能別フックとして公開する

```typescript
// ✅ Good
export const useJournalEntries = () => {
  return useQuery({
    queryKey: ['journal', 'entries'],
    queryFn: fetchJournalEntries,
  });
};
```

### スタイリング（Plain CSS）

- グローバルな CSS カスタムプロパティ（変数）を `src/shared/styles/variables.css` で一元管理する
- クラス名は BEM 命名規則（`block__element--modifier`）を採用する
- コンポーネントごとに対応する CSS ファイルを同階層に置く（`JournalCard.tsx` → `JournalCard.css`）
- インラインスタイルは動的な値（アニメーション・テーマカラーの計算）のみに限定する

```css
/* ✅ Good */
.journal-card { ... }
.journal-card__title { ... }
.journal-card--highlighted { ... }
```

### Supabase

- Supabase クライアントは `src/shared/lib/supabase.ts` で初期化し、必ずそこからインポートする
- データ取得関数は各 `features/*/api.ts` に集約し、コンポーネントから直接 Supabase を呼ばない
- 認証状態は `AuthContext` で管理し、`useAuth` フック経由でアクセスする
- エラーハンドリングは `api.ts` 層で行い、エラーを上位に伝播させる

```typescript
// ✅ Good: features/journal/api.ts
export const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ❌ Bad: コンポーネント内で直接呼ぶ
const { data } = await supabase.from('journal_entries').select('*');
```

### TanStack Query

- `queryKey` は配列形式で、機能名 → リソース名 → パラメータの順で構造化する
- Mutation 後は `queryClient.invalidateQueries` で関連キャッシュを必ず無効化する
- ローディング・エラー状態はコンポーネント側で必ずハンドリングする

```typescript
// queryKey の命名規則
['journal', 'entries']           // 一覧
['journal', 'entry', entryId]    // 単一
['mood', 'log', { date }]        // パラメータ付き
```

### React Context

- Context は `src/shared/contexts/` に配置する
- Context と Provider と カスタムフックをセットで定義する
- 認証（`AuthContext`）・テーマ（`ThemeContext`）など、アプリ全体で共有する状態のみに使用する

```typescript
// ✅ Good: Context + Provider + Hook のセット
export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => { ... };
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
```

### React Router v6

- ルート定義は `App.tsx` に集約する
- 認証が必要なルートは `ProtectedRoute` コンポーネントでラップする
- ナビゲーションは `useNavigate` フックを使用し、`<a>` タグによる直接遷移は使わない

### テスト（Vitest）

- テストファイルは対象ファイルと同階層に `*.test.ts(x)` として配置する
- カスタムフックのテストには `@testing-library/react` の `renderHook` を使用する
- Supabase クライアントはモックする
- UI コンポーネントより、ロジックを持つフック・ユーティリティ関数を優先してテストする

---

## Copilot へのガイダンス

- 関数はすべてアロー関数で統一すること。`function` 宣言は提案しない（`pages/` 配下も含む）
- 新しいコンポーネントを生成する際は、必ず対応する TypeScript 型定義とセットで生成すること
- Supabase へのアクセスコードを提案する際は、必ず `api.ts` 層に配置すること
- `useEffect` を提案する前に、TanStack Query で代替できないか検討すること
- クラスコンポーネントは提案しない
- `any` 型は提案しない
- CSS ファイルを生成する際は BEM 命名規則に従うこと
- エラーハンドリングを省略しないこと