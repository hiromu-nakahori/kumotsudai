import * as React from "react";

import { cn } from "./utils";

/**
 * Textareaコンポーネント
 *
 * ユーザーが複数行のテキストを入力できるフォーム用のtextarea要素をラップしたコンポーネントです。
 * デフォルトで美しいスタイル（枠線、背景、角丸、フォーカスリング、プレースホルダー色、無効化時のスタイルなど）が適用されます。
 * クラス名の追加や、標準のtextarea属性（value, onChange, placeholder, disabledなど）をそのまま渡すことができます。
 * aria-invalid属性に対応し、バリデーションエラー時のスタイルも自動で切り替わります。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（textareaの標準属性を全て受け付けます）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトスタイルに加えて任意のクラスを付与できます。
 * @returns {JSX.Element} テキストエリア要素
 *
 * @example
 * <Textarea placeholder="ご意見を入力してください" aria-invalid={hasError} />
 *
 * @note
 * - アクセシビリティ: aria-invalid属性に対応し、バリデーションエラー時のスタイルが自動で切り替わります。
 * - 無効化（disabled）時は操作不可となり、スタイルも変更されます。
 * - resizeは無効化（resize-none）されており、サイズ調整は外部から制御してください。
 * - field-sizing-contentにより、内容に応じて高さが調整されます（min-h-16）。
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
