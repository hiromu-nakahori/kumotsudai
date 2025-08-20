"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Toggleコンポーネント
 *
 * Radix UIのTogglePrimitive.Rootをラップしたトグルボタンです。オン・オフの状態を切り替えるUI要素として利用できます。
 * variant（バリアント）やsize（サイズ）を指定して、見た目をカスタマイズできます。アイコンやテキストを子要素として配置可能です。
 * アクセシビリティやフォーカスリング、ホバー・無効化時のスタイルなどにも配慮されています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでラウンド・ホバー・フォーカス・無効化時のスタイルが付与されます。
 * @param {"default" | "outline"} [props.variant] - トグルのバリアント（見た目）。"default"は背景なし、"outline"は枠線付き。
 * @param {"default" | "sm" | "lg"} [props.size] - トグルのサイズ。"default"（標準）、"sm"（小）、"lg"（大）。
 * @param {boolean} [props.disabled] - トグルを無効化する場合に指定。操作不可となり、スタイルも変更されます。
 * @param {boolean} [props["aria-invalid"]] - 入力値が不正な場合に指定。リング色が変化します。
 * @param {React.ReactNode} [props.children] - トグル内に表示するアイコンやテキスト。
 * @returns {JSX.Element} トグルボタン要素
 *
 * @example
 * <Toggle variant="outline" size="sm">Bold</Toggle>
 *
 * @note
 * - Radix UIのTogglePrimitive.Rootを拡張しているため、onPressedChangeなどのイベントも利用可能です。
 * - data-state=on でアクティブ状態のスタイルが適用されます。
 * - SVGアイコンは自動でサイズ調整されます。
 * - アクセシビリティ: キーボード操作やフォーカスリングに対応しています。
 */
function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
