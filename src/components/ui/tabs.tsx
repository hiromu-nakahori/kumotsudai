"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

/**
 * Tabsコンポーネント
 *
 * タブUIのルート要素を表します。Radix UIのTabsPrimitive.Rootをラップしています。
 * タブリストやタブコンテンツを子要素として受け取り、flexレイアウトで縦方向に並べます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - タブリストやタブコンテンツなどの子要素。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでflexレイアウトとgapが付与されます。
 * @returns {JSX.Element} タブUIのルート要素
 *
 * @example
 * <Tabs value="tab1" onValueChange={setValue}>
 *   <TabsList>
 *     <TabsTrigger value="tab1">タブ1</TabsTrigger>
 *     <TabsTrigger value="tab2">タブ2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">コンテンツ1</TabsContent>
 *   <TabsContent value="tab2">コンテンツ2</TabsContent>
 * </Tabs>
 *
 * @note
 * - Radix UIのTabsPrimitive.Rootのpropsをそのまま渡せます。
 * - レイアウトやスタイルはTailwind CSSで調整されています。
 */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/**
 * TabsListコンポーネント
 *
 * タブの一覧（タブバー）を表します。Radix UIのTabsPrimitive.Listをラップしています。
 * 子要素としてTabsTriggerを並べて表示します。背景色や角丸、パディングなどのスタイルが付与されています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - タブトリガー（TabsTrigger）などの子要素。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトで背景色や高さ、角丸などが付与されます。
 * @returns {JSX.Element} タブ一覧（タブバー）要素
 *
 * @example
 * <TabsList>
 *   <TabsTrigger value="tab1">タブ1</TabsTrigger>
 *   <TabsTrigger value="tab2">タブ2</TabsTrigger>
 * </TabsList>
 *
 * @note
 * - Radix UIのTabsPrimitive.Listのpropsをそのまま渡せます。
 * - スタイルはTailwind CSSで調整されています。
 */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * TabsTriggerコンポーネント
 *
 * タブの切り替えボタンを表します。Radix UIのTabsPrimitive.Triggerをラップしています。
 * アクティブ状態やフォーカス時のスタイル、無効化時のスタイルなどが付与されています。
 * 子要素としてラベルやアイコンを受け取れます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - タブのラベルやアイコンなど。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでアクティブ時やフォーカス時のスタイルが付与されます。
 * @param {string} props.value - このトリガーが切り替えるタブの値。
 * @param {boolean} [props.disabled] - トリガーを無効化する場合に指定。
 * @returns {JSX.Element} タブ切り替えボタン要素
 *
 * @example
 * <TabsTrigger value="tab1">タブ1</TabsTrigger>
 *
 * @note
 * - アクティブ状態（data-state=active）で背景色やテキスト色が変化します。
 * - 無効化（disabled）時は操作不可となり、スタイルも変更されます。
 * - SVGアイコンもラベルと一緒に表示可能です。
 */
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * TabsContentコンポーネント
 *
 * タブごとのコンテンツ領域を表します。Radix UIのTabsPrimitive.Contentをラップしています。
 * value属性で対応するタブを指定し、アクティブなタブのコンテンツのみ表示されます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - タブに対応するコンテンツ。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでflex-1とoutline-noneが付与されます。
 * @param {string} props.value - このコンテンツが表示されるタブの値。
 * @returns {JSX.Element} タブコンテンツ要素
 *
 * @example
 * <TabsContent value="tab1">タブ1の内容</TabsContent>
 *
 * @note
 * - Radix UIのTabsPrimitive.Contentのpropsをそのまま渡せます。
 * - アクティブなタブのコンテンツのみ表示されます。
 */
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
