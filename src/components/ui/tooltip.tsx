"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

/**
 * TooltipProviderコンポーネント
 * Radix UIのTooltipPrimitive.Providerをラップし、ツールチップのコンテキストを提供します。
 * delayDurationでツールチップ表示までの遅延時間を指定できます。
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {number} [props.delayDuration=0] - ツールチップ表示までの遅延時間（ミリ秒）。デフォルトは0。
 * @returns {JSX.Element} ツールチップのProvider要素
 * @example
 * <TooltipProvider delayDuration={300}>...</TooltipProvider>
 * @note
 * 通常はTooltipコンポーネント内で自動的に使用されるため、直接使う必要はありません。
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

/**
 * Tooltipコンポーネント
 * ツールチップのルート要素。Radix UIのTooltipPrimitive.Rootをラップし、TooltipProviderで囲みます。
 * ツールチップの表示/非表示の状態管理を行います。
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @returns {JSX.Element} ツールチップのルート要素
 * @example
 * <Tooltip>
 *   <TooltipTrigger>ホバーしてね</TooltipTrigger>
 *   <TooltipContent>ツールチップの内容</TooltipContent>
 * </Tooltip>
 * @note
 * TooltipProviderで自動的に囲まれるため、Providerを個別に指定する必要はありません。
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

/**
 * TooltipTriggerコンポーネント
 * ツールチップの表示トリガーとなる要素。Radix UIのTooltipPrimitive.Triggerをラップしています。
 * ボタンやテキストなど、ツールチップを表示したい要素を子要素として受け取ります。
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - トリガーとして表示する要素（例: ボタン、テキストなど）
 * @returns {JSX.Element} ツールチップのトリガー要素
 * @example
 * <TooltipTrigger>ホバーしてね</TooltipTrigger>
 * @note
 * ツールチップの表示は、トリガー要素へのホバーやフォーカスで行われます。
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * TooltipContentコンポーネント
 * ツールチップの内容を表示する要素。Radix UIのTooltipPrimitive.Contentをラップしています。
 * アニメーションやスタイルが付与されており、TooltipPrimitive.Arrowで矢印も表示されます。
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - ツールチップ内に表示する内容
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトで背景色やアニメーションが付与されます。
 * @param {number} [props.sideOffset=0] - トリガーからのオフセット（ピクセル）。デフォルトは0。
 * @returns {JSX.Element} ツールチップの内容要素
 * @example
 * <TooltipContent sideOffset={8}>ツールチップの内容</TooltipContent>
 * @note
 * アニメーションや矢印（Arrow）が自動的に表示されます。カスタムスタイルもclassNameで追加可能です。
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
