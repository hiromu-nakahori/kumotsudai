import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/**
 * alertVariants
 *
 * class-variance-authority (CVA) を用いて、Alertコンポーネントのバリアント（variant）ごとのCSSクラスを定義します。
 * variantには "default"（通常）と "destructive"（破壊的/エラー）の2種類があり、用途に応じてスタイルが切り替わります。
 * SVGアイコンの有無によってレイアウトも自動調整されます。
 *
 * @type {import('class-variance-authority').ClassValue}
 *
 * @example
 * alertVariants({ variant: "destructive" }) // 破壊的アラート用のクラスを返す
 *
 * @note
 * - variantの値によって背景色やテキスト色が変化します。
 * - SVGアイコンが含まれる場合はグリッドレイアウトが調整されます。
 */
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Alertコンポーネント
 *
 * 通知や警告メッセージを表示するためのコンテナです。variantによって通常・破壊的（エラー等）のスタイルを切り替えられます。
 * SVGアイコンを先頭に配置する場合は自動的にレイアウトが調整されます。タイトルや説明文を子要素として受け取ります。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。レイアウトや色などをカスタマイズできます。
 * @param {'default'|'destructive'} [props.variant='default'] - アラートの種類。'destructive'はエラーや警告用の強調スタイル。
 * @param {React.ReactNode} props.children - アラート内に表示する内容（タイトルや説明、アイコンなど）。
 * @returns {JSX.Element} アラートのコンテナ要素
 *
 * @example
 * <Alert variant="destructive">
 *   <AlertTitle>エラーが発生しました</AlertTitle>
 *   <AlertDescription>もう一度お試しください。</AlertDescription>
 * </Alert>
 *
 * @note
 * - SVGアイコンを先頭に配置すると自動的にレイアウトが調整されます。
 * - variantによって色やテキストの強調が切り替わります。
 * - アクセシビリティ: role="alert"が付与され、通知として認識されます。
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

/**
 * AlertTitleコンポーネント
 *
 * アラートのタイトル部分を表示します。太字・1行表示・レイアウト調整済みです。
 * 通常はAlertコンポーネントの子要素として使用します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。タイトルのスタイルをカスタマイズできます。
 * @param {React.ReactNode} props.children - タイトルとして表示する内容。
 * @returns {JSX.Element} アラートのタイトル要素
 *
 * @example
 * <AlertTitle>エラーが発生しました</AlertTitle>
 *
 * @note
 * - 1行表示（line-clamp-1）で長いタイトルも省略されます。
 * - レイアウト上、アイコンの右側に配置されます。
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDescriptionコンポーネント
 *
 * アラートの説明文や詳細情報を表示します。複数行や段落にも対応しています。
 * 通常はAlertコンポーネントの子要素として使用します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。説明文のスタイルをカスタマイズできます。
 * @param {React.ReactNode} props.children - 説明文として表示する内容（テキスト、段落など）。
 * @returns {JSX.Element} アラートの説明要素
 *
 * @example
 * <AlertDescription>もう一度お試しください。</AlertDescription>
 *
 * @note
 * - 段落（pタグ）も適切にスタイルされます。
 * - レイアウト上、アイコンの右側・タイトルの下に配置されます。
 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
