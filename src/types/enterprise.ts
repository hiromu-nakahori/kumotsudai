/**
 * ==============================================================================
 * 供物台（Kumotsudai）- エンタープライズ型定義ファイル
 * ==============================================================================
 * 
 * 【概要】
 * アプリケーション全体で使用される型定義を統一管理。
 * AWS統合、バックエンド連携を前提とした型安全な設計。
 * 
 * 【設計原則】
 * - 型安全性の最大化
 * - API レスポンス形式の統一
 * - バックエンドとの型共有
 * - 拡張性の確保
 * 
 * @version 2.1.0
 * @author 供物台開発チーム
 * @lastModified 2024-01-31
 */

// ============================================================================
// 基本型定義 (Basic Types)
// ============================================================================

/**
 * 基本ID型
 * UUID v4形式を前提とした文字列
 */
export type ID = string;

/**
 * タイムスタンプ型
 * ISO 8601形式の文字列
 */
export type Timestamp = string;

/**
 * URLリソース型
 */
export type URL = string;

/**
 * メールアドレス型
 */
export type Email = string;

/**
 * 日本語テキスト型
 */
export type JapaneseText = string;

// ============================================================================
// システム状態型定義 (System Status Types)
// ============================================================================

/**
 * システム状態インターフェース
 * 
 * @interface ISystemStatus
 */
export interface ISystemStatus {
  /** セキュリティ状態 */
  readonly security: boolean;
  
  /** パフォーマンス状態 */
  readonly performance: boolean;
  
  /** アクセシビリティ状態 */
  readonly accessibility: boolean;
  
  /** ネットワーク接続状態 */
  readonly network: boolean;
  
  /** 最終更新時刻 */
  readonly lastUpdate: Date;
}

/**
 * ログエントリインターフェース
 * AWS CloudWatch Logsとの連携用
 * 
 * @interface ILogEntry
 */
export interface ILogEntry {
  /** ログレベル */
  readonly level: 'debug' | 'info' | 'warn' | 'error';
  
  /** メッセージ */
  readonly message: string;
  
  /** タイムスタンプ */
  readonly timestamp: Date;
  
  /** ソース */
  readonly source: string;
  
  /** 追加データ */
  readonly data?: Record<string, any>;
  
  /** トレースID */
  readonly traceId?: string;
  
  /** ユーザーID */
  readonly userId?: string;
}

/**
 * パフォーマンスメトリクスインターフェース
 * AWS CloudWatchとの連携用
 * 
 * @interface IPerformanceMetrics
 */
export interface IPerformanceMetrics {
  /** 測定ラベル */
  readonly label: string;
  
  /** 開始時刻 */
  readonly startTime: number;
  
  /** 終了時刻 */
  readonly endTime?: number;
  
  /** 継続時間 */
  readonly duration?: number;
  
  /** メタデータ */
  readonly metadata?: Record<string, any>;
}

/**
 * エラー詳細インターフェース
 * 
 * @interface IErrorDetails
 */
export interface IErrorDetails {
  /** エラーコード */
  readonly code: string;
  
  /** エラーメッセージ */
  readonly message: string;
  
  /** スタックトレース */
  readonly stack?: string;
  
  /** 発生時刻 */
  readonly timestamp: Date;
  
  /** 追加情報 */
  readonly context?: Record<string, any>;
}

// ============================================================================
// API関連型定義 (API Types)
// ============================================================================

/**
 * API レスポンス基底型
 * AWS API Gateway のレスポンス形式に準拠
 * 
 * @template T レスポンスデータの型
 */
export interface IApiResponse<T = any> {
  /** 成功フラグ */
  success: boolean;
  
  /** レスポンスデータ */
  data?: T;
  
  /** エラー情報 */
  error?: {
    /** エラーコード */
    code: string;
    
    /** エラーメッセージ */
    message: string;
    
    /** 詳細情報 */
    details?: Record<string, any>;
  };
  
  /** リクエストID (X-Ray トレース用) */
  requestId: string;
  
  /** タイムスタンプ */
  timestamp: Timestamp;
  
  /** API バージョン */
  version: string;
}

/**
 * ページネーション情報
 * 
 * @interface IPagination
 */
export interface IPagination {
  /** 現在のページ番号 */
  currentPage: number;
  
  /** 1ページあたりのアイテム数 */
  itemsPerPage: number;
  
  /** 総アイテム数 */
  totalItems: number;
  
  /** 総ページ数 */
  totalPages: number;
  
  /** 次のページが存在するか */
  hasNext: boolean;
  
  /** 前のページが存在するか */
  hasPrevious: boolean;
}

/**
 * ソート情報
 * 
 * @interface ISortOptions
 */
export interface ISortOptions {
  /** ソートフィールド */
  field: string;
  
  /** ソート順序 */
  direction: 'asc' | 'desc';
}

// ============================================================================
// ユーザー関連型定義 (User Types)
// ============================================================================

/**
 * ユーザー基本情報
 * AWS Cognito属性に対応
 * 
 * @interface IUser
 */
export interface IUser {
  /** ユーザーID (Cognito UUID) */
  id: ID;
  
  /** ユーザー名 */
  username: string;
  
  /** 表示名 */
  displayName: string;
  
  /** メールアドレス */
  email: Email;
  
  /** プロフィール画像URL */
  avatarUrl?: URL;
  
  /** 所属組織 */
  organization?: string;
  
  /** 年代 */
  ageGroup?: '10代' | '20代' | '30代' | '40代' | '50代' | '60代以上';
  
  /** 自己紹介 */
  bio?: JapaneseText;
  
  /** アカウント作成日時 */
  createdAt: Timestamp;
  
  /** 最終更新日時 */
  updatedAt: Timestamp;
  
  /** 最終ログイン日時 */
  lastLoginAt?: Timestamp;
  
  /** アカウント状態 */
  status: 'active' | 'suspended' | 'deleted';
  
  /** 認証済みフラグ */
  isVerified: boolean;
  
  /** 権限レベル */
  role: 'user' | 'moderator' | 'admin';
}

// ============================================================================
// 供物関連型定義 (Offering Types)
// ============================================================================

/**
 * 供物カテゴリ
 */
export type OfferingCategory = 
  | '自然の恵み' 
  | '心の糧' 
  | '創作の実り' 
  | '学びの成果' 
  | '日常の発見'
  | '霊的体験';

/**
 * 供物状態
 */
export type OfferingStatus = 'draft' | 'published' | 'archived' | 'deleted';

/**
 * 供物基本情報
 * 
 * @interface IOffering
 */
export interface IOffering {
  /** 供物ID */
  id: ID;
  
  /** 投稿者ID */
  authorId: ID;
  
  /** 投稿者情報 */
  author: Pick<IUser, 'id' | 'displayName' | 'avatarUrl'>;
  
  /** タイトル */
  title: JapaneseText;
  
  /** 内容 */
  content: JapaneseText;
  
  /** カテゴリ */
  category: OfferingCategory;
  
  /** 添付画像URLs */
  imageUrls: URL[];
  
  /** タグ */
  tags: string[];
  
  /** 状態 */
  status: OfferingStatus;
  
  /** 公開範囲 */
  visibility: 'public' | 'followers' | 'private';
  
  /** 祈念数 */
  prayerCount: number;
  
  /** 導き数 */
  guidanceCount: number;
  
  /** 閲覧数 */
  viewCount: number;
  
  /** 投稿日時 */
  createdAt: Timestamp;
  
  /** 最終更新日時 */
  updatedAt: Timestamp;
  
  /** メタデータ */
  metadata?: {
    /** 投稿場所 */
    location?: string;
    
    /** 気象情報 */
    weather?: string;
    
    /** 季節タグ */
    season?: 'spring' | 'summer' | 'autumn' | 'winter';
  };
}

// ============================================================================
// インタラクション関連型定義 (Interaction Types)
// ============================================================================

/**
 * 祈念情報
 * 
 * @interface IPrayer
 */
export interface IPrayer {
  /** 祈念ID */
  id: ID;
  
  /** 供物ID */
  offeringId: ID;
  
  /** 祈念者ID */
  userId: ID;
  
  /** 祈念者情報 */
  user: Pick<IUser, 'id' | 'displayName' | 'avatarUrl'>;
  
  /** 祈念日時 */
  createdAt: Timestamp;
}

/**
 * 導きタイプ
 */
export type GuidanceType = 
  | '共感' 
  | '応援' 
  | '感謝' 
  | '質問' 
  | '提案' 
  | '学び';

/**
 * 導き情報
 * 
 * @interface IGuidance
 */
export interface IGuidance {
  /** 導きID */
  id: ID;
  
  /** 供物ID */
  offeringId: ID;
  
  /** 導き手ID */
  userId: ID;
  
  /** 導き手情報 */
  user: Pick<IUser, 'id' | 'displayName' | 'avatarUrl'>;
  
  /** 導きタイプ */
  type: GuidanceType;
  
  /** 導きの内容 */
  content: JapaneseText;
  
  /** 親導きID (返信の場合) */
  parentId?: ID;
  
  /** 返信数 */
  replyCount: number;
  
  /** 祈念数 */
  prayerCount: number;
  
  /** 投稿日時 */
  createdAt: Timestamp;
  
  /** 最終更新日時 */
  updatedAt: Timestamp;
}

// ============================================================================
// ランキング関連型定義 (Ranking Types)
// ============================================================================

/**
 * ランキング種別
 */
export type RankingType = 
  | 'trending'    // トレンド
  | 'popular'     // 人気
  | 'recent'      // 最新
  | 'prayers'     // 祈念数
  | 'guidance'    // 導き数
  | 'views';      // 閲覧数

/**
 * ランキング期間
 */
export type RankingPeriod = 
  | 'daily'       // 日間
  | 'weekly'      // 週間
  | 'monthly'     // 月間
  | 'yearly'      // 年間
  | 'all_time';   // 全期間

/**
 * ランキングアイテム
 * 
 * @interface IRankingItem
 */
export interface IRankingItem {
  /** ランク */
  rank: number;
  
  /** 供物情報 */
  offering: IOffering;
  
  /** スコア */
  score: number;
  
  /** 前回ランクからの変動 */
  rankChange: number;
  
  /** スコア詳細 */
  scoreBreakdown: {
    prayers: number;
    guidance: number;
    views: number;
    recency: number;
    engagement: number;
  };
}

// ============================================================================
// 通知関連型定義 (Notification Types)
// ============================================================================

/**
 * 通知タイプ
 */
export type NotificationType = 
  | 'prayer_received'       // 祈念を受けた
  | 'guidance_received'     // 導きを受けた
  | 'guidance_reply'        // 導きに返信があった
  | 'follower_new'          // 新しいフォロワー
  | 'offering_featured'     // 供物が注目された
  | 'system_announcement'   // システムお知らせ
  | 'maintenance';          // メンテナンス通知

/**
 * 通知情報
 * 
 * @interface INotification
 */
export interface INotification {
  /** 通知ID */
  id: ID;
  
  /** 受信者ID */
  userId: ID;
  
  /** 通知タイプ */
  type: NotificationType;
  
  /** タイトル */
  title: JapaneseText;
  
  /** 内容 */
  content: JapaneseText;
  
  /** アクションURL */
  actionUrl?: URL;
  
  /** 関連データ */
  relatedData?: {
    offeringId?: ID;
    guidanceId?: ID;
    userId?: ID;
  };
  
  /** 既読フラグ */
  isRead: boolean;
  
  /** 作成日時 */
  createdAt: Timestamp;
  
  /** 既読日時 */
  readAt?: Timestamp;
}

// ============================================================================
// システム関連型定義 (System Types)
// ============================================================================

/**
 * アプリケーション設定
 * 
 * @interface IAppSettings
 */
export interface IAppSettings {
  /** テーマ */
  theme: 'autumn' | 'winter' | 'auto';
  
  /** 言語 */
  language: 'ja' | 'en';
  
  /** タイムゾーン */
  timezone: string;
  
  /** 通知設定 */
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    types: NotificationType[];
  };
  
  /** プライバシー設定 */
  privacy: {
    showEmail: boolean;
    showOrganization: boolean;
    showAgeGroup: boolean;
    allowFollowing: boolean;
    publicProfile: boolean;
  };
  
  /** 表示設定 */
  display: {
    itemsPerPage: number;
    showThumbnails: boolean;
    compactMode: boolean;
    autoPlay: boolean;
  };
}

/**
 * システム状態
 * 
 * @interface ISystemHealth
 */
export interface ISystemHealth {
  /** 全体ステータス */
  overall: 'healthy' | 'degraded' | 'critical';
  
  /** サービス別ステータス */
  services: {
    api: 'up' | 'down' | 'slow';
    database: 'up' | 'down' | 'slow';
    storage: 'up' | 'down' | 'slow';
    search: 'up' | 'down' | 'slow';
    notifications: 'up' | 'down' | 'slow';
  };
  
  /** パフォーマンス指標 */
  metrics: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    availability: number;
  };
  
  /** 最終チェック時刻 */
  lastCheckAt: Timestamp;
  
  /** メンテナンス情報 */
  maintenance?: {
    scheduled: boolean;
    startTime: Timestamp;
    endTime: Timestamp;
    description: JapaneseText;
  };
}

// ============================================================================
// バックエンド統合型定義 (Backend Integration Types)
// ============================================================================

/**
 * AWS Cognito ユーザー情報
 * 
 * @interface ICognitoUser
 */
export interface ICognitoUser {
  /** Cognito ユーザーID */
  cognitoId: string;
  
  /** ユーザー名 */
  username: string;
  
  /** 属性 */
  attributes: {
    email: string;
    email_verified: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    'custom:organization'?: string;
    'custom:age_group'?: string;
  };
  
  /** グループ */
  groups: string[];
  
  /** トークン情報 */
  tokens: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

/**
 * WebSocket メッセージ
 * 
 * @interface IWebSocketMessage
 */
export interface IWebSocketMessage {
  /** メッセージタイプ */
  type: 'prayer' | 'guidance' | 'notification' | 'heartbeat' | 'error';
  
  /** ペイロード */
  payload: any;
  
  /** タイムスタンプ */
  timestamp: Timestamp;
  
  /** メッセージID */
  messageId: string;
  
  /** 送信者ID */
  senderId?: ID;
}

// ============================================================================
// コンポーネント Props 型定義 (Component Props Types)
// ============================================================================

/**
 * ローディング画面コンポーネントのProps
 * 
 * @interface ILoadingScreenProps
 */
export interface ILoadingScreenProps {
  /** テーマ */
  theme: 'autumn' | 'winter';
  
  /** 進捗状況 (0-100) */
  progress?: number;
  
  /** 現在のステージ */
  stage?: string;
}

/**
 * エラー境界コンポーネントの状態
 * 
 * @interface IErrorBoundaryState
 */
export interface IErrorBoundaryState {
  /** エラー発生フラグ */
  hasError: boolean;
  
  /** エラーオブジェクト */
  error: Error | null;
  
  /** エラー詳細 */
  errorDetails: IErrorDetails | null;
  
  /** 復旧試行回数 */
  retryCount: number;
}

/**
 * エラー境界コンポーネントのProps
 * 
 * @interface IErrorBoundaryProps
 */
export interface IErrorBoundaryProps {
  /** 子要素 */
  children: React.ReactNode;
  
  /** フォールバックコンポーネント */
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

// ============================================================================
// エクスポート型定義 (Export Types)
// ============================================================================

/**
 * 全ての型を含む名前空間
 * 
 * @namespace KumotsudaiTypes
 */
export namespace KumotsudaiTypes {
  export type User = IUser;
  export type Offering = IOffering;
  export type Prayer = IPrayer;
  export type Guidance = IGuidance;
  export type Notification = INotification;
  export type AppSettings = IAppSettings;
  export type SystemHealth = ISystemHealth;
  export type CognitoUser = ICognitoUser;
  export type WebSocketMessage = IWebSocketMessage;
  export type SystemStatus = ISystemStatus;
  export type LogEntry = ILogEntry;
  export type PerformanceMetrics = IPerformanceMetrics;
  export type ErrorDetails = IErrorDetails;
  export type LoadingScreenProps = ILoadingScreenProps;
  export type ErrorBoundaryState = IErrorBoundaryState;
  export type ErrorBoundaryProps = IErrorBoundaryProps;
  export type ApiResponse<T = any> = IApiResponse<T>;
  export type Pagination = IPagination;
  export type SortOptions = ISortOptions;
  export type RankingItem = IRankingItem;
}

/**
 * デフォルトエクスポート
 */
export default KumotsudaiTypes;