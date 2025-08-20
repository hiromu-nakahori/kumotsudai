"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "./utils";

/**
 * ScrollAreaコンポーネント
 *
 * Radix UIのScrollAreaPrimitive.Rootをラップしたカスタムスクロールエリアです。
 * 子要素をスクロール可能な領域として表示し、カスタムスタイルのスクロールバーを付与します。
 * フォーカスリングや角丸、トランジションなどアクセシビリティとUIの一貫性に配慮しています。
 *
 * @component
 * @param {Object} props - ScrollAreaPrimitive.Rootに渡すprops
 * @param {React.ReactNode} props.children - スクロール可能な領域内に表示する要素
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでposition:relativeが付与されます。
 * @returns {JSX.Element} スクロール可能なエリア
 *
 * @example
 * <ScrollArea className="h-64 w-64">
 *   <div>たくさんのコンテンツ...</div>
 * </ScrollArea>
 *
 * @note
 * - Radix UIのScrollAreaPrimitive.Viewportを利用し、アクセシビリティ対応のフォーカスリングを持ちます。
 * - スクロールバーはカスタムデザイン（太さ・角丸・色）で表示されます。
 * - 角部分にはScrollAreaPrimitive.Cornerが自動で追加されます。
 */
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * ScrollBarコンポーネント
 *
 * Radix UIのScrollAreaPrimitive.ScrollAreaScrollbarをラップしたカスタムスクロールバーです。
 * orientation（縦・横）に応じてスタイルが切り替わり、スクロール可能な領域の端に表示されます。
 * スクロール可能なThumb（つまみ）部分もカスタムデザインです。
 *
 * @component
 * @param {Object} props - ScrollAreaPrimitive.ScrollAreaScrollbarに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでflexレイアウトやタッチ操作不可などが付与されます。
 * @param {"vertical"|"horizontal"} [props.orientation="vertical"] - スクロールバーの向き。デフォルトは縦。
 * @returns {JSX.Element} スクロールバー要素
 *
 * @example
 * <ScrollBar orientation="horizontal" />
 *
 * @note
 * - orientationによって高さ・幅・ボーダー位置が自動で切り替わります。
 * - Thumb部分は角丸・色付きでカスタムデザインです。
 * - ScrollArea内で自動的に呼び出されるため、通常は直接使う必要はありません。
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
