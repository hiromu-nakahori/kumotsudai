/**
 * 供物台（Kumotsudai）- パフォーマンス監視サービス
 * 
 * エンタープライズ級パフォーマンス監視サービス。
 * AWS CloudWatchとの連携を前提とした高度な監視機能。
 * Figma Make環境対応済み。
 * 
 * 機能:
 * - パフォーマンス測定
 * - 閾値監視
 * - メトリクス履歴管理
 * - CloudWatch連携
 * - 環境安全性確保
 * 
 * @version 2.1.0
 * @author 供物台開発チーム
 */

import type { IPerformanceMetrics } from '../types/enterprise';
import { AppConfigManager } from './config';
import { LoggerService } from './logger';

/**
 * エンタープライズ級パフォーマンス監視サービス
 */
export class PerformanceMonitoringService {
  /** シングルトンインスタンス */
  private static instance: PerformanceMonitoringService | null = null;
  
  /** アクティブメトリクス */
  private readonly activeMetrics: Map<string, IPerformanceMetrics> = new Map();
  
  /** 完了メトリクス履歴 */
  private readonly completedMetrics: IPerformanceMetrics[] = [];
  
  /** 設定管理 */
  private config: AppConfigManager | null = null;
  
  /** ログサービス */
  private logger: LoggerService | null = null;
  
  /** メトリクス保持上限 */
  private readonly METRICS_LIMIT = 1000;
  
  /** 初期化済みフラグ */
  private initialized = false;
  
  /** パフォーマンス API の利用可能性 */
  private readonly hasPerformanceAPI: boolean;
  
  /**
   * コンストラクタ (private - Singleton)
   */
  private constructor() {
    // パフォーマンス API の利用可能性をチェック
    this.hasPerformanceAPI = typeof performance !== 'undefined' && 
                             typeof performance.now === 'function';
    
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
          
          this.initialized = true;
          
          if (this.logger) {
            this.logger.info('PerformanceMonitoringService: 初期化完了', {
              hasPerformanceAPI: this.hasPerformanceAPI,
              environment: this.config?.environment || 'unknown'
            });
          }
        } catch (error) {
          console.warn('PerformanceMonitoringService: 初期化中にエラーが発生しました', error);
          this.initialized = true; // エラーでも初期化完了とする
        }
      }, 0);
    } catch (error) {
      console.warn('PerformanceMonitoringService: 非同期初期化に失敗しました', error);
      this.initialized = true;
    }
  }
  
  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    
    return PerformanceMonitoringService.instance;
  }
  
  /**
   * 現在時刻を安全に取得
   * @returns 現在時刻（ミリ秒）
   */
  private now(): number {
    try {
      if (this.hasPerformanceAPI) {
        return performance.now();
      }
      
      // フォールバック: Date.now()
      return Date.now();
    } catch (error) {
      console.warn('時刻取得中にエラーが発生しました', error);
      return Date.now();
    }
  }
  
  /**
   * パフォーマンス測定開始
   * @param label 測定ラベル
   * @param metadata メタデータ
   */
  public startMeasurement(label: string, metadata?: Record<string, any>): void {
    try {
      const startTime = this.now();
      
      const metrics: IPerformanceMetrics = {
        label,
        startTime,
        metadata
      };
      
      this.activeMetrics.set(label, metrics);
      
      // デバッグログ
      if (this.logger) {
        this.logger.debug(`パフォーマンス測定開始: ${label}`, { 
          startTime, 
          metadata,
          hasPerformanceAPI: this.hasPerformanceAPI
        });
      }
    } catch (error) {
      console.warn('パフォーマンス測定開始中にエラーが発生しました', error);
    }
  }
  
  /**
   * パフォーマンス測定終了
   * @param label 測定ラベル
   * @returns 経過時間（ミリ秒）
   */
  public endMeasurement(label: string): number {
    try {
      const activeMetric = this.activeMetrics.get(label);
      
      if (!activeMetric) {
        if (this.logger) {
          this.logger.warn(`パフォーマンス測定開始が見つかりません: ${label}`);
        }
        return 0;
      }
      
      const endTime = this.now();
      const duration = endTime - activeMetric.startTime;
      
      // 完了メトリクス作成
      const completedMetric: IPerformanceMetrics = {
        ...activeMetric,
        endTime,
        duration
      };
      
      // アクティブメトリクスから削除
      this.activeMetrics.delete(label);
      
      // 履歴に追加
      this.addCompletedMetric(completedMetric);
      
      // 閾値チェックと警告
      this.checkPerformanceThresholds(completedMetric);
      
      // AWS CloudWatchに送信 (本番環境)
      if (this.config?.environment === 'production') {
        this.sendMetricsToCloudWatch(completedMetric);
      }
      
      return duration;
    } catch (error) {
      console.warn('パフォーマンス測定終了中にエラーが発生しました', error);
      return 0;
    }
  }
  
  /**
   * 完了メトリクス追加
   * @param metric 完了メトリクス
   */
  private addCompletedMetric(metric: IPerformanceMetrics): void {
    try {
      this.completedMetrics.push(metric);
      
      // 履歴上限チェック
      if (this.completedMetrics.length > this.METRICS_LIMIT) {
        this.completedMetrics.shift(); // 古いメトリクスを削除
      }
    } catch (error) {
      console.warn('メトリクス追加中にエラーが発生しました', error);
    }
  }
  
  /**
   * パフォーマンス閾値チェック
   * @param metric メトリクス
   */
  private checkPerformanceThresholds(metric: IPerformanceMetrics): void {
    try {
      if (!this.config || !metric.duration) {
        return;
      }
      
      const { warning, error } = this.config.performanceThresholds;
      const duration = metric.duration;
      
      if (duration >= error) {
        if (this.logger) {
          this.logger.error(`🚨 パフォーマンスエラー: ${metric.label}が${duration.toFixed(2)}ms`, {
            metric,
            threshold: error
          });
        }
      } else if (duration >= warning) {
        if (this.logger) {
          this.logger.warn(`⚡ パフォーマンス警告: ${metric.label}が${duration.toFixed(2)}ms`, {
            metric,
            threshold: warning
          });
        }
      } else if (this.config.environment === 'development' && this.logger) {
        this.logger.debug(`✅ ${metric.label}: ${duration.toFixed(2)}ms`, { metric });
      }
    } catch (error) {
      console.warn('パフォーマンス閾値チェック中にエラーが発生しました', error);
    }
  }
  
  /**
   * CloudWatchメトリクス送信
   * @param metric メトリクス
   */
  private sendMetricsToCloudWatch(metric: IPerformanceMetrics): void {
    try {
      // TODO: AWS SDK を使用してCloudWatchにメトリクスを送信
      // この部分は実際のAWS統合時に実装
      if (this.logger) {
        this.logger.debug('CloudWatchメトリクス送信', { 
          metric,
          note: 'AWS SDK統合時に実装予定'
        });
      }
    } catch (error) {
      console.warn('CloudWatchメトリクス送信中にエラーが発生しました', error);
    }
  }
  
  /**
   * 現在のメトリクス取得
   * @returns アクティブメトリクス
   */
  public getActiveMetrics(): Map<string, IPerformanceMetrics> {
    try {
      return new Map(this.activeMetrics);
    } catch (error) {
      console.warn('アクティブメトリクス取得中にエラーが発生しました', error);
      return new Map();
    }
  }
  
  /**
   * パフォーマンスサマリー取得
   * @returns パフォーマンス統計
   */
  public getPerformanceSummary() {
    try {
      const recentMetrics = this.completedMetrics.slice(-100); // 直近100件
      
      if (recentMetrics.length === 0) {
        return {
          initialized: this.initialized,
          hasPerformanceAPI: this.hasPerformanceAPI,
          totalMeasurements: 0,
          averageDuration: 0,
          maxDuration: 0,
          minDuration: 0,
          slowestOperations: [],
          environment: this.config?.environment || 'unknown'
        };
      }
      
      const durations = recentMetrics
        .map(m => m.duration!)
        .filter(d => typeof d === 'number' && !isNaN(d));
      
      if (durations.length === 0) {
        return {
          initialized: this.initialized,
          hasPerformanceAPI: this.hasPerformanceAPI,
          totalMeasurements: recentMetrics.length,
          averageDuration: 0,
          maxDuration: 0,
          minDuration: 0,
          slowestOperations: [],
          environment: this.config?.environment || 'unknown'
        };
      }
      
      const totalDuration = durations.reduce((sum, d) => sum + d, 0);
      
      return {
        initialized: this.initialized,
        hasPerformanceAPI: this.hasPerformanceAPI,
        totalMeasurements: recentMetrics.length,
        averageDuration: totalDuration / durations.length,
        maxDuration: Math.max(...durations),
        minDuration: Math.min(...durations),
        slowestOperations: recentMetrics
          .filter(m => typeof m.duration === 'number')
          .sort((a, b) => (b.duration || 0) - (a.duration || 0))
          .slice(0, 5)
          .map(m => ({ 
            label: m.label, 
            duration: m.duration,
            timestamp: m.endTime 
          })),
        activeCount: this.activeMetrics.size,
        environment: this.config?.environment || 'unknown'
      };
    } catch (error) {
      console.warn('パフォーマンスサマリー取得中にエラーが発生しました', error);
      return {
        initialized: this.initialized,
        hasPerformanceAPI: this.hasPerformanceAPI,
        totalMeasurements: 0,
        averageDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        slowestOperations: [],
        activeCount: 0,
        environment: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * メトリクスリセット
   */
  public resetMetrics(): void {
    try {
      this.activeMetrics.clear();
      this.completedMetrics.splice(0, this.completedMetrics.length);
      
      if (this.logger) {
        this.logger.info('パフォーマンスメトリクスをリセットしました');
      }
    } catch (error) {
      console.warn('メトリクスリセット中にエラーが発生しました', error);
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
      hasPerformanceAPI: this.hasPerformanceAPI,
      activeMetricsCount: this.activeMetrics.size,
      completedMetricsCount: this.completedMetrics.length,
      environment: this.config?.environment || 'unknown',
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * ブラウザパフォーマンス情報取得
   * @returns ブラウザパフォーマンス情報
   */
  public getBrowserPerformanceInfo(): Record<string, any> {
    try {
      const info: Record<string, any> = {
        hasPerformanceAPI: this.hasPerformanceAPI,
        timestamp: new Date().toISOString()
      };
      
      if (typeof performance !== 'undefined') {
        // Navigation Timing API
        if (performance.timing) {
          const timing = performance.timing;
          info.navigationTiming = {
            domLoading: timing.domLoading - timing.navigationStart,
            domComplete: timing.domComplete - timing.navigationStart,
            loadComplete: timing.loadEventEnd - timing.navigationStart
          };
        }
        
        // Performance entries
        if (typeof performance.getEntries === 'function') {
          const entries = performance.getEntries();
          info.performanceEntries = {
            total: entries.length,
            navigation: entries.filter(e => e.entryType === 'navigation').length,
            resource: entries.filter(e => e.entryType === 'resource').length,
            measure: entries.filter(e => e.entryType === 'measure').length
          };
        }
        
        // Memory info (Chrome)
        if ((performance as any).memory) {
          const memory = (performance as any).memory;
          info.memory = {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit
          };
        }
      }
      
      return info;
    } catch (error) {
      console.warn('ブラウザパフォーマンス情報取得中にエラーが発生しました', error);
      return {
        hasPerformanceAPI: this.hasPerformanceAPI,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
}