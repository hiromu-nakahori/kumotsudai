"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

/**
 * CarouselApi型
 *
 * Embla CarouselのAPI型を表します。useEmblaCarouselの戻り値の2番目（APIオブジェクト）です。
 * スクロール制御やイベントリスナーの追加・削除など、Carouselの操作に利用します。
 *
 * @typedef {UseEmblaCarouselType[1]} CarouselApi
 *
 * @see https://www.embla-carousel.com/api/
 */
type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;

/**
 * CarouselOptions型
 *
 * Embla Carouselのオプション型です。useEmblaCarouselの第1引数で渡す設定値（axis, loop, speedなど）を表します。
 *
 * @typedef {Parameters<typeof useEmblaCarousel>[0]} CarouselOptions
 *
 * @see https://www.embla-carousel.com/options/
 */
type CarouselOptions = UseCarouselParameters[0];

/**
 * CarouselPlugin型
 *
 * Embla Carouselのプラグイン型です。useEmblaCarouselの第2引数で渡すプラグイン配列を表します。
 *
 * @typedef {Parameters<typeof useEmblaCarousel>[1]} CarouselPlugin
 *
 * @see https://www.embla-carousel.com/plugins/
 */
type CarouselPlugin = UseCarouselParameters[1];

/**
 * CarouselProps型
 *
 * Carouselコンポーネントに渡すpropsの型です。オプション、プラグイン、向き、APIセット関数などを含みます。
 *
 * @typedef {Object} CarouselProps
 * @property {CarouselOptions} [opts] - Embla Carouselのオプション
 * @property {CarouselPlugin} [plugins] - Embla Carouselのプラグイン
 * @property {"horizontal" | "vertical"} [orientation] - カルーセルの向き（デフォルト: horizontal）
 * @property {(api: CarouselApi) => void} [setApi] - Embla CarouselのAPIを取得するためのコールバック
 */
type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

/**
 * CarouselContextProps型
 *
 * CarouselContextで管理する値の型です。Carouselの参照、API、スクロール制御関数、スクロール可否、各種propsを含みます。
 *
 * @typedef {Object} CarouselContextProps
 * @property {React.RefObject<HTMLDivElement>} carouselRef - Embla Carouselの参照
 * @property {CarouselApi} api - Embla CarouselのAPI
 * @property {() => void} scrollPrev - 前のスライドへスクロールする関数
 * @property {() => void} scrollNext - 次のスライドへスクロールする関数
 * @property {boolean} canScrollPrev - 前へスクロール可能かどうか
 * @property {boolean} canScrollNext - 次へスクロール可能かどうか
 * @property {CarouselOptions} [opts] - Embla Carouselのオプション
 * @property {CarouselPlugin} [plugins] - Embla Carouselのプラグイン
 * @property {"horizontal" | "vertical"} [orientation] - カルーセルの向き
 * @property {(api: CarouselApi) => void} [setApi] - Embla CarouselのAPIを取得するためのコールバック
 */
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

/**
 * CarouselContext
 *
 * Carouselの状態や操作関数を提供するReactコンテキストです。Carousel内部の各コンポーネントでuseCarousel()を通じて利用します。
 *
 * @type {React.Context<CarouselContextProps | null>}
 *
 * @see useCarousel
 */
const CarouselContext = React.createContext<CarouselContextProps | null>(null);

/**
 * useCarouselフック
 *
 * CarouselContextからCarouselの状態や操作関数を取得するカスタムフックです。Carousel内部の子コンポーネントで利用します。
 * Carouselコンポーネントの子孫でのみ使用可能です。
 *
 * @returns {CarouselContextProps} Carouselの状態・操作関数
 * @throws {Error} CarouselContextが存在しない場合（Carousel外で使用した場合）にエラーを投げます
 *
 * @example
 * const { scrollNext } = useCarousel();
 * scrollNext();
 */
function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

/**
 * Carouselコンポーネント
 *
 * Embla Carouselをラップしたカルーセルのルートコンポーネントです。状態管理やキーボード操作、コンテキストの提供を行います。
 * orientation, opts, plugins, setApiなどのpropsで動作をカスタマイズできます。
 * 子要素としてCarouselContent, CarouselItem, CarouselPrevious, CarouselNextなどを配置します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（divのprops + CarouselProps）
 * @param {"horizontal" | "vertical"} [props.orientation] - カルーセルの向き（デフォルト: horizontal）
 * @param {CarouselOptions} [props.opts] - Embla Carouselのオプション
 * @param {CarouselPlugin} [props.plugins] - Embla Carouselのプラグイン
 * @param {(api: CarouselApi) => void} [props.setApi] - Embla CarouselのAPIを取得するためのコールバック
 * @param {string} [props.className] - 追加のCSSクラス
 * @param {React.ReactNode} props.children - カルーセルの子要素
 * @returns {JSX.Element} カルーセルのルート要素
 *
 * @example
 * <Carousel>
 *   <CarouselContent>
 *     <CarouselItem>1</CarouselItem>
 *     <CarouselItem>2</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 * </Carousel>
 *
 * @note
 * - キーボード操作（左右キー）に対応
 * - Embla CarouselのAPIをコンテキストで管理
 * - orientationで縦横切り替え可能
 */
function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

/**
 * CarouselContentコンポーネント
 *
 * カルーセルのスライドコンテンツをラップするコンポーネントです。carouselRefをrefとして渡し、overflow-hiddenでスライド領域を制御します。
 * 子要素としてCarouselItemを並べて使用します。
 *
 * @component
 * @param {Object} props - divのprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @param {React.ReactNode} props.children - スライドアイテム
 * @returns {JSX.Element} カルーセルのコンテンツ領域
 *
 * @example
 * <CarouselContent>
 *   <CarouselItem>1</CarouselItem>
 *   <CarouselItem>2</CarouselItem>
 * </CarouselContent>
 */
function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/**
 * CarouselItemコンポーネント
 *
 * カルーセル内の各スライドを表すコンポーネントです。flexレイアウトで横並び（または縦並び）になり、アクセシビリティ属性も付与されます。
 *
 * @component
 * @param {Object} props - divのprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @param {React.ReactNode} props.children - スライドの内容
 * @returns {JSX.Element} カルーセルのスライド要素
 *
 * @example
 * <CarouselItem>画像やテキスト</CarouselItem>
 */
function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CarouselPreviousコンポーネント
 *
 * カルーセルの「前へ」ボタンを表すコンポーネントです。Embla CarouselのAPIを使って前のスライドへ移動します。
 * orientationに応じてボタン位置や回転が変わります。disabled状態も自動制御されます。
 *
 * @component
 * @param {Object} props - Buttonコンポーネントのprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @param {string} [props.variant] - ボタンのバリアント（デフォルト: outline）
 * @param {string} [props.size] - ボタンサイズ（デフォルト: icon）
 * @returns {JSX.Element} 前へ移動するボタン
 *
 * @example
 * <CarouselPrevious />
 *
 * @note
 * - disabled状態はcanScrollPrevで自動制御
 * - orientationで縦横の位置・回転が変化
 */
function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

/**
 * CarouselNextコンポーネント
 *
 * カルーセルの「次へ」ボタンを表すコンポーネントです。Embla CarouselのAPIを使って次のスライドへ移動します。
 * orientationに応じてボタン位置や回転が変わります。disabled状態も自動制御されます。
 *
 * @component
 * @param {Object} props - Buttonコンポーネントのprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @param {string} [props.variant] - ボタンのバリアント（デフォルト: outline）
 * @param {string} [props.size] - ボタンサイズ（デフォルト: icon）
 * @returns {JSX.Element} 次へ移動するボタン
 *
 * @example
 * <CarouselNext />
 *
 * @note
 * - disabled状態はcanScrollNextで自動制御
 * - orientationで縦横の位置・回転が変化
 */
function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
