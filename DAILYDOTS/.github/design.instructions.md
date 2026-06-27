---
applyTo: "**/*.tsx,**/*.ts,**/*.css"
---

# UI/UX デザイン標準

このプロジェクトの UI/UX 原則。明確さ・シンプルさ・使いやすさを最優先とする。

---

## レイアウトの一貫性

- レイアウトは CSS カスタムプロパティで定義したグリッド・幅の値を使用する
- マジックナンバーによるサイズ指定は禁止。必ずデザイントークンを参照する
- コンテンツの最大幅は統一する（例: `--layout-max-width: 768px`）
- レスポンシブはモバイルファーストで記述する

```css
/* ✅ Good */
max-width: var(--layout-max-width);

/* ❌ Bad */
max-width: 743px;
```

---

## スペーシングシステム

- スペーシングは 4px ベースのスケールに従う
- 使用できる値: `4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px`
- CSS カスタムプロパティで定義し、直接の `px` 値は使用しない

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}

/* ✅ Good */
padding: var(--space-4);

/* ❌ Bad */
padding: 15px;
```

---

## タイポグラフィ階層

- フォントサイズ・ウェイト・行間はデザイントークンで管理する
- 見出し階層（h1〜h4）は明確に区別する。階層を飛ばさない
- 本文の行間は `1.6` 以上を確保し、可読性を優先する
- 装飾目的のフォントサイズ変更は禁止。意味のある階層のみ使用する

```css
:root {
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-md: 1rem;      /* 16px: 本文基準 */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.25rem;   /* 20px */
  --text-2xl: 1.5rem;   /* 24px */
  --text-3xl: 1.875rem; /* 30px */

  --font-normal: 400;
  --font-medium: 500;
  --font-bold: 700;

  --leading-body: 1.6;
  --leading-heading: 1.2;
}
```

---

## カラー使用

- カラーはセマンティックトークンで管理する（用途を名前に反映する）
- 生の色値（`#3b82f6` など）を直接使用することは禁止
- ライト・ダークモード対応を前提に、`prefers-color-scheme` でトークンを切り替える
- インタラクティブ要素には必ずホバー・フォーカス・無効状態のカラーを定義する

```css
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text-primary: #111111;
  --color-text-secondary: #555555;
  --color-accent: #4f46e5;
  --color-accent-hover: #4338ca;
  --color-danger: #dc2626;
  --color-success: #16a34a;
  --color-border: #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #111111;
    --color-text-primary: #f5f5f5;
    /* ... */
  }
}
```

---

## アクセシビリティ

- カラーコントラスト比は WCAG AA 基準（本文 4.5:1 以上・大文字 3:1 以上）を満たす
- すべてのインタラクティブ要素はキーボード操作可能にする
- フォーカスリングを `outline: none` で消すことは禁止。カスタムスタイルで代替する
- `img` には必ず `alt` を付与する。装飾画像は `alt=""` とする
- フォーム要素には必ず `label` を関連付ける（`htmlFor` / `aria-label`）
- 状態変化（ローディング・エラー・成功）は視覚だけでなく `aria-live` でも伝える

```tsx
// ✅ Good
<button aria-label="エントリを削除" onClick={onDelete}>
  <TrashIcon />
</button>

// ❌ Bad
<div onClick={onDelete}>×</div>
```

---

## コンポーネントの一貫性

- 同じ UI パターンには同じコンポーネントを使う。類似の実装を複数持たない
- バリアントは props で制御する。目的別に別コンポーネントを作らない
- インタラクティブ要素のサイズは最小タップ領域 44×44px を確保する
- ローディング・空・エラー状態を必ず実装する。未定義のまま放置しない

```tsx
// ✅ Good: バリアントを props で制御
<Button variant="primary" size="md">保存</Button>
<Button variant="danger" size="sm">削除</Button>

// ❌ Bad: 目的別に別コンポーネント
<SaveButton />
<DeleteButton />
```