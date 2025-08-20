//コンポーネント作成のため
import * as React from "react";
//asChildプロパティで、ラップする要素を柔軟に変更できるようにするため。
import { Slot } from "@radix-ui/react-slot";
//クラス名のバリアント（バージョン管理）variantやsizeなどのスタイル切り替えを簡略化。
import { cva, type VariantProps } from "class-variance-authority";
//クラス名を結合するユーティリティ関数
import { cn } from "./utils";

/**
 * ベースクラス：ボタンの基本的な見た目・挙動(flex配置、ラウンド、フォント、トランジション、disabled時の見た目など)
 * バリアント：variant(色や背景などのテーマ)とsize(大きさ)を切り替え可能
 * defaultVariants：デフォルト値(variant:"default", size:"default")
 * 
 * variantの種類
 * - default: プライマリボタン
 * - destructive: 破壊的操作用
 * - outline: 枠線付き
 * - secondary: セカンダリースタイル
 * - ghost: 透過スタイル
 * - link: リンク風ボタン
 * 
 * sizeの種類
 * - default: 通常サイズ
 * - sm: 小サイズ
 * - lg: 大サイズ
 * - icon: アイコンボタン(正方形)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * ボタンコンポーネント
 * forwardRef：refを外部から渡せる（例：フォームライブラリやテストで便利）
 * props：
 * - className：追加のクラス名
 * - variant：ボタンのスタイル variant
 * - size：ボタンのサイズ
 * - asChild：trueの場合、Slot（Radix UI）で任意要素をラップする
 * Comp：asChildがtrueならSlot、falseならbuttonタグ
 * className：buttonVariantsでvariant/sizeに応じたクラスを生成し、cnで結合。
 * props：その他のprops（onClickなど）をすべて渡す。
 */
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

/**
 * Button：コンポーネント本体
 * buttonVariants：variantのクラス生成関数（他のコンポーネントでも使える）
 */
Button.displayName = "Button";
export { Button, buttonVariants };
