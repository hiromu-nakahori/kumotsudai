import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/**
 * badgeVariantsユーティリティ
 *
 * バッジ（Badge）コンポーネントのスタイルバリアントを定義するためのcva（class-variance-authority）関数です。
 * variantプロパティに応じて、バッジの色・背景・ボーダー・ホバー・フォーカス・アクセシビリティ状態などのCSSクラスを切り替えます。
 * デフォルトは "default" バリアントです。
 *
 * @see https://cva.style/
 *
 * @type {import('class-variance-authority').CVA}
 *
 * @example
 * badgeVariants({ variant: "destructive" }) // "border-transparent bg-destructive text-white ..."
 *
 * @note
 * - variant: "default" | "secondary" | "destructive" | "outline" を指定可能。
 * - [a&]セレクタにより、リンク要素として使う場合のホバー効果も付与されます。
 * - aria-invalidやfocus-visibleなどアクセシビリティ対応のスタイルも含みます。
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Badgeコンポーネント
 *
 * ステータスやラベルなどを表示するためのバッジ（ラベル）UIコンポーネントです。
 * variantプロパティで色やスタイルを切り替えられます。asChildをtrueにするとSlot（Radix UI）を使い、任意の要素としてラップ可能です。
 * アイコン（svg）を含む場合は自動でサイズ・間隔調整されます。
 * アクセシビリティやフォーカスリング、ホバー、無効化状態などにも対応しています。
 *
 * @component
 * @param {Object} props - バッジに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトのスタイルに加えて任意のクラスを付与できます。
 * @param {"default"|"secondary"|"destructive"|"outline"} [props.variant] - バッジのバリアント（色・スタイル）。デフォルトは "default"。
 * @param {boolean} [props.asChild=false] - trueの場合、Slot（Radix UI）でラップし、任意の要素としてバッジを適用します。
 * @param {React.ReactNode} [props.children] - バッジ内に表示する内容（テキストやアイコンなど）。
 * @returns {JSX.Element} バッジ要素（spanまたはSlotでラップされた要素）
 *
 * @example
 * <Badge>New</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge asChild><a href="/profile">Profile</a></Badge>
 *
 * @note
 * - variantによって色・背景・ボーダー・ホバー・フォーカスなどのスタイルが切り替わります。
 * - asChildを使うことで、aタグやbuttonタグなど任意の要素にバッジスタイルを適用できます。
 * - svgアイコンを含む場合は自動でサイズ・間隔が調整されます。
 * - アクセシビリティ対応（aria-invalid, focus-visible など）。
 */
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
