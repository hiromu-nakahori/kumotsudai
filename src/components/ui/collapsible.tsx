"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/**
 * Collapsibleコンポーネント
 *
 * 折りたたみ可能なコンテンツ領域を提供するRadix UIのCollapsiblePrimitive.Rootをラップしたコンポーネントです。
 * 子要素としてトリガーやコンテンツを受け取り、開閉状態を管理します。
 * アクセシビリティに配慮されており、キーボード操作やフォーカスリングに対応しています。
 *
 * @component
 * @param {Object} props - CollapsiblePrimitive.Rootに渡すprops
 * @param {React.ReactNode} props.children - 折りたたみ領域内に表示する要素（トリガーやコンテンツなど）。
 * @param {boolean} [props.open] - 折りたたみ領域の開閉状態（制御用）。
 * @param {Function} [props.onOpenChange] - 開閉状態が変化した際に呼ばれるコールバック。
 * @param {string} [props.className] - 追加のCSSクラス。
 * @returns {JSX.Element} 折りたたみ可能な領域
 *
 * @example
 * <Collapsible open={isOpen} onOpenChange={setIsOpen}>
 *   <CollapsibleTrigger>詳細を見る</CollapsibleTrigger>
 *   <CollapsibleContent>ここに詳細情報が表示されます。</CollapsibleContent>
 * </Collapsible>
 *
 * @note
 * - アクセシビリティ: 開閉状態はARIA属性で管理されます。
 * - 状態管理はopen/onOpenChangeで制御可能です。
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/**
 * CollapsibleTriggerコンポーネント
 *
 * Collapsible領域の開閉トリガー（ボタン）を表します。Radix UIのCollapsiblePrimitive.CollapsibleTriggerをラップしています。
 * 子要素としてラベルやアイコンなどを受け取ることができます。
 * キーボード操作（Enter/Space）やTab移動、フォーカスリングなどアクセシビリティに配慮されています。
 *
 * @component
 * @param {Object} props - CollapsiblePrimitive.CollapsibleTriggerに渡すprops
 * @param {React.ReactNode} props.children - トリガー内に表示するラベルやアイコン。
 * @param {string} [props.className] - 追加のCSSクラス。
 * @param {boolean} [props.disabled] - トリガーを無効化する場合に指定。
 * @returns {JSX.Element} Collapsibleのトリガー要素
 *
 * @example
 * <CollapsibleTrigger>詳細を見る</CollapsibleTrigger>
 *
 * @note
 * - アクセシビリティ: ボタンとして動作し、キーボード操作やフォーカスリングに対応しています。
 * - 無効化（disabled）時は操作不可となり、スタイルも変更されます。
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

/**
 * CollapsibleContentコンポーネント
 *
 * Collapsible領域の開閉可能なコンテンツ部分を表します。Radix UIのCollapsiblePrimitive.CollapsibleContentをラップしています。
 * 折りたたみ状態に応じて表示・非表示が切り替わります。
 * アニメーションやアクセシビリティに配慮されています。
 *
 * @component
 * @param {Object} props - CollapsiblePrimitive.CollapsibleContentに渡すprops
 * @param {React.ReactNode} props.children - 折りたたみ領域内に表示するコンテンツ。
 * @param {string} [props.className] - 追加のCSSクラス。
 * @returns {JSX.Element} Collapsibleのコンテンツ要素
 *
 * @example
 * <CollapsibleContent>ここに詳細情報が表示されます。</CollapsibleContent>
 *
 * @note
 * - アクセシビリティ: 折りたたみ状態はARIA属性で管理されます。
 * - アニメーションやトランジションの設定が可能です。
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
