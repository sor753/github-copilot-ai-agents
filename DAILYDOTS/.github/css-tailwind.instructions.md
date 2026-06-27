---
applyTo: "**/*.css,**/*.ts,**/*.tsx"
---

# Tailwind CSS スタイリング標準

---

## 基本方針

- スタイリングは Tailwind CSS のユーティリティクラスで行う
- 独自 CSS ファイルは原則作成しない。Tailwind で表現できる場合は CSS を書かない
- 任意値（`p-[13px]`）は禁止。スケール外の値が必要な場合は `tailwind.config` にトークンを追加する
- `style` 属性は動的な計算値（CSS 変数への代入・アニメーション値）のみに限定する

---

## クラスの記述順序

以下のカテゴリ順で記述する。Prettier の `prettier-plugin-tailwindcss` で自動整列を強制する。

1. **レイアウト** — `block` `flex` `grid` `hidden`
2. **フレックス・グリッド** — `flex-col` `items-center` `gap-4` `col-span-2`
3. **配置** — `relative` `absolute` `inset-0` `z-10`
4. **サイズ** — `w-full` `h-screen` `max-w-2xl` `min-h-[44px]`
5. **スペーシング** — `p-4` `px-6` `mt-2` `mx-auto`
6. **タイポグラフィ** — `text-sm` `font-bold` `leading-relaxed` `tracking-wide`
7. **カラー** — `text-gray-900` `bg-white` `border-gray-200`
8. **ボーダー** — `border` `rounded-md` `ring-2`
9. **エフェクト** — `shadow-md` `opacity-50`
10. **トランジション** — `transition-colors` `duration-200` `ease-in-out`
11. **状態バリアント** — `hover:` `focus:` `focus-visible:` `disabled:` `active:`
12. **レスポンシブ** — `sm:` `md:` `lg:` `xl:`
13. **ダークモード** — `dark:`

```tsx
{/* ✅ Good: カテゴリ順で記述 */}
<button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 sm:px-6">

{/* ❌ Bad: 順序がバラバラ */}
<button className="hover:bg-indigo-700 text-sm rounded-md flex bg-indigo-600 px-4 disabled:opacity-50 font-medium">
```

---

## レスポンシブデザイン

- モバイルファーストで記述する。基底クラスがモバイル、`sm:` 以上でデスクトップに拡張する
- ブレークポイントは Tailwind のデフォルト（`sm` `md` `lg` `xl` `2xl`）を使用する
- プロジェクト固有のブレークポイントが必要な場合は `tailwind.config` に定義する
- レスポンシブクラスは記述順序の末尾にまとめる

```tsx
{/* ✅ Good: モバイルファースト */}
<div className="flex flex-col gap-4 px-4 md:flex-row md:gap-8 md:px-8">

{/* ❌ Bad: デスクトップファースト */}
<div className="flex-row gap-8 px-8 sm:flex-col sm:gap-4 sm:px-4">
```

---

## アクセシビリティとフォーカス状態

- `outline-none` / `focus:outline-none` の単独使用は禁止。必ず `focus-visible:ring-*` とセットで使用する
- フォーカスリングは `focus-visible:` を使用する（マウス操作時に不要なリングを表示しない）
- インタラクティブ要素の最小タップ領域は `min-h-[44px] min-w-[44px]` を確保する
- `disabled` 状態には必ず `disabled:opacity-50 disabled:cursor-not-allowed` を付与する
- カラーのみで状態を伝えない。アイコン・テキスト・`aria-*` を併用する

```tsx
{/* ✅ Good */}
<button className="rounded-md bg-indigo-600 px-4 py-2 text-white
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50">

{/* ❌ Bad: フォーカスリングを消しているだけ */}
<button className="outline-none focus:outline-none">
```

---

## バリアント管理

- バリアントの出し分けは `cva`（class-variance-authority）で管理する
- 条件付きクラスの結合は `cn()`（`clsx` + `tailwind-merge`）を使用する
- 三項演算子によるクラスの直接結合は禁止

```tsx
// ✅ Good: cva でバリアントを定義
const buttonVariants = cva(
  'inline-flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
        danger:  'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        ghost:   'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
      },
      size: {
        sm: 'px-3 py-1.5',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

// ✅ Good: cn() で条件付きクラスを結合
<div className={cn('rounded-md p-4', isActive && 'ring-2 ring-indigo-500', className)}>

// ❌ Bad: 三項演算子で直接結合
<div className={`rounded-md p-4 ${isActive ? 'ring-2 ring-indigo-500' : ''}`}>
```

---

## カスタム CSS を使用する場合のルール

Tailwind で表現できない場合のみ、以下のルールに従ってカスタム CSS を記述する。

- カスタム CSS は `src/shared/styles/` に集約する
- Tailwind の `@layer` ディレクティブを使用し、スコープを明示する
- CSS カスタムプロパティはすべて `tailwind.config` の `theme.extend` に登録し、Tailwind クラスとして使用する
- `!important` は禁止

```css
/* ✅ Good: @layer で Tailwind のカスケードに統合 */
@layer components {
  .journal-editor {
    /* Tailwind で表現できない複雑なセレクタのみ */
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { @apply bg-gray-300 rounded-full; }
  }
}

/* ❌ Bad: グローバルスコープに直接記述 */
.button {
  background-color: #4f46e5 !important;
}
```

---

## tailwind.config の管理

- プロジェクト固有のトークンはすべて `tailwind.config` の `theme.extend` に定義する
- `theme` を直接上書きしない（デフォルトスケールを破壊しない）
- セマンティックなカラートークン名を使用する（`primary`・`danger`・`success` など）

```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        accent:  { DEFAULT: '#4f46e5', hover: '#4338ca' },
        danger:  { DEFAULT: '#dc2626', hover: '#b91c1c' },
        success: { DEFAULT: '#16a34a', hover: '#15803d' },
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
};
```