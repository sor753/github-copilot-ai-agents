---
applyTo: "**/*.tsx,**/*.ts,**/*.css"
---

# UI/UX デザイン標準

このプロジェクトの UI/UX 原則。明確さ・シンプルさ・使いやすさを最優先とする。

---

## レイアウトの一貫性

- レイアウトは Tailwind のスペーシング・サイズスケールに従う
- マジックナンバーによる任意値（`w-[743px]` など）は禁止。`tailwind.config` のトークンを使用する
- コンテンツの最大幅は `max-w-*` で統一する（例: `max-w-2xl`）
- レスポンシブはモバイルファーストで記述する（`sm:` `md:` `lg:` の順）

```tsx
{/* ✅ Good */}
<div className="mx-auto max-w-2xl px-4">

{/* ❌ Bad */}
<div style={{ maxWidth: '743px', padding: '13px' }}>
```

---

## スペーシングシステム

- スペーシングは Tailwind のデフォルトスケール（4px 基準）に従う
- プロジェクト固有のスペーシングトークンは `tailwind.config` の `theme.extend.spacing` で定義する
- 任意値（`p-[13px]`）は禁止。スケール外の値が必要な場合はトークンを追加する

```tsx
{/* ✅ Good */}
<div className="p-4 mt-6 gap-3">

{/* ❌ Bad */}
<div className="p-[13px] mt-[22px]">
```

---

## タイポグラフィ階層

- フォントサイズ・ウェイト・行間は Tailwind のタイポグラフィスケールを使用する
- 見出し階層（h1〜h4）は明確に区別する。階層を飛ばさない
- 本文の行間は `leading-relaxed`（1.625）以上を確保し、可読性を優先する
- 装飾目的のフォントサイズ変更は禁止。意味のある階層のみ使用する
- プロジェクト固有のフォント設定は `tailwind.config` の `theme.extend.fontFamily` で管理する

```tsx
{/* ✅ Good */}
<h1 className="text-3xl font-bold leading-tight">
<p className="text-base leading-relaxed text-gray-700">

{/* ❌ Bad */}
<p style={{ fontSize: '17px', lineHeight: '1.4' }}>
```

---

## カラー使用

- カラーは Tailwind のカラースケールまたは `tailwind.config` のセマンティックトークンを使用する
- 生の色値（`text-[#3b82f6]`）を直接使用することは禁止
- ダークモード対応は `dark:` バリアントで記述する
- インタラクティブ要素には必ず `hover:` `focus:` `disabled:` の状態クラスを定義する

```tsx
{/* ✅ Good */}
<button className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">

{/* ❌ Bad */}
<button style={{ backgroundColor: '#4f46e5' }}>
<button className="bg-[#4f46e5]">
```

`tailwind.config` でのセマンティックトークン定義例：

```js
theme: {
  extend: {
    colors: {
      accent: { DEFAULT: '#4f46e5', hover: '#4338ca' },
      danger: '#dc2626',
      success: '#16a34a',
    },
  },
},
```

---

## アクセシビリティ

- カラーコントラスト比は WCAG AA 基準（本文 4.5:1 以上・大文字 3:1 以上）を満たす
- すべてのインタラクティブ要素はキーボード操作可能にする
- フォーカスリングを `outline-none` で消すことは禁止。`focus-visible:ring-*` でカスタムスタイルを定義する
- `img` には必ず `alt` を付与する。装飾画像は `alt=""` とする
- フォーム要素には必ず `label` を関連付ける（`htmlFor` / `aria-label`）
- 状態変化（ローディング・エラー・成功）は視覚だけでなく `aria-live` でも伝える

```tsx
{/* ✅ Good */}
<button
  aria-label="エントリを削除"
  className="rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
  onClick={onDelete}
>
  <TrashIcon />
</button>

{/* ❌ Bad */}
<div onClick={onDelete}>×</div>
<button className="outline-none">...</button>
```

---

## コンポーネントの一貫性

- 同じ UI パターンには同じコンポーネントを使う。類似の実装を複数持たない
- バリアントは `cva`（class-variance-authority）で管理し、props で制御する
- インタラクティブ要素のサイズは最小タップ領域 44×44px（`min-h-[44px] min-w-[44px]`）を確保する
- ローディング・空・エラー状態を必ず実装する。未定義のまま放置しない

```tsx
// ✅ Good: cva でバリアントを管理
const buttonVariants = cva(
  'rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        danger:  'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'px-3 py-1.5',
        md: 'px-4 py-2',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export const Button = ({ variant, size, children }: ButtonProps) => (
  <button className={buttonVariants({ variant, size })}>{children}</button>
);

{/* ❌ Bad: 目的別に別コンポーネント */}
<SaveButton />
<DeleteButton />
```