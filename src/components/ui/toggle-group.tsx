"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

/**
 * ToggleGroupコンポーネント
 *
 * 複数のトグルボタンをグループ化し、排他的または複数選択可能なUIを提供します。  
 * Radix UIのToggleGroupPrimitive.Rootをラップし、variant（バリアント）やsize（サイズ）などのスタイルをcontextで子要素に伝播します。
 * ボタン群の外枠やシャドウ、ラウンド角などのスタイルが自動で付与されます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - トグルグループ内に表示するToggleGroupItem要素。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでflexレイアウトやrounded、shadowなどが付与されます。
 * @param {"default"|"outline"|"ghost"|"destructive"} [props.variant] - トグルグループ全体のバリアント（スタイル種別）。
 * @param {"default"|"sm"|"lg"} [props.size] - トグルグループ全体のサイズ。
 * @returns {JSX.Element} トグルグループのラッパー要素
 *
 * @example
 * <ToggleGroup variant="outline" size="sm">
 *   <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
 *   <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
 * </ToggleGroup>
 *
 * @note
 * - variant/sizeはcontext経由で子のToggleGroupItemに伝播します。
 * - Radix UIのToggleGroupPrimitive.Rootのpropsもそのまま渡せます（type, value, onValueChangeなど）。
 * - アクセシビリティ: キーボード操作やフォーカスリングに対応しています。
 */
function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

/**
 * ToggleGroupItemコンポーネント
 *
 * ToggleGroup内の個々のトグルボタンを表します。  
 * Radix UIのToggleGroupPrimitive.Itemをラップし、variantやsizeのスタイルをcontextまたはpropsから適用します。
 * グループ内で自動的に角丸やボーダー、シャドウなどのスタイルが調整されます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {React.ReactNode} props.children - トグルボタン内に表示する内容（ラベルやアイコンなど）。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでflex-1やrounded、focus時のz-indexなどが付与されます。
 * @param {"default"|"outline"|"ghost"|"destructive"} [props.variant] - 個別のバリアント（グループのvariantが優先されます）。
 * @param {"default"|"sm"|"lg"} [props.size] - 個別のサイズ（グループのsizeが優先されます）。
 * @returns {JSX.Element} トグルボタン要素
 *
 * @example
 * <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
 *
 * @note
 * - variant/sizeはグループのcontextが優先されます。
 * - Radix UIのToggleGroupPrimitive.Itemのpropsもそのまま渡せます（value, disabledなど）。
 * - アクセシビリティ: ボタンとして動作し、キーボード操作やフォーカスリングに対応しています。
 */
function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
