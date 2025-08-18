// アプリケーション全体で使用される定数

// 利用可能なジャンル一覧
export const AVAILABLE_GENRES = [
  '修練', '日々', '証明', '挑戦', '学習', '創作',
  '発見', '体験', '感謝', '決意', '成長', '智恵',
  '技術', '芸術', '研究', '実践', '共有', '貢献'
] as const;

// 所属選択肢
export const DEPARTMENTS = [
  { value: '', label: '選択してください' },
  { value: 'wind', label: '風の部署' },
  { value: 'water', label: '水の工房' },
  { value: 'earth', label: '土の組合' },
  { value: 'fire', label: '火の結社' },
  { value: 'wood', label: '木の集団' },
  { value: 'valley', label: '谷の工房' },
  { value: 'mountain', label: '山の連盟' },
  { value: 'forest', label: '森の同志' }
] ;

// 年代選択肢
export const AGE_RANGES = [
  { value: '', label: '選択してください' },
  { value: 'teens', label: '10代' },
  { value: '20s', label: '20代' },
  { value: '30s', label: '30代' },
  { value: '40s', label: '40代' },
  { value: '50s', label: '50代' },
  { value: '60s', label: '60代以上' }
] ;

// お問い合わせカテゴリ
export const CONTACT_CATEGORIES = [
  { value: 'bug', label: '不具合報告' },
  { value: 'feature', label: '新機能のご要望' },
  { value: 'question', label: '使い方のご質問' },
  { value: 'feedback', label: 'ご意見・ご感想' },
  { value: 'other', label: 'その他' }
] as const;

// バリデーション設定
export const VALIDATION_RULES = {
  TITLE_MAX_LENGTH: 100,
  CONTENT_MIN_LENGTH: 10,
  CONTENT_MAX_LENGTH: 2000,
  CONTACT_CONTENT_MAX_LENGTH: 1000,
  CONTACT_SUBJECT_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 6
} as const;

// メッセージ
export const MESSAGES = {
  LOGIN_SUCCESS: '降霊が完了しました',
  REGISTER_SUCCESS: '魂紋の刻印が完了しました',
  OFFERING_SUCCESS: '供物が祭壇に捧げられました',
  LIKE_SUCCESS: '祈念を捧げました',
  COMMENT_SUCCESS: '導きを記しました',
  CONTACT_SUCCESS: '囁きが制作者に届きました',
  PROFILE_UPDATE_SUCCESS: '写し絵が更新されました'
} as const;