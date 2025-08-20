"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/**
 * AspectRatioコンポーネント
 *
 * 指定したアスペクト比でコンテンツを表示するためのラッパーコンポーネントです。  
 * Radix UIのAspectRatioPrimitive.Rootをラップしており、画像や動画などの要素を一定の比率で表示したい場合に利用します。
 * `ratio`プロパティで比率を指定できます（例: 16/9, 4/3など）。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops
 * @param {number} [props.ratio] - 表示するアスペクト比（例: 16/9なら1.777...）。省略時はデフォルト比率になります。
 * @param {React.ReactNode} [props.children] - アスペクト比内に表示する要素（画像、動画、テキストなど）。
 * @param {string} [props.className] - 追加のCSSクラス。
 * @returns {JSX.Element} 指定したアスペクト比でラップされた要素
 *
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src="..." alt="..." />
 * </AspectRatio>
 *
 * @note
 * - CSSの`aspect-ratio`プロパティを利用しているため、対応ブラウザでのみ正しく動作します。
 * - レスポンシブなレイアウトで画像や動画の比率を維持したい場合に便利です。
 */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
