"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * InputOTPコンポーネント
 *
 * OTP（ワンタイムパスワード）入力用のUIコンポーネントです。`input-otp`ライブラリのOTPInputをラップし、スタイルやクラス名の拡張を行います。
 * 入力フィールドのグループ化やカスタムクラスの追加が可能です。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} [props.className] - OTP入力フィールドに追加するCSSクラス
 * @param {string} [props.containerClassName] - OTP入力フィールドのコンテナに追加するCSSクラス
 * @returns {JSX.Element} OTP入力フィールド
 *
 * @example
 * <InputOTP value={otp} onChange={setOtp} />
 *
 * @note
 * - `input-otp`のOTPInputを拡張しています。
 * - 無効化時はスタイルが変更されます。
 */
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

/**
 * InputOTPGroupコンポーネント
 *
 * OTP入力フィールドのグループを表すラッパーコンポーネントです。複数のスロット（桁）を横並びで表示します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} [props.className] - グループのラッパーに追加するCSSクラス
 * @returns {JSX.Element} OTP入力フィールドのグループ
 *
 * @example
 * <InputOTPGroup>
 *   <InputOTPSlot index={0} />
 *   <InputOTPSlot index={1} />
 * </InputOTPGroup>
 */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

/**
 * InputOTPSlotコンポーネント
 *
 * OTP入力の各桁（スロット）を表すコンポーネントです。入力された文字やキャレット（点滅カーソル）を表示します。
 * アクティブ状態やバリデーション状態に応じてスタイルが変化します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {number} props.index - スロットのインデックス（何桁目かを指定）
 * @param {string} [props.className] - スロットに追加するCSSクラス
 * @returns {JSX.Element} OTP入力の1桁分のスロット
 *
 * @example
 * <InputOTPSlot index={0} />
 *
 * @note
 * - アクティブ時やバリデーションエラー時に枠線や背景色が変化します。
 * - キャレット（点滅する縦線）はhasFakeCaretがtrueの時に表示されます。
 */
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm bg-input-background transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

/**
 * InputOTPSeparatorコンポーネント
 *
 * OTP入力フィールドの区切り（セパレーター）を表すコンポーネントです。デフォルトでMinusIcon（横線アイコン）を表示します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @returns {JSX.Element} 区切り線（セパレーター）
 *
 * @example
 * <InputOTPSeparator />
 *
 * @note
 * - role="separator"が付与され、アクセシビリティに配慮されています。
 * - アイコンはMinusIconでカスタマイズ可能です。
 */
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
