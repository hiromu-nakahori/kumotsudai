import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "./utils";

/**
 * Breadcrumbコンポーネント
 *
 * パンくずリスト全体のナビゲーション領域を表します。`<nav>`要素としてレンダリングされ、`aria-label="breadcrumb"`でアクセシビリティに配慮されています。
 *
 * @component
 * @param {Object} props - `<nav>`要素に渡すprops
 * @returns {JSX.Element} パンくずリストのナビゲーション領域
 *
 * @example
 * <Breadcrumb>
 *   <BreadcrumbList>...</BreadcrumbList>
 * </Breadcrumb>
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

/**
 * BreadcrumbListコンポーネント
 *
 * パンくずリストの項目を並べるリスト（`<ol>`）を表します。ラップや間隔、テキストサイズなどのスタイルが付与されます。
 *
 * @component
 * @param {Object} props - `<ol>`要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} パンくずリストの項目リスト
 *
 * @example
 * <BreadcrumbList>
 *   <BreadcrumbItem>...</BreadcrumbItem>
 * </BreadcrumbList>
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

/**
 * BreadcrumbItemコンポーネント
 *
 * パンくずリストの各項目（`<li>`）を表します。アイテム同士の間隔やインライン表示のスタイルが付与されます。
 *
 * @component
 * @param {Object} props - `<li>`要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} パンくずリストの項目
 *
 * @example
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
 * </BreadcrumbItem>
 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

/**
 * BreadcrumbLinkコンポーネント
 *
 * パンくずリスト内のリンク項目を表します。`<a>`要素としてレンダリングされ、`asChild`を指定するとSlot経由で他の要素にも差し替え可能です。
 * ホバー時に色が変化するなどのスタイルが付与されます。
 *
 * @component
 * @param {Object} props - `<a>`要素に渡すprops
 * @param {boolean} [props.asChild] - Slot経由で他の要素に差し替える場合に指定
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} パンくずリストのリンク項目
 *
 * @example
 * <BreadcrumbLink href="/about">About</BreadcrumbLink>
 * <BreadcrumbLink asChild><Link to="/about">About</Link></BreadcrumbLink>
 */
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
}

/**
 * BreadcrumbPageコンポーネント
 *
 * パンくずリストの現在ページ（アクティブな項目）を表します。`<span>`要素としてレンダリングされ、`aria-current="page"`でアクセシビリティに配慮されています。
 * リンクではなく、現在地を示すために`aria-disabled="true"`が付与されます。
 *
 * @component
 * @param {Object} props - `<span>`要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} パンくずリストの現在ページ項目
 *
 * @example
 * <BreadcrumbPage>現在のページ</BreadcrumbPage>
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
}

/**
 * BreadcrumbSeparatorコンポーネント
 *
 * パンくずリストの項目間の区切り（セパレーター）を表します。デフォルトではChevronRightアイコンが表示されますが、`children`で任意の区切り記号に変更可能です。
 * アクセシビリティのため`role="presentation"`と`aria-hidden="true"`が付与されます。
 *
 * @component
 * @param {Object} props - `<li>`要素に渡すprops
 * @param {React.ReactNode} [props.children] - 区切り記号（デフォルトはChevronRightアイコン）
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} パンくずリストの区切り要素
 *
 * @example
 * <BreadcrumbSeparator />
 * <BreadcrumbSeparator children="|" />
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

/**
 * BreadcrumbEllipsisコンポーネント
 *
 * パンくずリストが長い場合などに省略記号（...）を表示するためのコンポーネントです。デフォルトでMoreHorizontalアイコンが表示され、スクリーンリーダー用に「More」とテキストが含まれます。
 * アクセシビリティのため`role="presentation"`と`aria-hidden="true"`が付与されます。
 *
 * @component
 * @param {Object} props - `<span>`要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} パンくずリストの省略記号
 *
 * @example
 * <BreadcrumbEllipsis />
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
