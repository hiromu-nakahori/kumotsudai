"use client";

import * as React from "react";

import { cn } from "./utils";

/**
 * Tableコンポーネント
 *
 * テーブル全体のラッパーコンポーネントです。横スクロール対応のコンテナ内にテーブル要素を表示します。
 * Tailwind CSSによるスタイリングが適用されており、caption（キャプション）を下部に表示できます。
 *
 * @component
 * @param {Object} props - テーブル要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} テーブル要素
 *
 * @example
 * <Table>
 *   <TableHeader>...</TableHeader>
 *   <TableBody>...</TableBody>
 * </Table>
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

/**
 * TableHeaderコンポーネント
 *
 * テーブルのヘッダー（thead）部分を表します。tr要素に下線（border-b）が自動で付与されます。
 *
 * @component
 * @param {Object} props - thead要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} テーブルヘッダー要素
 *
 * @example
 * <TableHeader>
 *   <TableRow>
 *     <TableHead>タイトル</TableHead>
 *   </TableRow>
 * </TableHeader>
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

/**
 * TableBodyコンポーネント
 *
 * テーブルの本体（tbody）部分を表します。最後のtr要素には下線（border）が付きません。
 *
 * @component
 * @param {Object} props - tbody要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} テーブル本体要素
 *
 * @example
 * <TableBody>
 *   <TableRow>
 *     <TableCell>データ</TableCell>
 *   </TableRow>
 * </TableBody>
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

/**
 * TableFooterコンポーネント
 *
 * テーブルのフッター（tfoot）部分を表します。背景色や上部ボーダー、太字などのスタイルが付与されます。
 *
 * @component
 * @param {Object} props - tfoot要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} テーブルフッター要素
 *
 * @example
 * <TableFooter>
 *   <TableRow>
 *     <TableCell>合計</TableCell>
 *   </TableRow>
 * </TableFooter>
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * TableRowコンポーネント
 *
 * テーブルの行（tr）を表します。ホバー時や選択状態（data-state=selected）で背景色が変化します。
 * 下線（border-b）が自動で付き、色のトランジションも有効です。
 *
 * @component
 * @param {Object} props - tr要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} テーブル行要素
 *
 * @example
 * <TableRow>
 *   <TableCell>データ</TableCell>
 * </TableRow>
 *
 * @note
 * - data-state=selected 属性で選択状態のスタイルが適用されます。
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

/**
 * TableHeadコンポーネント
 *
 * テーブルヘッダーセル（th）を表します。左寄せ、太字、余白、改行禁止などのスタイルが付与されます。
 * チェックボックスを含む場合のスタイル調整も自動で行われます。
 *
 * @component
 * @param {Object} props - th要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} テーブルヘッダーセル要素
 *
 * @example
 * <TableHead>タイトル</TableHead>
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * TableCellコンポーネント
 *
 * テーブルデータセル（td）を表します。余白、中央揃え、改行禁止などのスタイルが付与されます。
 * チェックボックスを含む場合のスタイル調整も自動で行われます。
 *
 * @component
 * @param {Object} props - td要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} テーブルデータセル要素
 *
 * @example
 * <TableCell>データ</TableCell>
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * TableCaptionコンポーネント
 *
 * テーブルのキャプション（caption）を表します。下部に小さく表示され、補足説明などに利用できます。
 *
 * @component
 * @param {Object} props - caption要素に渡すprops
 * @param {string} [props.className] - 追加のCSSクラス
 * @returns {JSX.Element} テーブルキャプション要素
 *
 * @example
 * <TableCaption>このテーブルはサンプルです</TableCaption>
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
