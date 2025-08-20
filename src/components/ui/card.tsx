import * as React from "react";

import { cn } from "./utils";

/**
 * Cardコンポーネント
 *
 * カードUIのベースとなるコンテナ要素です。背景色、枠線、角丸、テキスト色などのスタイルが適用されます。
 * 子要素としてヘッダー、コンテンツ、フッターなどを自由に配置できます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（div要素のpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} カードのコンテナ要素
 *
 * @example
 * <Card>
 *   <CardHeader />
 *   <CardContent />
 *   <CardFooter />
 * </Card>
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardHeaderコンポーネント
 *
 * カードのヘッダー領域を表します。タイトルや説明、アクションボタンなどを配置できます。
 * グリッドレイアウトでタイトル・説明・アクションを整列します。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（div要素のpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} カードのヘッダー要素
 *
 * @example
 * <CardHeader>
 *   <CardTitle>タイトル</CardTitle>
 *   <CardDescription>説明文</CardDescription>
 *   <CardAction>...</CardAction>
 * </CardHeader>
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardTitleコンポーネント
 *
 * カードのタイトルを表示します。h4要素としてレンダリングされ、見出しとして利用できます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（div要素のpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} カードタイトル要素
 *
 * @example
 * <CardTitle>カードのタイトル</CardTitle>
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

/**
 * CardDescriptionコンポーネント
 *
 * カードの説明文やサブタイトルを表示します。テキスト色が控えめ（muted）になります。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（div要素のpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} カード説明要素
 *
 * @example
 * <CardDescription>このカードの説明文です。</CardDescription>
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

/**
 * CardActionコンポーネント
 *
 * カードヘッダー内のアクション領域（例: ボタン、アイコンなど）を表示します。
 * グリッドの右上に配置されます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（div要素のpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} カードアクション要素
 *
 * @example
 * <CardAction>
 *   <Button>編集</Button>
 * </CardAction>
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CardContentコンポーネント
 *
 * カードの主な内容領域を表します。テキストや画像、フォームなどを配置できます。
 * パディングが適用され、最後の子要素の場合は下部パディングも追加されます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（div要素のpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} カードコンテンツ要素
 *
 * @example
 * <CardContent>
 *   <p>詳細情報</p>
 * </CardContent>
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

/**
 * CardFooterコンポーネント
 *
 * カードのフッター領域を表します。アクションボタンや補足情報などを配置できます。
 * 下部パディングと、境界線がある場合は上部パディングも追加されます。
 *
 * @component
 * @param {Object} props - コンポーネントに渡すprops（div要素のpropsを継承）
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} カードフッター要素
 *
 * @example
 * <CardFooter>
 *   <Button>保存</Button>
 * </CardFooter>
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
