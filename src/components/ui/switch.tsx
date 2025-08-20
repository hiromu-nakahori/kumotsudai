"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

/**
 * Switchコンポーネント
 *
 * トグルスイッチ（ON/OFF切り替え）を表すUIコンポーネントです。Radix UIのSwitchPrimitive.Rootをラップしています。
 * 状態（ON/OFF）に応じて背景色やThumb（つまみ）の位置・色が変化します。アクセシビリティ対応済みで、キーボード操作やフォーカスリングもサポートします。
 * ダークモードや無効化状態にも対応しています。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（SwitchPrimitive.Rootのpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでサイズ・色・フォーカスリング・無効化時のスタイルなどが付与されます。
 * @param {boolean} [props.disabled] - スイッチを無効化する場合に指定。操作不可となり、スタイルも変更されます。
 * @param {boolean} [props.checked] - スイッチのON/OFF状態を制御する場合に指定。
 * @param {Function} [props.onCheckedChange] - スイッチの状態が変化した際に呼ばれるコールバック。
 * @returns {JSX.Element} トグルスイッチ要素
 *
 * @example
 * <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
 *
 * @note
 * - アクセシビリティ: キーボード操作（Space/Enter）やフォーカスリングに対応しています。
 * - 状態（checked/unchecked）に応じてThumbの位置や色が自動で切り替わります。
 * - ダークモードやdisabled状態にも対応しています。
 */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
