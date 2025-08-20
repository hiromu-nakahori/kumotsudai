"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "./utils";

/**
 * HoverCardコンポーネント
 *
 * Radix UIのHoverCardPrimitive.Rootをラップしたコンポーネントです。
 * ホバーカードのルート要素として機能し、子要素にトリガーやコンテンツを含めて使用します。
 * data-slot="hover-card"属性が付与され、スタイリングやテストに利用できます。
 *
 * @component
 * @param {Object} props - HoverCardPrimitive.Rootに渡すprops
 * @returns {JSX.Element} ホバーカードのルート要素
 *
 * @example
 * <HoverCard>
 *   <HoverCardTrigger>ホバーしてね</HoverCardTrigger>
 *   <HoverCardContent>詳細情報</HoverCardContent>
 * </HoverCard>
 *
 * @note
 * - Radix UIのHoverCardの状態管理やイベント処理をそのまま利用できます。
 * - data-slot属性で要素の識別が容易です。
 */
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

/**
 * HoverCardTriggerコンポーネント
 *
 * ホバーカードの表示トリガーとなる要素です。Radix UIのHoverCardPrimitive.Triggerをラップしています。
 * ボタンやテキストなど、ホバー時にカードを表示したい要素を子要素として受け取ります。
 * data-slot="hover-card-trigger"属性が付与されます。
 *
 * @component
 * @param {Object} props - HoverCardPrimitive.Triggerに渡すprops
 * @param {React.ReactNode} props.children - トリガーとして表示する要素
 * @returns {JSX.Element} ホバーカードのトリガー要素
 *
 * @example
 * <HoverCardTrigger>ユーザー名</HoverCardTrigger>
 *
 * @note
 * - ボタンやリンク、任意の要素をトリガーとして利用可能です。
 * - data-slot属性で要素の識別が容易です。
 */
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

/**
 * HoverCardContentコンポーネント
 *
 * ホバーカードの表示内容を定義するコンポーネントです。Radix UIのHoverCardPrimitive.Contentをラップしています。
 * ポータル内に表示され、アニメーションやスタイルが適用されています。
 * alignやsideOffsetで位置調整が可能です。classNameで追加スタイルも指定できます。
 * data-slot="hover-card-content"属性が付与されます。
 *
 * @component
 * @param {Object} props - HoverCardPrimitive.Contentに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @param {"start"|"center"|"end"} [props.align="center"] - カードの位置揃え
 * @param {number} [props.sideOffset=4] - トリガーからの距離（px）
 * @param {React.ReactNode} props.children - カード内に表示する内容
 * @returns {JSX.Element} ホバーカードの内容要素
 *
 * @example
 * <HoverCardContent>
 *   <div>ユーザー詳細</div>
 * </HoverCardContent>
 *
 * @note
 * - ポータル内に描画されるため、レイヤー管理が容易です。
 * - アニメーションやスタイルはTailwind CSSとRadixのstate属性で制御されています。
 * - data-slot属性で要素の識別が容易です。
 */
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
