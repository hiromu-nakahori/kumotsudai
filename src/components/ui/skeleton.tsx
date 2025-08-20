import { cn } from "./utils";

/**
 * Skeletonコンポーネント
 *
 * ローディング中のプレースホルダーとして使用するスケルトンUIを表します。
 * 指定した領域にアニメーション付きのグレー背景（bg-accent, animate-pulse）を表示し、コンテンツの読み込みを示します。
 * 角丸（rounded-md）スタイルがデフォルトで適用されます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（div要素の全ての属性を受け付けます）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトのスタイルに加えて任意のクラスを付与できます。
 * @returns {JSX.Element} スケルトンUIのdiv要素
 *
 * @example
 * <Skeleton className="h-6 w-32" />
 *
 * @note
 * - ローディング中のリストやカード、テキストなど様々なUIのプレースホルダーとして利用できます。
 * - デフォルトでアニメーション（animate-pulse）と角丸（rounded-md）が付与されます。
 * - classNameでサイズや形状を自由にカスタマイズ可能です。
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
