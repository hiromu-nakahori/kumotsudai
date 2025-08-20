"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "./utils";

/**
 * Separatorコンポーネント
 *
 * 水平方向または垂直方向の区切り線（セパレーター）を表示するコンポーネントです。  
 * Radix UIのSeparatorPrimitive.Rootをラップしており、アクセシビリティや柔軟なスタイリングに対応しています。
 * orientationプロパティで水平（horizontal）・垂直（vertical）の切り替えが可能です。
 * decorativeプロパティで装飾目的かどうかを指定できます（trueの場合、スクリーンリーダーに無視されます）。
 * classNameで追加のCSSクラスを指定できます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでborder色・サイズ・方向に応じたスタイルが付与されます。
 * @param {"horizontal"|"vertical"} [props.orientation="horizontal"] - セパレーターの向き。デフォルトは"horizontal"（水平）。
 * @param {boolean} [props.decorative=true] - 装飾目的かどうか。trueの場合、アクセシビリティツリーから除外されます。
 * @returns {JSX.Element} 区切り線（セパレーター）要素
 *
 * @example
 * <Separator />
 * <Separator orientation="vertical" className="mx-4" />
 *
 * @note
 * - アクセシビリティ: decorative=falseの場合、区切り線としてスクリーンリーダーに認識されます。
 * - orientationに応じて高さ・幅が自動で切り替わります。
 * - Radix UIのSeparatorPrimitive.Rootのpropsもすべて利用可能です。
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
