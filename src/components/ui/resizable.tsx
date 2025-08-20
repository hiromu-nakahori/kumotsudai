"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "./utils";

/**
 * ResizablePanelGroupコンポーネント
 *
 * 複数のパネルをグループ化し、ドラッグでサイズ変更可能なレイアウトを構築します。
 * `react-resizable-panels`のPanelGroupをラップし、flexレイアウトや方向（縦/横）に応じたスタイルを自動付与します。
 *
 * @component
 * @param {Object} props - PanelGroupに渡すprops
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでflexレイアウトが適用されます。
 * @returns {JSX.Element} サイズ変更可能なパネルグループ
 *
 * @example
 * <ResizablePanelGroup direction="horizontal">
 *   <ResizablePanel>左パネル</ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel>右パネル</ResizablePanel>
 * </ResizablePanelGroup>
 *
 * @note
 * - PanelGroupのdirection（horizontal/vertical）に応じてレイアウトが切り替わります。
 * - 子要素としてResizablePanelやResizableHandleを配置してください。
 */
function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

/**
 * ResizablePanelコンポーネント
 *
 * サイズ変更可能なパネル領域を表します。`react-resizable-panels`のPanelをラップしています。
 * PanelGroupの子要素として配置し、内容を自由に記述できます。
 *
 * @component
 * @param {Object} props - Panelに渡すprops
 * @returns {JSX.Element} サイズ変更可能なパネル
 *
 * @example
 * <ResizablePanel>ここにコンテンツ</ResizablePanel>
 *
 * @note
 * - PanelGroupの中で使用してください。
 * - minSize, defaultSize, collapsibleなどのpropsを渡すことで動作をカスタマイズできます。
 */
function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

/**
 * ResizableHandleコンポーネント
 *
 * パネル間のサイズ変更用ハンドルを表します。`react-resizable-panels`のPanelResizeHandleをラップし、
 * オプションでGripVerticalIcon（つまみアイコン）を表示できます。
 * ハンドルは方向（縦/横）に応じて自動でスタイルが切り替わります。
 *
 * @component
 * @param {Object} props - PanelResizeHandleに渡すprops
 * @param {boolean} [props.withHandle] - trueの場合、GripVerticalIcon（つまみアイコン）を表示します。
 * @param {string} [props.className] - 追加のCSSクラス。デフォルトでハンドルのスタイルが付与されます。
 * @returns {JSX.Element} サイズ変更用ハンドル
 *
 * @example
 * <ResizableHandle withHandle />
 *
 * @note
 * - アクセシビリティ: フォーカスリングやキーボード操作に対応しています。
 * - direction（vertical/horizontal）に応じて自動でスタイルが切り替わります。
 * - withHandleをtrueにすると、つまみアイコンが表示されます。
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
