"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * Accordionコンポーネント
 *
 * Radix UIのAccordionPrimitive.Rootをラップした、アコーディオンUIのルートコンポーネントです。
 * 複数のAccordionItemを内包し、開閉状態の管理や挙動を制御します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {'single' | 'multiple'} [props.type] - アコーディオンの開閉方式。'single'は1つだけ開く、'multiple'は複数同時に開く。
 * @param {boolean} [props.collapsible] - 'single'モード時、開いている項目を閉じることができるかどうか。
 * @param {string[]} [props.value] - 現在開いている項目の値（制御コンポーネントとして使う場合）。
 * @param {(value: string[]) => void} [props.onValueChange] - 開閉状態が変化したときのコールバック。
 * @param {React.ReactNode} props.children - AccordionItemを含む子要素。
 * @param {string} [props.className] - 追加のCSSクラス。
 * @returns {JSX.Element} Accordionのルート要素
 *
 * @example
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>タイトル</AccordionTrigger>
 *     <AccordionContent>内容</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 *
 * @see https://www.radix-ui.com/docs/primitives/components/accordion
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

/**
 * AccordionItemコンポーネント
 *
 * アコーディオンの1項目を表します。Radix UIのAccordionPrimitive.Itemをラップしています。
 * 各AccordionItemは、value属性で一意に識別されます。
 * 内部にAccordionTriggerとAccordionContentを含めて使用します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} props.value - この項目の一意な値。Accordionのtype='single'やtype='multiple'で開閉状態を管理するために必須。
 * @param {React.ReactNode} props.children - AccordionTriggerとAccordionContentを含む子要素。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトで下線（border-b）が付き、最後の項目は下線が消えます。
 * @returns {JSX.Element} Accordionの項目要素
 *
 * @example
 * <AccordionItem value="item-1">
 *   <AccordionTrigger>タイトル</AccordionTrigger>
 *   <AccordionContent>内容</AccordionContent>
 * </AccordionItem>
 *
 * @note
 * value属性は必須です。重複しないようにしてください。
 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

/**
 * AccordionTriggerコンポーネント
 *
 * アコーディオン項目の開閉トリガー（ボタン）を表します。Radix UIのAccordionPrimitive.Triggerをラップしています。
 * 子要素としてタイトルやラベルを受け取り、右側にChevronDownIcon（下向き矢印）が表示されます。
 * 開いている場合はアイコンが180度回転します。
 * キーボード操作（Enter/Space）やTab移動、フォーカスリングなどアクセシビリティに配慮されています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - トリガー内に表示するタイトルやラベル。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでフォーカスリング、ホバー時の下線、無効化時のスタイルなどが付与されます。
 * @param {boolean} [props.disabled] - トリガーを無効化する場合に指定。
 * @returns {JSX.Element} Accordionのトリガー要素
 *
 * @example
 * <AccordionTrigger>セクションタイトル</AccordionTrigger>
 *
 * @note
 * - アクセシビリティ: ボタンとして動作し、キーボード操作やフォーカスリングに対応しています。
 * - アイコンは開閉状態（data-state=open）で自動回転します。
 * - 無効化（disabled）時は操作不可となり、スタイルも変更されます。
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * AccordionContentコンポーネント
 *
 * アコーディオン項目の内容部分を表します。Radix UIのAccordionPrimitive.Contentをラップしています。
 * 開閉時にアニメーション（data-state属性によるCSSアニメーション）が付与されます。
 * 子要素は内部でdivにラップされ、上下のパディングが設定されています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - アコーディオンの内容として表示する要素。
 * @param {string} [props.className] - 追加のCSSクラス。内容部分のパディングやスタイルをカスタマイズ可能。
 * @returns {JSX.Element} Accordionの内容要素
 *
 * @example
 * <AccordionContent>
 *   <p>詳細な説明やフォームなど、任意の要素を配置できます。</p>
 * </AccordionContent>
 *
 * @note
 * - 開閉アニメーションは[data-state=open]と[data-state=closed]で制御されます。
 * - 内容が多い場合でもoverflow-hiddenではみ出しを防ぎます。
 * - 内部のdivで上下パディング（pt-0 pb-4）が付与されます。
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
