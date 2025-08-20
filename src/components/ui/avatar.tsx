"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "./utils";

/**
 * Avatarコンポーネント
 *
 * ユーザーのアバター（プロフィール画像など）を表示するためのコンテナです。Radix UIのAvatarPrimitive.Rootをラップしています。
 * デフォルトで円形（丸型）・サイズ10（40px相当）・オーバーフロー隠し・flexレイアウトが適用されます。
 * 画像やフォールバック（イニシャルなど）を子要素として受け取ります。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（AvatarPrimitive.Rootのpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトのスタイルに加えてカスタマイズ可能です。
 * @returns {JSX.Element} アバターのコンテナ要素
 *
 * @example
 * <Avatar>
 *   <AvatarImage src="/user.png" alt="ユーザー画像" />
 *   <AvatarFallback>AB</AvatarFallback>
 * </Avatar>
 *
 * @note
 * - Radix UIのAvatarPrimitive.Rootをラップしています。
 * - サイズや形状はデフォルトで丸型・40pxですが、classNameで変更可能です。
 * - 画像が読み込めない場合はフォールバックが表示されます。
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AvatarImageコンポーネント
 *
 * アバター内に表示する画像要素です。Radix UIのAvatarPrimitive.Imageをラップしています。
 * 画像のアスペクト比を正方形に保ち、親要素（Avatar）にフィットするようにサイズを調整します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（AvatarPrimitive.Imageのpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトのスタイルに加えてカスタマイズ可能です。
 * @returns {JSX.Element} アバター画像要素
 *
 * @example
 * <AvatarImage src="/user.png" alt="ユーザー画像" />
 *
 * @note
 * - 画像が読み込めない場合はAvatarFallbackが表示されます。
 * - 親のAvatarコンテナに合わせてサイズが調整されます。
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

/**
 * AvatarFallbackコンポーネント
 *
 * アバター画像の読み込みに失敗した場合や画像が指定されていない場合に表示されるフォールバック要素です。
 * ユーザーのイニシャルやアイコンなどを表示する用途で利用します。Radix UIのAvatarPrimitive.Fallbackをラップしています。
 * デフォルトで中央揃え・丸型・背景色（bg-muted）が適用されます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（AvatarPrimitive.Fallbackのpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトのスタイルに加えてカスタマイズ可能です。
 * @returns {JSX.Element} アバターフォールバック要素
 *
 * @example
 * <AvatarFallback>AB</AvatarFallback>
 *
 * @note
 * - 画像が表示できない場合に自動的に表示されます。
 * - イニシャルやアイコンなど、任意の内容を表示可能です。
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
