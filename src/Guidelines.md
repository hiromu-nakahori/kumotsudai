# 供物台（Kumotsudai）運用管理ガイドライン

## 📋 目次

1. [概要](#概要)
2. [バージョン管理](#バージョン管理)
3. [開発環境](#開発環境)
4. [運用管理](#運用管理)
5. [パフォーマンス監視](#パフォーマンス監視)
6. [セキュリティ](#セキュリティ)
7. [アクセシビリティ](#アクセシビリティ)
8. [デバッグ](#デバッグ)
9. [トラブルシューティング](#トラブルシューティング)
10. [拡張・カスタマイズ](#拡張・カスタマイズ)

---

## 概要

### プロジェクト情報
- **プロジェクト名**: 供物台（Kumotsudai）
- **バージョン**: 1.0.0
- **技術スタック**: React 18 + TypeScript + Tailwind CSS v4.0
- **テーマ**: 日本の神秘的な森（秋・冬テーマ切り替え）
- **最終更新**: 2024-01-31

### アーキテクチャ概要
```
App.tsx (エントリーポイント)
├── AppProvider (グローバル状態管理)
├── UltraFastAppRouter (高速ルーティング)
├── LightErrorBoundary (エラーハンドリング)
└── 各画面コンポーネント
```

---

## バージョン管理

### ライブラリのバージョン指定について

**❌ バージョン指定は不要**
```typescript
// 不要なバージョン指定（削除済み）
import { toast } from 'sonner@2.0.3';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden@1.1.0';
```

**✅ 正しいインポート方法**
```typescript
// Figma Make環境では、バージョン指定なしで使用
import { toast } from 'sonner';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
```

### 理由
- Figma Make環境では、パッケージマネージャーが自動でバージョン管理
- バージョン指定によるコンフリクトを回避
- 最新の安定版を自動で使用

---

## 開発環境

### 推奨設定

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 開発者ツール

1. **パフォーマンス監視**
   - 左下のシステムステータスインジケーター
   - コンソールログでのメトリクス確認

2. **デバッグ情報**
   - 開発環境でのみ詳細ログ出力
   - エラー詳細の展開可能

---

## 運用管理

### 日常監視項目

#### 1. パフォーマンス監視
```typescript
// UltraPerformanceMonitor の使用例
UltraPerformanceMonitor.start('画面遷移');
// 処理実行
const duration = UltraPerformanceMonitor.end('画面遷移');
// 30ms以上で警告
```

**監視対象**
- 初期化時間: 15ms以下が目標
- 画面遷移: 30ms以下が目標
- API呼び出し: 100ms以下が目標

#### 2. エラー監視
```typescript
// LightErrorBoundary での監視
- JavaScript エラーの自動キャッチ
- 開発環境: 詳細スタックトレース
- 本番環境: ユーザーフレンドリーメッセージ
```

#### 3. セキュリティ監視
```typescript
// LightSecurityMonitor での監視
- HTTPS接続の確認
- XSS攻撃の防止
- 入力サニタイゼーション
```

### 定期メンテナンス

#### 週次チェック
- [ ] パフォーマンスメトリクスの確認
- [ ] エラーログの分析
- [ ] セキュリティアラートの確認
- [ ] ユーザーフィードバックの確認

#### 月次チェック
- [ ] 依存関係の更新確認
- [ ] アクセシビリティ監査
- [ ] パフォーマンス最適化
- [ ] セキュリティパッチの適用

---

## パフォーマンス監視

### 監視クラス: UltraPerformanceMonitor

```typescript
class UltraPerformanceMonitor {
  // パフォーマンス測定開始
  static start(label: string): void
  
  // パフォーマンス測定終了
  static end(label: string): number
  
  // 現在のメトリクス取得
  static getMetrics(): Map<string, number>
  
  // メトリクス初期化
  static reset(): void
}
```

### 使用例

```typescript
// 処理開始時
UltraPerformanceMonitor.start('データ取得');

// 重い処理
await fetchData();

// 処理終了時
const duration = UltraPerformanceMonitor.end('データ取得');

// 結果の評価
if (duration > 30) {
  console.warn('パフォーマンス警告: 最適化が必要');
}
```

### 最適化ガイドライン

1. **React最適化**
   - React.memo でコンポーネントメモ化
   - useCallback でコールバック最適化
   - useMemo で計算結果キャッシュ

2. **CSS最適化**
   - GPU アクセラレーション適用
   - トランジション時間短縮
   - 不要なアニメーション削除

3. **バンドル最適化**
   - Code Splitting の活用
   - 動的インポートの使用
   - 不要なライブラリの削除

---

## セキュリティ

### 監視クラス: LightSecurityMonitor

```typescript
class LightSecurityMonitor {
  // HTTPS接続確認
  static checkHTTPS(): boolean
  
  // 入力サニタイゼーション
  static sanitizeInput(input: string): string
  
  // キャッシュクリア
  static clearCache(): void
}
```

### セキュリティチェックリスト

#### 入力検証
- [ ] XSS攻撃の防止
- [ ] SQLインジェクション対策
- [ ] CSRFトークンの使用
- [ ] 入力値のサニタイゼーション

#### 通信セキュリティ
- [ ] HTTPS強制（本番環境）
- [ ] セキュリティヘッダーの設定
- [ ] API認証の実装
- [ ] レート制限の設定

#### データ保護
- [ ] 個人情報の適切な処理
- [ ] パスワードの暗号化
- [ ] セッション管理
- [ ] データの暗号化

---

## アクセシビリティ

### WCAG AAA準拠

#### 1. キーボードナビゲーション
```typescript
// キーボードショートカット例
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      // 検索フィールドにフォーカス
    }
  };
  // ...
}, []);
```

#### 2. スクリーンリーダー対応
```typescript
// ARIA ライブリージョン
<div 
  id="screen-announcer" 
  aria-live="polite" 
  aria-atomic="true" 
  className="sr-only"
/>
```

#### 3. コントラスト比
- 秋テーマ: 4.5:1 以上
- 冬テーマ: 7:1 以上（WCAG AAA準拠）

### アクセシビリティチェックリスト

#### 基本項目
- [ ] 全要素にフォーカス表示
- [ ] キーボードのみでの操作可能
- [ ] 適切なARIAラベル
- [ ] 十分なコントラスト比

#### 高度な項目
- [ ] スクリーンリーダーテスト
- [ ] 高コントラストモード対応
- [ ] 音声入力対応
- [ ] タッチターゲットサイズ（48px以上）

---

## デバッグ

### 開発環境でのデバッグ

#### 1. コンソールログ
```typescript
// パフォーマンスログ
console.info('✅ 初期化: 15ms');
console.warn('⚡ パフォーマンス警告: 処理が35ms');

// エラーログ
console.error('エラー境界でキャッチ:', error);
console.error('エラー情報:', errorInfo);
```

#### 2. システムステータス
- 左下のインジケーターで状態確認
- 緑: 正常、赤: 異常

#### 3. React Developer Tools
- コンポーネント階層の確認
- Props/Stateの監視
- レンダリング最適化の確認

### 本番環境でのデバッグ

#### 1. エラー追跡
```typescript
// 将来的な外部サービス連携
if (process.env.NODE_ENV === 'production') {
  // trackError(error, errorInfo);
}
```

#### 2. ユーザーフィードバック
- エラー発生時の自動レポート
- ユーザーの操作ログ
- パフォーマンスメトリクス

---

## トラブルシューティング

### よくある問題と対処法

#### 1. パフォーマンス低下
**症状**: 初期化時間が30ms以上
**原因**: 重い処理の同期実行
**対処法**: 
```typescript
// 並列処理で高速化
const [result1, result2] = await Promise.all([
  Promise.resolve(heavyProcess1()),
  Promise.resolve(heavyProcess2())
]);
```

#### 2. エラー境界が発火
**症状**: 白い画面でエラー表示
**原因**: JavaScript エラー
**対処法**: 
1. コンソールログでエラー詳細確認
2. React Developer Tools でコンポーネント確認
3. 該当コンポーネントの修正

#### 3. アクセシビリティ警告
**症状**: DialogTitle が不足
**原因**: Dialog コンポーネントの不適切な使用
**対処法**: 
```typescript
// 適切な DialogTitle の追加
<DialogContent>
  <DialogTitle>タイトル</DialogTitle>
  <DialogDescription>説明</DialogDescription>
  {/* コンテンツ */}
</DialogContent>
```

#### 4. セキュリティ警告
**症状**: HTTPS接続警告
**原因**: HTTP での本番環境アクセス
**対処法**: HTTPS の強制設定

---

## 拡張・カスタマイズ

### 新機能の追加

#### 1. 新しい画面の追加
```typescript
// 1. 画面コンポーネント作成
const NewScreen: React.FC = () => {
  // 実装
};

// 2. ルーターに追加
const renderScreen = useCallback(() => {
  switch (currentScreen) {
    case 'new':
      return <div {...commonProps}><NewScreen /></div>;
    // ...
  }
}, [currentScreen, theme]);

// 3. タイトル設定
const titles = {
  new: '供物台 - 新機能',
  // ...
};
```

#### 2. テーマの追加
```typescript
// globals.css で新テーマ定義
.spring-theme {
  --primary: #4ade80;
  --secondary: #10b981;
  // ...
}
```

#### 3. 新しい監視機能
```typescript
// 新しい監視クラス
class CustomMonitor {
  static trackFeature(feature: string): void {
    // 実装
  }
}
```

### カスタマイズガイドライン

#### 1. デザインシステム
- Tailwind CSS の変数を使用
- 一貫性のあるスペーシング
- アクセシビリティの確保

#### 2. パフォーマンス
- React.memo の適切な使用
- useCallback/useMemo の活用
- 不要なレンダリングの回避

#### 3. 国際化対応
```typescript
// 将来的な多言語対応
const translations = {
  ja: { welcome: 'ようこそ' },
  en: { welcome: 'Welcome' }
};
```

---

## まとめ

### 重要なポイント

1. **バージョン指定不要**: Figma Make環境では import 文にバージョン指定なし
2. **パフォーマンス重視**: 15ms以下の初期化時間を目標
3. **アクセシビリティ必須**: WCAG AAA準拠の実装
4. **エラーハンドリング**: 適切なエラー境界の設定
5. **セキュリティ**: XSS防止とHTTPS強制

### 運用チェックリスト

#### 日次
- [ ] エラーログの確認
- [ ] パフォーマンスメトリクス確認
- [ ] セキュリティアラート確認

#### 週次
- [ ] コード品質レビュー
- [ ] アクセシビリティチェック
- [ ] ユーザーフィードバック分析

#### 月次
- [ ] 依存関係更新
- [ ] セキュリティ監査
- [ ] パフォーマンス最適化

---

**最終更新**: 2024-01-31  
**バージョン**: 1.0.0  
**担当**: 供物台開発チーム