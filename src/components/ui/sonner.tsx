"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

/**
 * Toasterコンポーネント
 *
 * アプリケーション全体で利用可能なトースト通知（Sonnerライブラリ）を表示するためのラッパーコンポーネントです。
 * Next.jsの`next-themes`を利用して、現在のテーマ（light/dark/system）に応じてトーストの見た目を自動的に切り替えます。
 * また、カスタムCSS変数を用いて背景色・テキスト色・ボーダー色を調整しています。
 *
 * @component
 * @param {ToasterProps} props - SonnerのToasterコンポーネントに渡すprops。通知の位置や表示時間などを指定可能です。
 * @returns {JSX.Element} トースト通知の表示領域
 *
 * @example
 * <Toaster position="top-right" richColors closeButton />
 *
 * @note
 * - テーマは`next-themes`のuseThemeから取得し、Sonnerのthemeプロパティに渡されます。
 * - CSS変数（--normal-bg, --normal-text, --normal-border）で通知のスタイルをカスタマイズしています。
 * - 必ず`"use client"`ディレクティブが必要です（クライアントコンポーネント）。
 * - SonnerのToasterPropsをすべて受け付けます。
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
