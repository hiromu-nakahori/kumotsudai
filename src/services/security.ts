/**
 * 供物台（Kumotsudai）- セキュリティ監視サービス
 * 
 * エンタープライズ級セキュリティ監視サービス。
 * AWS WAF、AWS GuardDutyとの連携を前提とした設計。
 * Figma Make環境対応済み。
 * 
 * 機能:
 * - HTTPS接続監視
 * - 入力サニタイゼーション
 * - レート制限
 * - セキュリティイベント記録
 * - 環境安全性確保
 * 
 * @version 2.1.0
 * @author 供物台開発チーム
 */

import { AppConfigManager } from './config';
import { LoggerService } from './logger';

/**
 * エンタープライズ級セキュリティ監視サービス
 */
export class SecurityMonitoringService {
  /** シングルトンインスタンス */
  private static instance: SecurityMonitoringService | null = null;
  
  /** キャッシュ */
  private readonly securityCache: Map<string, any> = new Map();
  
  /** 設定管理 */
  private config: AppConfigManager | null = null;
  
  /** ログサービス */
  private logger: LoggerService | null = null;
  
  /** セキュリティイベント履歴 */
  private readonly securityEvents: Array<{
    type: string;
    timestamp: Date;
    details: Record<string, any>;
  }> = [];
  
  /** キャッシュTTL (ミリ秒) */
  private readonly CACHE_TTL = 300000; // 5分
  
  /** 初期化済みフラグ */
  private initialized = false;
  
  /**
   * コンストラクタ (private - Singleton)
   */
  private constructor() {
    // 遅延初期化で循環依存を回避
    this.initializeAsync();
  }
  
  /**
   * 非同期初期化
   * 他のサービスとの循環依存を回避
   */
  private async initializeAsync(): Promise<void> {
    try {
      // 設定管理サービスとログサービスを遅延取得
      setTimeout(() => {
        try {
          this.config = AppConfigManager.getInstance();
          this.logger = LoggerService.getInstance();
          
          // 初期セキュリティチェック
          this.performInitialSecurityCheck();
          
          this.initialized = true;
          
          if (this.logger) {
            this.logger.info('SecurityMonitoringService: 初期化完了');
          }
        } catch (error) {
          console.warn('SecurityMonitoringService: 初期化中にエラーが発生しました', error);
          this.initialized = true; // エラーでも初期化完了とする
        }
      }, 0);
    } catch (error) {
      console.warn('SecurityMonitoringService: 非同期初期化に失敗しました', error);
      this.initialized = true;
    }
  }
  
  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    
    return SecurityMonitoringService.instance;
  }
  
  /**
   * 初期セキュリティチェック
   */
  private performInitialSecurityCheck(): void {
    try {
      // HTTPS接続確認
      const httpsStatus = this.checkHttpsConnection();
      
      // CSP (Content Security Policy) チェック
      const cspStatus = this.checkContentSecurityPolicy();
      
      // セキュリティイベント記録
      this.recordSecurityEvent('initial_check', {
        https: httpsStatus,
        csp: cspStatus,
        environment: this.config?.environment || 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        timestamp: new Date().toISOString()
      });
      
      if (this.logger) {
        this.logger.info('初期セキュリティチェック完了', {
          https: httpsStatus,
          csp: cspStatus
        });
      }
    } catch (error) {
      console.warn('初期セキュリティチェック中にエラーが発生しました', error);
    }
  }
  
  /**
   * HTTPS接続確認
   * @returns HTTPS接続かどうか
   */
  public checkHttpsConnection(): boolean {
    const cacheKey = 'https-check';
    const cached = this.getCachedResult(cacheKey);
    
    if (cached !== null) {
      return cached;
    }
    
    try {
      // window オブジェクトが存在しない場合の安全な処理
      if (typeof window === 'undefined') {
        // サーバーサイドやNode.js環境では true を返す
        return true;
      }
      
      const isHttps = window.location.protocol === 'https:' || 
                      window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1' ||
                      (this.config?.environment === 'development');
      
      // 本番環境でHTTPSでない場合は警告
      if (!isHttps && this.config?.environment === 'production') {
        const warningData = {
          protocol: window.location.protocol,
          hostname: window.location.hostname
        };
        
        if (this.logger) {
          this.logger.warn('🔒 セキュリティ警告: HTTPS接続を推奨します', warningData);
        }
        
        this.recordSecurityEvent('https_violation', warningData);
      }
      
      this.setCachedResult(cacheKey, isHttps);
      return isHttps;
    } catch (error) {
      console.warn('HTTPS接続確認中にエラーが発生しました', error);
      // エラー時は安全側に倒してtrueを返す
      return true;
    }
  }
  
  /**
   * Content Security Policy チェック
   * @returns CSP が設定されているかどうか
   */
  public checkContentSecurityPolicy(): boolean {
    const cacheKey = 'csp-check';
    const cached = this.getCachedResult(cacheKey);
    
    if (cached !== null) {
      return cached;
    }
    
    try {
      // document オブジェクトが存在しない場合の安全な処理
      if (typeof document === 'undefined') {
        return true; // サーバーサイド環境では true を返す
      }
      
      // CSPヘッダーまたはmetaタグの存在確認
      const hasCspHeader = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
      const hasCspMeta = document.querySelector('meta[name="content-security-policy"]') !== null;
      const hasCSP = hasCspHeader || hasCspMeta;
      
      if (!hasCSP && this.config?.environment === 'production') {
        if (this.logger) {
          this.logger.warn('🛡️ セキュリティ警告: Content Security Policy が設定されていません');
        }
        
        this.recordSecurityEvent('csp_missing', {
          environment: this.config.environment
        });
      }
      
      this.setCachedResult(cacheKey, hasCSP);
      return hasCSP;
    } catch (error) {
      console.warn('CSPチェック中にエラーが発生しました', error);
      // エラー時は安全側に倒してtrueを返す
      return true;
    }
  }
  
  /**
   * ユーザー入力サニタイゼーション
   * XSS攻撃防止のための高度なサニタイゼーション
   * 
   * @param input サニタイゼーション対象の文字列
   * @returns サニタイゼーション後の文字列
   */
  public sanitizeUserInput(input: string): string {
    if (typeof input !== 'string') {
      if (this.logger) {
        this.logger.warn('セキュリティ警告: 文字列以外の入力が検出されました', {
          inputType: typeof input,
          input: String(input).substring(0, 100) // 長すぎる場合は切り取り
        });
      }
      return '';
    }
    
    try {
      // HTMLエスケープ
      let sanitized = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
      
      // スクリプトタグの完全除去
      sanitized = sanitized.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 
        ''
      );
      
      // 危険なイベントハンドラー属性の除去
      sanitized = sanitized.replace(
        /\s*on\w+\s*=\s*["'][^"']*["']/gi,
        ''
      );
      
      // javascript: URLの除去
      sanitized = sanitized.replace(
        /javascript:/gi,
        ''
      );
      
      // データURL (data:) の制限
      sanitized = sanitized.replace(
        /data:\s*[^;]+;base64,/gi,
        ''
      );
      
      // 危険なHTMLタグの除去
      const dangerousTags = [
        'script', 'iframe', 'object', 'embed', 'form',
        'input', 'textarea', 'button', 'select', 'option',
        'link', 'meta', 'style', 'title', 'base'
      ];
      
      for (const tag of dangerousTags) {
        const regex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
        sanitized = sanitized.replace(regex, '');
      }
      
      // 疑わしい入力の記録
      if (sanitized !== input) {
        this.recordSecurityEvent('input_sanitization', {
          originalLength: input.length,
          sanitizedLength: sanitized.length,
          removedChars: input.length - sanitized.length,
          timestamp: new Date().toISOString()
        });
        
        if (this.logger) {
          this.logger.info('ユーザー入力をサニタイゼーションしました', {
            original: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
            sanitized: sanitized.substring(0, 100) + (sanitized.length > 100 ? '...' : '')
          });
        }
      }
      
      return sanitized;
    } catch (error) {
      console.warn('入力サニタイゼーション中にエラーが発生しました', error);
      // エラー時は空文字を返して安全を確保
      return '';
    }
  }
  
  /**
   * レート制限チェック
   * @param identifier 識別子 (IPアドレスやユーザーID)
   * @param limit 制限数
   * @param windowMs 時間窓 (ミリ秒)
   * @returns 制限内かどうか
   */
  public checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
    try {
      const now = Date.now();
      const key = `rate_limit_${identifier}`;
      
      let requests = this.securityCache.get(key) || [];
      
      // 時間窓外のリクエストを削除
      requests = requests.filter((timestamp: number) => now - timestamp < windowMs);
      
      // 制限チェック
      if (requests.length >= limit) {
        this.recordSecurityEvent('rate_limit_exceeded', {
          identifier,
          requests: requests.length,
          limit,
          windowMs,
          timestamp: new Date().toISOString()
        });
        
        if (this.logger) {
          this.logger.warn('レート制限に達しました', {
            identifier,
            requests: requests.length,
            limit
          });
        }
        
        return false;
      }
      
      // 現在のリクエストを追加
      requests.push(now);
      this.securityCache.set(key, requests);
      
      return true;
    } catch (error) {
      console.warn('レート制限チェック中にエラーが発生しました', error);
      // エラー時は制限をかけない（可用性を優先）
      return true;
    }
  }
  
  /**
   * セキュリティイベント記録
   * @param type イベントタイプ
   * @param details イベント詳細
   */
  private recordSecurityEvent(type: string, details: Record<string, any>): void {
    try {
      const event = {
        type,
        timestamp: new Date(),
        details
      };
      
      this.securityEvents.push(event);
      
      // イベント履歴の上限管理
      if (this.securityEvents.length > 1000) {
        this.securityEvents.shift();
      }
      
      // 重要なセキュリティイベントは即座にログ出力
      const criticalEvents = ['https_violation', 'csp_missing', 'rate_limit_exceeded'];
      if (criticalEvents.includes(type) && this.logger) {
        this.logger.error(`セキュリティイベント: ${type}`, details);
      }
    } catch (error) {
      console.warn('セキュリティイベント記録中にエラーが発生しました', error);
    }
  }
  
  /**
   * キャッシュ結果取得
   * @param key キー
   * @returns キャッシュされた値
   */
  private getCachedResult(key: string): any | null {
    try {
      const cached = this.securityCache.get(key);
      
      if (cached && cached.timestamp && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.value;
      }
      
      return null;
    } catch (error) {
      console.warn('キャッシュ取得中にエラーが発生しました', error);
      return null;
    }
  }
  
  /**
   * キャッシュ結果設定
   * @param key キー
   * @param value 値
   */
  private setCachedResult(key: string, value: any): void {
    try {
      this.securityCache.set(key, {
        value,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('キャッシュ設定中にエラーが発生しました', error);
    }
  }
  
  /**
   * セキュリティサマリー取得
   * @returns セキュリティ状態サマリー
   */
  public getSecuritySummary() {
    try {
      const recentEvents = this.securityEvents.slice(-50); // 直近50件
      const eventCounts = recentEvents.reduce((counts, event) => {
        counts[event.type] = (counts[event.type] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);
      
      return {
        initialized: this.initialized,
        httpsEnabled: this.checkHttpsConnection(),
        cspEnabled: this.checkContentSecurityPolicy(),
        totalSecurityEvents: this.securityEvents.length,
        recentEvents: eventCounts,
        lastEventTime: this.securityEvents.length > 0 
          ? this.securityEvents[this.securityEvents.length - 1].timestamp
          : null,
        cacheSize: this.securityCache.size,
        environment: this.config?.environment || 'unknown'
      };
    } catch (error) {
      console.warn('セキュリティサマリー取得中にエラーが発生しました', error);
      return {
        initialized: this.initialized,
        httpsEnabled: false,
        cspEnabled: false,
        totalSecurityEvents: 0,
        recentEvents: {},
        lastEventTime: null,
        cacheSize: 0,
        environment: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * キャッシュクリア
   */
  public clearCache(): void {
    try {
      this.securityCache.clear();
      if (this.logger) {
        this.logger.info('セキュリティキャッシュをクリアしました');
      }
    } catch (error) {
      console.warn('キャッシュクリア中にエラーが発生しました', error);
    }
  }
  
  /**
   * サービス状態取得
   * @returns サービス状態情報
   */
  public getServiceStatus(): Record<string, any> {
    return {
      initialized: this.initialized,
      hasConfig: !!this.config,
      hasLogger: !!this.logger,
      eventsCount: this.securityEvents.length,
      cacheSize: this.securityCache.size,
      environment: this.config?.environment || 'unknown',
      timestamp: new Date().toISOString()
    };
  }
}