"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "./utils";
import { buttonVariants } from "./button";

/**
 * AlertDialogコンポーネント
 *
 * Radix UIのAlertDialogPrimitive.Rootをラップしたコンポーネントです。モーダル型の警告ダイアログのルート要素として使用します。
 * ダイアログの開閉状態や制御を管理します。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Rootに渡すprops
 * @returns {JSX.Element} 警告ダイアログのルート要素
 *
 * @example
 * <AlertDialog open={open} onOpenChange={setOpen}>...</AlertDialog>
 */
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

/**
 * AlertDialogTriggerコンポーネント
 *
 * 警告ダイアログを開くためのトリガー（ボタン等）を表します。Radix UIのAlertDialogPrimitive.Triggerをラップしています。
 * 任意の子要素（ボタンやリンクなど）をトリガーとして利用できます。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Triggerに渡すprops
 * @returns {JSX.Element} ダイアログを開くためのトリガー要素
 *
 * @example
 * <AlertDialogTrigger>削除する</AlertDialogTrigger>
 */
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

/**
 * AlertDialogPortalコンポーネント
 *
 * ダイアログの内容をポータルとしてDOMツリーの外にレンダリングします。Radix UIのAlertDialogPrimitive.Portalをラップしています。
 * ダイアログのオーバーレイやコンテンツをポータル内に表示します。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Portalに渡すprops
 * @returns {JSX.Element} ポータル要素
 *
 * @example
 * <AlertDialogPortal>...</AlertDialogPortal>
 */
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

/**
 * AlertDialogOverlayコンポーネント
 *
 * ダイアログの背面に表示されるオーバーレイ（半透明の背景）を表します。Radix UIのAlertDialogPrimitive.Overlayをラップしています。
 * 開閉時のアニメーションやスタイルが付与されています。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Overlayに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} オーバーレイ要素
 *
 * @example
 * <AlertDialogOverlay />
 *
 * @note
 * - 開閉状態に応じてアニメーションが適用されます。
 * - z-indexや背景色などのスタイルが付与されています。
 */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogContentコンポーネント
 *
 * ダイアログのメインコンテンツ領域を表します。Radix UIのAlertDialogPrimitive.Contentをラップし、ポータル・オーバーレイと組み合わせて表示します。
 * ダイアログのタイトル、説明、アクションボタンなどを子要素として配置します。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Contentに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} ダイアログのコンテンツ要素
 *
 * @example
 * <AlertDialogContent>
 *   <AlertDialogHeader>...</AlertDialogHeader>
 *   <AlertDialogFooter>...</AlertDialogFooter>
 * </AlertDialogContent>
 *
 * @note
 * - ポータル・オーバーレイとセットで表示されます。
 * - 開閉時のアニメーションやレスポンシブなレイアウトが適用されています。
 */
function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

/**
 * AlertDialogHeaderコンポーネント
 *
 * ダイアログのヘッダー領域を表します。タイトルや説明文などを配置するためのラッパーです。
 * レイアウトやテキストのスタイルが付与されています。
 *
 * @component
 * @param {Object} props - div要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} ダイアログのヘッダー要素
 *
 * @example
 * <AlertDialogHeader>
 *   <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
 *   <AlertDialogDescription>この操作は元に戻せません。</AlertDialogDescription>
 * </AlertDialogHeader>
 */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

/**
 * AlertDialogFooterコンポーネント
 *
 * ダイアログのフッター領域を表します。アクションボタン（OK/キャンセル等）を配置するためのラッパーです。
 * レイアウトやボタン配置のスタイルが付与されています。
 *
 * @component
 * @param {Object} props - div要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} ダイアログのフッター要素
 *
 * @example
 * <AlertDialogFooter>
 *   <AlertDialogCancel>キャンセル</AlertDialogCancel>
 *   <AlertDialogAction>削除する</AlertDialogAction>
 * </AlertDialogFooter>
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogTitleコンポーネント
 *
 * ダイアログのタイトルを表示します。Radix UIのAlertDialogPrimitive.Titleをラップしています。
 * 見出しとして強調されたテキストスタイルが付与されています。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Titleに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} ダイアログのタイトル要素
 *
 * @example
 * <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
 */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

/**
 * AlertDialogDescriptionコンポーネント
 *
 * ダイアログの説明文を表示します。Radix UIのAlertDialogPrimitive.Descriptionをラップしています。
 * 補足説明や警告文などを表示するためのテキストスタイルが付与されています。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Descriptionに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} ダイアログの説明要素
 *
 * @example
 * <AlertDialogDescription>この操作は元に戻せません。</AlertDialogDescription>
 */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/**
 * AlertDialogActionコンポーネント
 *
 * ダイアログの主要なアクション（OK/削除など）ボタンを表します。Radix UIのAlertDialogPrimitive.Actionをラップし、ボタンスタイルを適用しています。
 * 操作を確定するためのボタンとして利用します。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Actionに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} アクションボタン要素
 *
 * @example
 * <AlertDialogAction>削除する</AlertDialogAction>
 *
 * @note
 * - buttonVariants()でボタンのスタイルが適用されます。
 */
function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

/**
 * AlertDialogCancelコンポーネント
 *
 * ダイアログのキャンセル（閉じる）ボタンを表します。Radix UIのAlertDialogPrimitive.Cancelをラップし、アウトラインボタンスタイルを適用しています。
 * 操作をキャンセルするためのボタンとして利用します。
 *
 * @component
 * @param {Object} props - AlertDialogPrimitive.Cancelに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} キャンセルボタン要素
 *
 * @example
 * <AlertDialogCancel>キャンセル</AlertDialogCancel>
 *
 * @note
 * - buttonVariants({ variant: "outline" })でアウトラインスタイルが適用されます。
 */
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
