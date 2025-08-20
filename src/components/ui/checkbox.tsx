"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * Checkboxコンポーネント
 *
 * Radix UIのCheckboxPrimitive.Rootをラップしたチェックボックスコンポーネントです。
 * デフォルトで美しいスタイルとアクセシビリティを備えており、チェック時にはチェックアイコン（CheckIcon）が表示されます。
 * ダークモードやバリデーションエラー、フォーカスリング、無効化状態など各種状態に対応しています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトで角丸、ボーダー、影、フォーカスリング、無効化時のスタイルなどが付与されます。
 * @param {boolean} [props.disabled] - チェックボックスを無効化する場合に指定。
 * @param {boolean} [props.checked] - チェック状態を制御する場合に指定（コントロールドコンポーネント用）。
 * @param {boolean} [props.defaultChecked] - 初期のチェック状態を指定（アンコントロールドコンポーネント用）。
 * @param {function} [props.onCheckedChange] - チェック状態が変化したときに呼ばれるコールバック。
 * @param {any} [props.id] - チェックボックスのid属性。
 * @param {any} [props['aria-invalid']] - バリデーションエラー時に指定。エラー時は赤いリングやボーダーが表示されます。
 * @returns {JSX.Element} チェックボックス要素
 *
 * @example
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 *
 * @note
 * - アクセシビリティ: キーボード操作やフォーカスリング、aria属性に対応しています。
 * - チェック時はCheckIconが中央に表示されます。
 * - 無効化（disabled）時は操作不可となり、スタイルも変更されます。
 * - ダークモードやバリデーションエラー時のスタイルも自動で適用されます。
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
