"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "./utils";

/**
 * Popoverコンポーネント
 *
 * Radix UIのPopoverPrimitive.Rootをラップしたポップオーバーのルートコンポーネントです。
 * ポップオーバーの表示・非表示の状態管理を行います。
 *
 * @component
 * @param {Object} props - PopoverPrimitive.Rootに渡すprops
 * @returns {JSX.Element} ポップオーバーのルート要素
 *
 * @example
 * <Popover>
 *   <PopoverTrigger>開く</PopoverTrigger>
 *   <PopoverContent>内容</PopoverContent>
 * </Popover>
 *
 * @note
 * - ポップオーバーの状態管理（開閉）を担当します。
 * - 他のPopoverTriggerやPopoverContentと組み合わせて使用します。
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * Popoverコンポーネント
 *
 * Radix UIのPopoverPrimitive.Rootをラップしたポップオーバーのルートコンポーネントです。
 * ポップオーバーの表示・非表示の状態管理を行います。
 *
 * @component
 * @param {Object} props - PopoverPrimitive.Rootに渡すprops
 * @returns {JSX.Element} ポップオーバーのルート要素
 *
 * @example
 * <Popover>
 *   <PopoverTrigger>開く</PopoverTrigger>
 *   <PopoverContent>内容</PopoverContent>
 * </Popover>
 *
 * @note
 * - ポップオーバーの状態管理（開閉）を担当します。
 * - 他のPopoverTriggerやPopoverContentと組み合わせて使用します。
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/**
 * PopoverContentコンポーネント
 *
 * ポップオーバー内に表示するコンテンツ領域を表します。Radix UIのPopoverPrimitive.Contentをラップしています。
 * アニメーションやスタイルが付与されており、位置やオフセットの調整が可能です。
 *
 * @component
 * @param {Object} props - PopoverPrimitive.Contentに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @param {"start"|"center"|"end"} [props.align="center"] - ポップオーバーの水平方向の配置
 * @param {number} [props.sideOffset=4] - ポップオーバーのトリガーからの距離（px）
 * @returns {JSX.Element} ポップオーバーのコンテンツ要素
 *
 * @example
 * <PopoverContent>ここに内容</PopoverContent>
 *
 * @note
 * - アニメーションや影、角丸などのスタイルがデフォルトで付与されています。
 * - alignやsideOffsetで位置調整が可能です。
 * - PopoverPrimitive.Portal内で描画されます。
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/**
 * PopoverAnchorコンポーネント
 *
 * ポップオーバーの位置決めの基準となるアンカー要素を表します。Radix UIのPopoverPrimitive.Anchorをラップしています。
 * トリガー以外の要素を基準にポップオーバーを表示したい場合に利用します。
 *
 * @component
 * @param {Object} props - PopoverPrimitive.Anchorに渡すprops
 * @param {React.ReactNode} props.children - アンカーとして利用する要素
 * @returns {JSX.Element} ポップオーバーのアンカー要素
 *
 * @example
 * <PopoverAnchor><span>ここを基準</span></PopoverAnchor>
 *
 * @note
 * - トリガー以外の要素を基準にポップオーバーを表示したい場合に使用します。
 * - 通常はPopoverTriggerを使いますが、より柔軟な位置決めが必要な場合に便利です。
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
