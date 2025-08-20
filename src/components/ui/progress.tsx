"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

/**
 * Progressコンポーネント
 *
 * プログレスバー（進捗バー）を表示するためのコンポーネントです。Radix UIのProgressPrimitive.RootとProgressPrimitive.Indicatorをラップしています。
 * 進捗値（value）に応じてバーの長さが変化し、アニメーション付きで表示されます。デフォルトで丸み・色・高さなどのスタイルが付与されています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（Radix UIのProgressPrimitive.Rootのpropsを継承）
 * @param {number} [props.value] - 進捗バーの値（0〜100）。未指定の場合は0として扱われます。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトのスタイルに加えてカスタマイズ可能です。
 * @returns {JSX.Element} プログレスバー要素
 *
 * @example
 * <Progress value={60} />
 *
 * @note
 * - アクセシビリティ: Radix UIのProgressPrimitiveを利用しているため、スクリーンリーダー対応などアクセシビリティに配慮されています。
 * - valueが未指定の場合は0%として表示されます。
 * - スタイルはTailwind CSSのユーティリティクラスで定義されています。必要に応じてclassNameで拡張可能です。
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
