"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

/**
 * Labelコンポーネント
 *
 * フォーム要素（入力欄、チェックボックスなど）のラベルを表すコンポーネントです。  
 * Radix UIのLabelPrimitive.Rootをラップしており、アクセシビリティに配慮されたラベルを簡単に作成できます。
 * デフォルトでテキストサイズや間隔、無効化時のスタイルなどが適用されます。
 * `peer-disabled`や`group-data-[disabled=true]`により、関連するフォーム要素の状態に応じて自動的にスタイルが変化します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（Radix UI LabelPrimitive.Rootのpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでテキストサイズ、間隔、無効化時のスタイルが付与されます。
 * @param {React.ReactNode} [props.children] - ラベルとして表示する内容。
 * @returns {JSX.Element} ラベル要素
 *
 * @example
 * <Label htmlFor="username">ユーザー名</Label>
 *
 * @note
 * - アクセシビリティ: `htmlFor`属性を使うことで、関連するフォーム要素と紐付けできます。
 * - 無効化（disabled）状態のフォーム要素と連動して、ラベルのスタイルも自動的に変更されます。
 * - Radix UIのLabelPrimitive.Rootの全てのpropsが利用可能です。
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
