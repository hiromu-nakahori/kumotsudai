import * as React from "react";

import { cn } from "./utils";

/**
 * Input コンポーネント
 *
 * React の標準 <input> 要素をラップし、スタイリングやアクセシビリティ、拡張性を高めたカスタムコンポーネントです。
 * Tailwind CSS を用いた一貫したデザイン、バリデーション・無効化・ファイル入力など多様な状態に対応しています。
 * また、forwardRef により親から ref を渡して DOM の input 要素へ直接アクセスできます。
 *
 * @example
 * <Input type="text" placeholder="名前を入力" aria-invalid={hasError} />
 *
 * @param {Object} props - <input> 要素が受け取る全てのプロパティ
 * @param {string} [props.className] - 追加のクラス名
 * @param {string} [props.type] - input の type 属性
 * @param {React.Ref<HTMLInputElement>} ref - input 要素への参照
 * @returns {JSX.Element} スタイリング済みの <input> 要素
 *
 * @see https://react.dev/reference/react/forwardRef
 * @see https://tailwindcss.com/
 *
 * @remarks
 * - `cn` 関数はクラス名を結合するユーティリティです。
 * - `data-slot="input"` 属性はテストやスタイリングのためのカスタム属性です。
 * - `aria-invalid` 属性が true の場合、エラー用のスタイルが適用されます。
 * - `disabled` 属性が true の場合、無効化スタイルが適用されます。
 * - `type="file"` の場合、ファイル入力用のスタイルが適用されます。
 *
 * @component
 */

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };