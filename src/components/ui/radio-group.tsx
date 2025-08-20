"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * RadioGroupコンポーネント
 *
 * 複数の選択肢から1つを選択するラジオボタンのグループを表します。Radix UIのRadioGroupPrimitive.Rootをラップしています。
 * 子要素としてRadioGroupItemを配置することで、ラジオボタンの選択肢を定義できます。
 * グリッドレイアウト（gap-3）でラジオボタンを並べ、アクセシビリティやキーボード操作に対応しています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（RadioGroupPrimitive.Rootのpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでグリッドレイアウトが適用されます。
 * @returns {JSX.Element} ラジオボタンのグループ要素
 *
 * @example
 * <RadioGroup defaultValue="option1">
 *   <RadioGroupItem value="option1" />
 *   <RadioGroupItem value="option2" />
 * </RadioGroup>
 *
 * @note
 * - Radix UIのRadioGroupPrimitive.Rootをラップしているため、アクセシビリティやキーボード操作に対応しています。
 * - classNameでレイアウトやスタイルのカスタマイズが可能です。
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

/**
 * RadioGroupItemコンポーネント
 *
 * ラジオボタンの個々の選択肢を表します。Radix UIのRadioGroupPrimitive.Itemをラップしています。
 * 選択状態のときは中央にCircleIcon（塗りつぶし円）が表示されます。
 * フォーカスリング、無効化、エラー状態（aria-invalid）などのスタイルに対応しています。
 * キーボード操作やアクセシビリティにも配慮されています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（RadioGroupPrimitive.Itemのpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトで円形・枠線・フォーカスリングなどのスタイルが付与されます。
 * @param {boolean} [props.disabled] - ラジオボタンを無効化する場合に指定。
 * @param {boolean} [props['aria-invalid']] - エラー状態を示す場合に指定。
 * @returns {JSX.Element} ラジオボタンの選択肢要素
 *
 * @example
 * <RadioGroupItem value="option1" />
 *
 * @note
 * - 選択状態のときはCircleIconが中央に表示されます。
 * - 無効化（disabled）やエラー状態（aria-invalid）に応じてスタイルが変化します。
 * - アクセシビリティ: キーボード操作やフォーカスリングに対応しています。
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
