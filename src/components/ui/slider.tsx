"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

/**
 * Sliderコンポーネント
 *
 * Radix UIのSliderPrimitiveをラップしたスライダーUIコンポーネントです。数値の範囲選択や値の調整に使用します。
 * 単一値または複数値（レンジスライダー）に対応し、カスタムスタイルやアクセシビリティも考慮されています。
 * 水平方向・垂直方向の両方に対応し、ドラッグやキーボード操作で値を変更できます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（Radix UI SliderPrimitive.Rootのpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでスライダーの外観・状態（無効化、縦横方向）に応じたスタイルが付与されます。
 * @param {number|number[]} [props.defaultValue] - 初期値。単一値または配列（レンジ）で指定可能。
 * @param {number|number[]} [props.value] - 現在の値。単一値または配列（レンジ）で指定可能。制御コンポーネントとして使用する場合に指定。
 * @param {number} [props.min=0] - 最小値。デフォルトは0。
 * @param {number} [props.max=100] - 最大値。デフォルトは100。
 * @param {...any} [props.props] - その他Radix UI SliderPrimitive.Rootが受け付けるprops（onValueChange, step, orientationなど）。
 * @returns {JSX.Element} スライダーUI要素
 *
 * @example
 * <Slider defaultValue={50} min={0} max={100} />
 * <Slider value={[20, 80]} min={0} max={100} onValueChange={setValue} />
 *
 * @note
 * - value/defaultValueが配列の場合はレンジスライダーとして動作し、複数のThumb（つまみ）が表示されます。
 * - アクセシビリティ: キーボード操作、フォーカスリング、無効化状態に対応しています。
 * - スタイルはTailwind CSSのユーティリティクラスでカスタマイズされています。
 * - Radix UIのSliderPrimitive.Track, SliderPrimitive.Range, SliderPrimitive.Thumbを内部で使用しています。
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
