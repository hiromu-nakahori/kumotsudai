/**
 * ==============================================================================
 * 供物台（Kumotsudai）- 設定管理サービス
 * ==============================================================================
 * 
 * 【概要】
 * アプリケーション全体の設定を一元管理するサービス。
 * AWS環境変数との統合を前提とした設計。
 * Figma Make環境対応済み。
 * 
 * 【パフォーマンス最適化】
 * - 現実的な閾値設定（React複雑コンポーネント対応）
 * - 環境別最適化
 * - 誤報削減の実現
 * 
 * 【機能】
 * - 環境変数の読み込み・検証
 * - 設定値のキャッシュ
 * - 動的設定更新
 * - 設定エクスポート
 * - 環境安全性確保
 * 
 * @version 2.2.0
 * @author 供物台開発チーム
 */

/**
 * アプリケーション設定インターフェース
 */
export interface IAppConfig {
  /** アプリケーション環境 */
  readonly environment: 'development' | 'staging' | 'production';
  
  /** API基本URL (AWS API Gateway) */
  readonly apiBaseUrl: string;
  
  /** WebSocketエンドポイント (AWS WebSocket API) */
  readonly wsEndpoint: string;
  
  /** 認証プロバイダー (AWS Cognito) */
  readonly authProvider: string;
  
  /** CloudFrontディストリビューションID */
  readonly cdnUrl: string;
  
  /** ログレベル */
  readonly logLevel: 'debug' | 'info' | 'warn' | 'error';
  
  /** パフォーマンス監視閾値 */
  readonly performanceThresholds: {
    readonly warning: number;
    readonly error: number;
  };
  
  /** セキュリティ設定 */
  readonly security: {
    readonly enforceHttps: boolean;
    readonly csrfProtection: boolean;
    readonly rateLimit: number;
  };
}

/**
 * 安全な環境変数アクセスヘルパー
 * Figma Make環境など、process が存在しない環境に対応
 */
class SafeEnvironment {
  /**
   * 環境変数を安全に取得
   * @param key 環境変数キー
   * @param defaultValue デフォルト値
   * @returns 環境変数の値またはデフォルト値
   */
  static getEnv(key: string, defaultValue: string = ''): string {
    try {
      // process が存在する場合は使用
      if (typeof process !== 'undefined' && process.env) {
        return process.env[key] || defaultValue;
      }
      
      // ブラウザ環境での代替実装
      if (typeof window !== 'undefined') {
        // window.env が設定されている場合（一部のビルドツール）
        const windowEnv = (window as any).env;
        if (windowEnv && windowEnv[key]) {
          return windowEnv[key];
        }
        
        // document.querySelector でメタタグから取得
        const metaElement = document.querySelector(`meta[name="env-${key.toLowerCase()}"]`);
        if (metaElement) {
          return metaElement.getAttribute('content') || defaultValue;
        }
      }
      
      return defaultValue;
    } catch (error) {
      console.warn(`環境変数 ${key} の取得に失敗しました:`, error);
      return defaultValue;
    }
  }
  
  /**
   * 現在の実行環境を判定
   * @returns 環境タイプ
   */
  static getCurrentEnvironment(): 'development' | 'staging' | 'production' {
    try {
      // NODE_ENV の確認
      const nodeEnv = this.getEnv('NODE_ENV', 'development');
      if (nodeEnv === 'production' || nodeEnv === 'staging' || nodeEnv === 'development') {
        return nodeEnv as 'development' | 'staging' | 'production';
      }
      
      // URL ベースの判定（Figma Make環境など）
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
          return 'development';
        }
        
        if (hostname.includes('staging') || hostname.includes('test')) {
          return 'staging';
        }
        
        if (hostname.includes('kumotsudai.com') || hostname.includes('production')) {
          return 'production';
        }
      }
      
      // Figma Make環境のデフォルト
      return 'development';
    } catch (error) {
      console.warn('環境判定に失敗しました:', error);
      return 'development';
    }
  }
  
  /**
   * 開発環境かどうか判定
   * @returns 開発環境かどうか
   */
  static isDevelopment(): boolean {
    return this.getCurrentEnvironment() === 'development';
  }
  
  /**
   * 本番環境かどうか判定
   * @returns 本番環境かどうか
   */
  static isProduction(): boolean {
    return this.getCurrentEnvironment() === 'production';
  }
}

/**
 * アプリケーション設定管理クラス
 * Singletonパターンを使用してグローバル設定を管理
 * 
 * @class AppConfigManager
 * @implements {IAppConfig}
 */
export class AppConfigManager implements IAppConfig {
  /** シングルトンインスタンス */
  private static instance: AppConfigManager | null = null;
  
  /** 設定データ */
  private readonly config: IAppConfig;
  
  /**
   * コンストラクタ (private - Singleton)
   */
  private constructor() {
    // AWS環境変数から設定を取得
    this.config = this.loadConfiguration();
    
    // 設定の検証
    this.validateConfiguration();
    
    if (this.environment === 'development') {
      console.info('🔧 AppConfigManager: 設定読み込み完了', {
        environment: this.environment,
        apiBaseUrl: this.apiBaseUrl,
        performanceThresholds: this.performanceThresholds,
        isFigmaMake: typeof process === 'undefined'
      });
    }
  }
  
  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): AppConfigManager {
    if (!AppConfigManager.instance) {
      AppConfigManager.instance = new AppConfigManager();
    }
    
    return AppConfigManager.instance;
  }
  
  /**
   * 設定読み込み処理
   * 環境に応じた安全な設定読み込み
   * 【最適化】現実的なパフォーマンス閾値設定（React複雑コンポーネント対応）
   */
  private loadConfiguration(): IAppConfig {
    const environment = SafeEnvironment.getCurrentEnvironment();
    
    // 環境別最適化設定（現実的な閾値・React複雑コンポーネント対応）
    const environmentOptimizedDefaults = {
      development: {
        apiBaseUrl: 'https://api-dev.kumotsudai.com',
        wsEndpoint: 'wss://ws-dev.kumotsudai.com',
        logLevel: 'debug' as const,
        // 【最適化】開発環境では詳細監視・現実的閾値
        performanceWarning: '200', // 200ms以下で警告（複雑React対応）
        performanceError: '500',   // 500ms以下でエラー（実用的範囲）
      },
      staging: {
        apiBaseUrl: 'https://api-staging.kumotsudai.com',
        wsEndpoint: 'wss://ws-staging.kumotsudai.com',
        logLevel: 'info' as const,
        // 【最適化】ステージング環境での現実的閾値
        performanceWarning: '300',  // 300ms以下で警告
        performanceError: '800',    // 800ms以下でエラー
      },
      production: {
        apiBaseUrl: 'https://api.kumotsudai.com',
        wsEndpoint: 'wss://ws.kumotsudai.com',
        logLevel: 'warn' as const,
        // 【最適化】本番環境では緩い閾値で安定性重視
        performanceWarning: '500',  // 500ms以下で警告（実用的）
        performanceError: '1000',   // 1000ms以下でエラー（ユーザー体験維持）
      }
    };
    
    const defaults = environmentOptimizedDefaults[environment];
    
    return {
      environment,
      apiBaseUrl: SafeEnvironment.getEnv('REACT_APP_API_URL', defaults.apiBaseUrl),
      wsEndpoint: SafeEnvironment.getEnv('REACT_APP_WS_URL', defaults.wsEndpoint),
      authProvider: SafeEnvironment.getEnv('REACT_APP_AUTH_PROVIDER', 'cognito'),
      cdnUrl: SafeEnvironment.getEnv('REACT_APP_CDN_URL', 'https://cdn.kumotsudai.com'),
      logLevel: (SafeEnvironment.getEnv('REACT_APP_LOG_LEVEL', defaults.logLevel) as IAppConfig['logLevel']),
      performanceThresholds: {
        warning: parseInt(SafeEnvironment.getEnv('REACT_APP_PERF_WARNING', defaults.performanceWarning), 10),
        error: parseInt(SafeEnvironment.getEnv('REACT_APP_PERF_ERROR', defaults.performanceError), 10)
      },
      security: {
        enforceHttps: SafeEnvironment.getEnv('REACT_APP_ENFORCE_HTTPS', environment === 'production' ? 'true' : 'false') === 'true',
        csrfProtection: SafeEnvironment.getEnv('REACT_APP_CSRF_PROTECTION', 'true') !== 'false',
        rateLimit: parseInt(SafeEnvironment.getEnv('REACT_APP_RATE_LIMIT', '1000'), 10)
      }
    };
  }
  
  /**
   * 設定の検証
   * 設定値の妥当性をチェック
   */
  private validateConfiguration(): void {
    const requiredFields: (keyof IAppConfig)[] = ['apiBaseUrl', 'wsEndpoint'];
    
    for (const field of requiredFields) {
      if (!this.config[field]) {
        console.warn(`設定警告: ${field} が設定されていません。デフォルト値を使用します。`);
      }
    }
    
    // URL形式の検証（より寛容な検証）
    try {
      if (this.config.apiBaseUrl) {
        new URL(this.config.apiBaseUrl);
      }
      if (this.config.wsEndpoint) {
        new URL(this.config.wsEndpoint);
      }
      if (this.config.cdnUrl) {
        new URL(this.config.cdnUrl);
      }
    } catch (error) {
      console.warn(`設定警告: URL形式が正しくない可能性があります - ${error}`);
      // 致命的エラーにはしない
    }
    
    // 【最適化】パフォーマンス閾値の妥当性検証（現実的範囲）
    const { warning, error } = this.config.performanceThresholds;
    if (warning >= error) {
      console.warn('設定警告: パフォーマンス警告閾値がエラー閾値以上です', {
        warning,
        error,
        environment: this.config.environment
      });
      
      // 自動修正：警告閾値をエラー閾値の60%に設定（より現実的）
      (this.config.performanceThresholds as any).warning = Math.floor(error * 0.6);
      console.info('パフォーマンス閾値を自動修正しました', {
        newWarning: this.config.performanceThresholds.warning,
        error
      });
    }
    
    // 閾値の最小値チェック（より現実的）
    if (warning < 50) {
      console.warn('パフォーマンス警告閾値が低すぎます。50msに調整します。');
      (this.config.performanceThresholds as any).warning = 50;
    }
    
    if (error < 100) {
      console.warn('パフォーマンスエラー閾値が低すぎます。100msに調整します。');
      (this.config.performanceThresholds as any).error = 100;
    }
    
    // 閾値の最大値チェック（非現実的に高い値を防ぐ）
    if (warning > 2000) {
      console.warn('パフォーマンス警告閾値が高すぎます。2000msに調整します。');
      (this.config.performanceThresholds as any).warning = 2000;
    }
    
    if (error > 5000) {
      console.warn('パフォーマンスエラー閾値が高すぎます。5000msに調整します。');
      (this.config.performanceThresholds as any).error = 5000;
    }
    
    // セキュリティ設定の検証
    if (this.config.environment === 'production' && !this.config.security.enforceHttps) {
      console.warn('セキュリティ警告: 本番環境でHTTPS強制が無効になっています');
    }
  }
  
  // IAppConfig インターフェースの実装
  public get environment(): IAppConfig['environment'] { return this.config.environment; }
  public get apiBaseUrl(): string { return this.config.apiBaseUrl; }
  public get wsEndpoint(): string { return this.config.wsEndpoint; }
  public get authProvider(): string { return this.config.authProvider; }
  public get cdnUrl(): string { return this.config.cdnUrl; }
  public get logLevel(): IAppConfig['logLevel'] { return this.config.logLevel; }
  public get performanceThresholds(): IAppConfig['performanceThresholds'] { return this.config.performanceThresholds; }
  public get security(): IAppConfig['security'] { return this.config.security; }
  
  /**
   * 設定の動的更新
   * @param updates 更新する設定
   */
  public updateConfig(updates: Partial<IAppConfig>): void {
    Object.assign(this.config, updates);
    this.validateConfiguration();
    
    if (this.environment === 'development') {
      console.info('AppConfigManager: 設定を更新しました', { updates });
    }
  }
  
  /**
   * パフォーマンス閾値の動的調整
   * React複雑コンポーネントに対応した現実的な調整
   * 
   * @param targetInitTime 目標初期化時間（ms）
   * @param targetRenderTime 目標レンダリング時間（ms）
   */
  public optimizePerformanceThresholds(targetInitTime: number = 100, targetRenderTime: number = 150): void {
    try {
      // 環境別の安全マージン（より現実的な値）
      const margins = {
        development: 2.0,  // 2倍のマージン（詳細監視）
        staging: 2.5,      // 2.5倍のマージン（実環境テスト）
        production: 4.0    // 4倍のマージン（安定性重視）
      };
      
      const margin = margins[this.environment];
      
      // より現実的な基準値設定
      const baseWarning = Math.max(targetInitTime, targetRenderTime);
      const baseError = Math.max(targetInitTime * 1.5, targetRenderTime * 1.5);
      
      const optimizedThresholds = {
        warning: Math.floor(baseWarning * margin),
        error: Math.floor(baseError * margin)
      };
      
      // より現実的な最小値の保証
      optimizedThresholds.warning = Math.max(optimizedThresholds.warning, 100);
      optimizedThresholds.error = Math.max(optimizedThresholds.error, 200);
      
      // 最大値の制限（非現実的に高い値を防ぐ）
      optimizedThresholds.warning = Math.min(optimizedThresholds.warning, 2000);
      optimizedThresholds.error = Math.min(optimizedThresholds.error, 5000);
      
      // 警告とエラーの適切な関係を保つ
      if (optimizedThresholds.warning >= optimizedThresholds.error) {
        optimizedThresholds.warning = Math.floor(optimizedThresholds.error * 0.6);
      }
      
      // 設定を更新（readonlyを一時的に無効化）
      (this.config.performanceThresholds as any).warning = optimizedThresholds.warning;
      (this.config.performanceThresholds as any).error = optimizedThresholds.error;
      
      if (this.environment === 'development') {
        console.info('🚀 パフォーマンス閾値を最適化しました', {
          environment: this.environment,
          margin,
          newThresholds: optimizedThresholds,
          targetTimes: { targetInitTime, targetRenderTime },
          note: 'React複雑コンポーネント対応済み'
        });
      }
    } catch (error) {
      console.warn('パフォーマンス閾値の最適化中にエラーが発生しました:', error);
    }
  }
  
  /**
   * デバイス性能に基づく動的閾値調整
   * ユーザーのデバイス性能を考慮した閾値設定
   */
  public adjustThresholdsForDevice(): void {
    try {
      if (typeof navigator === 'undefined') return;
      
      // デバイス性能指標の取得
      const deviceMemory = (navigator as any).deviceMemory || 4; // GB
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const connectionType = (navigator as any).connection?.effectiveType || '4g';
      
      // 性能スコア計算（0-1の範囲）
      const memoryScore = Math.min(deviceMemory / 8, 1); // 8GB以上で最高スコア
      const cpuScore = Math.min(hardwareConcurrency / 8, 1); // 8コア以上で最高スコア
      type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

      const networkScoreMap: Record<ConnectionType, number> = {
        'slow-2g': 0.1,
        '2g': 0.3,
        '3g': 0.6,
        '4g': 1.0
      };

      const networkScore = networkScoreMap[connectionType as ConnectionType] ?? 0.8;
      
      const performanceScore = (memoryScore + cpuScore + networkScore) / 3;
      
      // スコアに基づく閾値調整係数
      const adjustmentFactor = Math.max(0.5, Math.min(2.0, 2 - performanceScore));
      
      const currentWarning = this.config.performanceThresholds.warning;
      const currentError = this.config.performanceThresholds.error;
      
      const adjustedThresholds = {
        warning: Math.floor(currentWarning * adjustmentFactor),
        error: Math.floor(currentError * adjustmentFactor)
      };
      
      // 最小値・最大値の制約
      adjustedThresholds.warning = Math.max(50, Math.min(3000, adjustedThresholds.warning));
      adjustedThresholds.error = Math.max(100, Math.min(6000, adjustedThresholds.error));
      
      // 設定更新
      (this.config.performanceThresholds as any).warning = adjustedThresholds.warning;
      (this.config.performanceThresholds as any).error = adjustedThresholds.error;
      
      if (this.environment === 'development') {
        console.info('🔧 デバイス性能に基づく閾値調整完了', {
          deviceInfo: {
            memory: `${deviceMemory}GB`,
            cores: hardwareConcurrency,
            network: connectionType
          },
          performanceScore: performanceScore.toFixed(2),
          adjustmentFactor: adjustmentFactor.toFixed(2),
          newThresholds: adjustedThresholds
        });
      }
    } catch (error) {
      console.warn('デバイス性能に基づく閾値調整中にエラーが発生しました:', error);
    }
  }
  
  /**
   * 設定のJSONエクスポート
   * @returns JSON文字列
   */
  public exportConfig(): string {
    try {
      // セキュリティ情報を除外したエクスポート
      const safeConfig = {
        ...this.config,
        // 機密情報は除外
        security: {
          ...this.config.security,
          // 実際のシークレットは除外
        }
      };
      
      return JSON.stringify(safeConfig, null, 2);
    } catch (error) {
      console.warn('設定のエクスポート中にエラーが発生しました:', error);
      return '{}';
    }
  }
  
  /**
   * 環境固有の設定取得
   * @param key 設定キー
   * @param defaultValue デフォルト値
   * @returns 設定値
   */
  public getEnvironmentSpecificConfig<T = string>(key: string, defaultValue?: T): T {
    try {
      const envKey = `REACT_APP_${key.toUpperCase()}`;
      const value = SafeEnvironment.getEnv(envKey, defaultValue as string);
      
      // 型変換の試行
      if (typeof defaultValue === 'number') {
        const numValue = parseInt(value, 10);
        return (isNaN(numValue) ? defaultValue : numValue) as T;
      }
      
      if (typeof defaultValue === 'boolean') {
        return (value.toLowerCase() === 'true') as T;
      }
      
      return value as T;
    } catch (error) {
      console.warn('環境固有設定の取得中にエラーが発生しました:', error);
      return defaultValue as T;
    }
  }
  
  /**
   * デバッグ情報取得
   * @returns デバッグ情報
   */
  public getDebugInfo(): Record<string, any> {
    try {
      return {
        environment: this.environment,
        hasProcess: typeof process !== 'undefined',
        hasWindow: typeof window !== 'undefined',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        location: typeof window !== 'undefined' ? window.location.href : 'unknown',
        performanceThresholds: this.performanceThresholds,
        deviceInfo: typeof navigator !== 'undefined' ? {
          memory: (navigator as any).deviceMemory || 'unknown',
          cores: navigator.hardwareConcurrency || 'unknown',
          network: (navigator as any).connection?.effectiveType || 'unknown'
        } : {},
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('デバッグ情報の取得中にエラーが発生しました:', error);
      return {
        environment: this.environment,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * 環境ユーティリティのエクスポート
 */
export { SafeEnvironment };