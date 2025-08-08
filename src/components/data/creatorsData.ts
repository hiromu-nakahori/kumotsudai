// 制作者情報の型定義
export interface Creator {
  id: string;
  name: string;
  role: string;
  description: string;
  specialties: string[];
  avatar: string;
  mysticalQuote: string;
}

// 神秘的な制作者情報（仮想メンバー）
export const creatorsData: Creator[] = [
  {
    id: '1',
    name: '禊 ミコト',
    role: '主任設計師',
    description: '森の叡智を集約し、供物台の根幹となる思想と設計を担う。ユーザー体験の神秘的な調和を追求している。',
    specialties: ['UX設計', 'システム設計', '神秘学'],
    avatar: '禊',
    mysticalQuote: '真の価値は、共有された時にのみ輝きを増す'
  },
  {
    id: '2',
    name: '智泉 チシミ',
    role: '技術開発者',
    description: 'React と TypeScript を駆使し、供物台の技術的基盤を構築。コードに魂を宿すことを信条としている。',
    specialties: ['React', 'TypeScript', '魔法プログラミング'],
    avatar: '智',
    mysticalQuote: 'コードは言葉なり、言葉は心なり'
  },
  {
    id: '3',
    name: '彩月 アヤツキ',
    role: '美術設計師',
    description: '秋冬の色彩を操り、UI/UXに詩的な美しさを宿す。森の自然と調和したデザインの創造者。',
    specialties: ['UI/UX', '色彩設計', '自然美学'],
    avatar: '彩',
    mysticalQuote: '色彩は感情の言語、デザインは心の橋'
  },
  {
    id: '4',
    name: '風織 カザオリ',
    role: '体験設計師',
    description: 'ユーザーの心の動きを読み取り、直感的で心地よいインタラクションを設計。風のように軽やかな操作性を実現。',
    specialties: ['インタラクション', '体験設計', '風の術'],
    avatar: '風',
    mysticalQuote: '心地よさは、見えない風のように感じるもの'
  }
];