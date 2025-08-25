import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Auth } from 'aws-amplify';

// 供物（投稿）の型定義
export interface Offering {
  id: string;
  title: string;         // 題名
  content: string;       // 内容
  author: string;        // 投稿者
  authorId: string;      // 投稿者ID
  genres: string[];      // ジャンル（複数選択可）
  createdAt: Date;       // 投稿日時
  likes: number;         // 祈念（いいね）数
  comments: Comment[];   // 導き（コメント）
  likedBy: string[];     // 祈念した人のIDリスト
}

// 導き（コメント）の型定義
export interface Comment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: Date;
}

// ユーザーの型定義
export interface User {
  id: string;
  name: string;          // 呼び名
  email: string;         // 符丁
  department: string;    // 所属
  age: string;          // 年代
  avatar?: string;       // アイコン画像URL
  joinedAt: Date;        // 加入日
  offeringCount: number; // 投稿数
  totalLikes: number;    // 総祈念数
  totalComments: number; // 総導き数
}

// アプリの状態を管理するコンテキストの型定義
interface AppContextType {
  // 認証関連
  isAuthenticated: boolean;
  currentUser: User | null;
  
  // 画面遷移関連 - 拡張
  currentScreen: 'login' | 'register' | 'main' | 'profile' | 'help' | 'contact' | 'creators' | 'userProfile';
  selectedUserId: string | null; // 閲覧するユーザーのID
  
  // テーマ関連
  theme: 'autumn' | 'winter';
  
  // 供物データ
  offerings: Offering[];
  
  // Cognitoのユーザーデータ
  cognitoUser: any | null;

  // ユーザーデータ
  users: User[];
  
  // フィルタ・検索関連
  searchQuery: string;
  selectedGenres: string[];
  sortBy: 'likes' | 'comments' | 'date';
  sortOrder: 'asc' | 'desc';
  
  // アクション関数群
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'joinedAt' | 'offeringCount' | 'totalLikes' | 'totalComments'> & { password: string }) => boolean;
  logout: () => void;
  setCurrentScreen: (screen: 'login' | 'register' | 'main' | 'profile' | 'help' | 'contact' | 'creators' | 'userProfile') => void;
  setSelectedUserId: (userId: string | null) => void;
  toggleTheme: () => void;
  addOffering: (offering: Omit<Offering, 'id' | 'createdAt' | 'likes' | 'comments' | 'likedBy'>) => void;
  likeOffering: (offeringId: string) => void;
  addComment: (offeringId: string, content: string) => void;
  updateProfile: (userData: Partial<Pick<User, 'name' | 'department' | 'age' | 'avatar'>>) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  getUserById: (userId: string) => User | undefined;
  getOfferingsByUserId: (userId: string) => Offering[];
  getLikedOfferingsByUserId: (userId: string) => Offering[];
  getCommentedOfferingsByUserId: (userId: string) => Offering[];
  setSearchQuery: (query: string) => void;
  setSelectedGenres: (genres: string[]) => void;
  setSortBy: (sortBy: 'likes' | 'comments' | 'date') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// カスタムフック：コンテキストを安全に取得
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// ダミーユーザーデータ（網羅試験用）
const createDummyUsers = (): User[] => [
  {
    id: 'user1',
    name: '禊 ミコト',
    email: 'mikoto@shrine.jp',
    department: '風の部署',
    age: '20代',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    joinedAt: new Date('2023-01-15'),
    offeringCount: 15,
    totalLikes: 123,
    totalComments: 45
  },
  {
    id: 'user2', 
    name: '智泉 チシミ',
    email: 'chishimi@forest.jp',
    department: '水の部署',
    age: '30代',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    joinedAt: new Date('2023-03-20'),
    offeringCount: 28,
    totalLikes: 287,
    totalComments: 89
  },
  {
    id: 'user3',
    name: '星影 セイエイ',
    email: 'seiei@moon.jp', 
    department: '光の部署',
    age: '20代',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
    joinedAt: new Date('2023-05-10'),
    offeringCount: 22,
    totalLikes: 198,
    totalComments: 67
  },
  {
    id: 'user4',
    name: '千歳 チトセ',
    email: 'chitose@ancient.jp',
    department: '土の部署',
    age: '40代',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    joinedAt: new Date('2022-11-05'),
    offeringCount: 42,
    totalLikes: 456,
    totalComments: 134
  },
  {
    id: 'user5',
    name: '朝霧 アサギリ',
    email: 'asagiri@dawn.jp',
    department: '風の部署',
    age: '20代',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b593?w=100&h=100&fit=crop&crop=face',
    joinedAt: new Date('2023-07-22'),
    offeringCount: 18,
    totalLikes: 156,
    totalComments: 52
  },
  {
    id: 'user6',
    name: '深淵 シンエン',
    email: 'shinen@abyss.jp',
    department: '闇の部署',
    age: '30代',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    joinedAt: new Date('2022-08-12'),
    offeringCount: 35,
    totalLikes: 389,
    totalComments: 98
  }
];

// ダミー供物データ（網羅試験用）
const createDummyOfferings = (): Offering[] => [
  {
    id: '1',
    title: '今日の修練成果',
    content: '朝の瞑想で心の平穏を得ることができました。新しい呼吸法も習得し、集中力が格段に向上しています。この技法を皆さんにも共有したいと思います。',
    author: '禊 ミコト',
    authorId: 'user1',
    genres: ['修練', '日々'],
    createdAt: new Date('2024-01-15'),
    likes: 15,
    comments: [
      {
        id: 'c1',
        authorId: 'user2',
        author: '智泉 チシミ',
        content: '素晴らしい成果ですね。その呼吸法について詳しく教えていただけませんか？',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'c2',
        authorId: 'user3',
        author: '星影 セイエイ',
        content: '瞑想の効果は本当に大きいですね。私も続けてみます。',
        createdAt: new Date('2024-01-16')
      }
    ],
    likedBy: ['user2', 'user3', 'user4', 'user5', 'user6']
  },
  {
    id: '2',
    title: '新技術の習得証明',
    content: 'React Hooksを使ったアプリケーション開発に成功しました。useStateとuseEffectの使い方を完全に理解し、実際にプロダクションレベルのアプリケーションを構築できるようになりました。',
    author: '智泉 チシミ',
    authorId: 'user2',
    genres: ['証明', '挑戦', '技術'],
    createdAt: new Date('2024-01-14'),
    likes: 23,
    comments: [
      {
        id: 'c3',
        authorId: 'user1',
        author: '禊 ミコト',
        content: 'React技術の習得おめでとうございます！ぜひ詳しい学習方法も教えてください。',
        createdAt: new Date('2024-01-14')
      }
    ],
    likedBy: ['user1', 'user3', 'user4', 'user5']
  },
  {
    id: '3',
    title: '星読みの研究成果',
    content: '天体の動きと人間の心理状態の関連性について半年間研究を続けてきました。特に満月の夜における集中力の変化について興味深いデータが得られています。',
    author: '星影 セイエイ',
    authorId: 'user3',
    genres: ['研究', '星座', '自然'],
    createdAt: new Date('2024-01-13'),
    likes: 31,
    comments: [
      {
        id: 'c4',
        authorId: 'user4',
        author: '千歳 チトセ',
        content: '古来から星と人の関係は深いとされていますね。研究結果をぜひ詳しく聞かせてください。',
        createdAt: new Date('2024-01-13')
      },
      {
        id: 'c5',
        authorId: 'user2',
        author: '智泉 チシミ',
        content: 'データサイエンスの観点からも非常に興味深い研究ですね。',
        createdAt: new Date('2024-01-14')
      }
    ],
    likedBy: ['user1', 'user2', 'user4', 'user5', 'user6']
  },
  {
    id: '4',
    title: '古典文学の読解記録',
    content: '源氏物語の現代語訳を完読しました。千年前の人々の心情描写の繊細さに驚嘆しています。現代にも通じる普遍的な人間性の描写が多く発見できました。',
    author: '千歳 チトセ',
    authorId: 'user4',
    genres: ['学習', '文学', '古典'],
    createdAt: new Date('2024-01-12'),
    likes: 18,
    comments: [
      {
        id: 'c6',
        authorId: 'user5',
        author: '朝霧 アサギリ',
        content: '古典の美しさは時代を超えますね。おすすめの章があれば教えてください。',
        createdAt: new Date('2024-01-12')
      }
    ],
    likedBy: ['user1', 'user2', 'user3', 'user5']
  },
  {
    id: '5',
    title: '風景写真の新たな境地',
    content: '早朝の霧に包まれた森を撮影することで、これまでにない幻想的な作品が撮れました。自然の一瞬の美しさを捉える喜びを改めて感じています。',
    author: '朝霧 アサギリ',
    authorId: 'user5',
    genres: ['創作', '写真', '自然'],
    createdAt: new Date('2024-01-11'),
    likes: 27,
    comments: [
      {
        id: 'c7',
        authorId: 'user3',
        author: '星影 セイエイ',
        content: '早朝の光は特別ですね。作品をぜひ拝見したいです。',
        createdAt: new Date('2024-01-11')
      },
      {
        id: 'c8',
        authorId: 'user6',
        author: '深淵 シンエン',
        content: '霧の表現は写真の醍醐味の一つですね。技術的なコツがあれば教えてください。',
        createdAt: new Date('2024-01-12')
      }
    ],
    likedBy: ['user1', 'user2', 'user3', 'user4', 'user6']
  },
  {
    id: '6',
    title: '哲学書との対話記録',
    content: 'ニーチェの「ツァラトゥストラはかく語りき」を読み返し、新たな解釈を得ました。深淵を覗く者は、深淵からも覗かれているという言葉の重みを改めて感じています。',
    author: '深淵 シンエン',
    authorId: 'user6',
    genres: ['思索', '哲学', '書物'],
    createdAt: new Date('2024-01-10'),
    likes: 22,
    comments: [
      {
        id: 'c9',
        authorId: 'user4',
        author: '千歳 チトセ',
        content: 'ニーチェの思想は時代を超えて響きますね。その解釈をぜひ聞かせてください。',
        createdAt: new Date('2024-01-10')
      }
    ],
    likedBy: ['user1', 'user2', 'user3', 'user4', 'user5']
  },
  {
    id: '7',
    title: '料理における創造の記録',
    content: '季節の野菜を使った精進料理に挑戦しました。素材の持つ自然の味を最大限に活かす調理法を研究し、心身ともに清らかになる食事を作ることができました。',
    author: '禊 ミコト',
    authorId: 'user1',
    genres: ['創作', '料理', '日々'],
    createdAt: new Date('2024-01-09'),
    likes: 19,
    comments: [
      {
        id: 'c10',
        authorId: 'user2',
        author: '智泉 チシミ',
        content: '精進料理の奥深さを感じます。レシピを教えていただけませんか？',
        createdAt: new Date('2024-01-09')
      }
    ],
    likedBy: ['user2', 'user3', 'user4', 'user5']
  },
  {
    id: '8',
    title: 'アルゴリズム最適化の成功',
    content: 'データ処理の効率化に取り組み、従来の10倍の速度で処理できるアルゴリズムを開発しました。複雑性理論の応用により、O(n²)からO(n log n)への改善を実現できました。',
    author: '智泉 チシミ',
    authorId: 'user2', 
    genres: ['技術', '証明', '挑戦'],
    createdAt: new Date('2024-01-08'),
    likes: 25,
    comments: [
      {
        id: 'c11',
        authorId: 'user3',
        author: '星影 セイエイ',
        content: '技術的な突破おめでとうございます！アルゴリズムの詳細に興味があります。',
        createdAt: new Date('2024-01-08')
      }
    ],
    likedBy: ['user1', 'user3', 'user4', 'user5', 'user6']
  }
];

// アプリのプロバイダコンポーネント
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 状態の初期化
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'main' | 'profile' | 'help' | 'contact' | 'creators' | 'userProfile'>('login');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'autumn' | 'winter'>('autumn');
  const [offerings, setOfferings] = useState<Offering[]>(createDummyOfferings());
  const [users, setUsers] = useState<User[]>(createDummyUsers());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'likes' | 'comments' | 'date'>('likes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // ログイン処理
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await Auth.signIn(email, password);
      setCognitoUser(user);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setCurrentScreen('main');
      return true;
    } catch (error) {
      return false;
    }
  };

  // 新規登録処理（簡易版）
  const register = (userData: Omit<User, 'id' | 'joinedAt' | 'offeringCount' | 'totalLikes' | 'totalComments'> & { password: string }): boolean => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      department: userData.department,
      age: userData.age,
      avatar: userData.avatar,
      joinedAt: new Date(),
      offeringCount: 0,
      totalLikes: 0,
      totalComments: 0
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setCurrentScreen('main');
    return true;
  };

  // ログアウト処理
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentScreen('login');
    setSelectedUserId(null);
  };

  // テーマ切り替え
  const toggleTheme = () => {
    setTheme(prev => prev === 'autumn' ? 'winter' : 'autumn');
  };

  // 新しい供物を追加
  const addOffering = (offering: Omit<Offering, 'id' | 'createdAt' | 'likes' | 'comments' | 'likedBy'>) => {
    const newOffering: Offering = {
      ...offering,
      id: Date.now().toString(),
      createdAt: new Date(),
      likes: 0,
      comments: [],
      likedBy: []
    };
    setOfferings(prev => [newOffering, ...prev]);
    
    // ユーザーの投稿数を更新
    if (currentUser) {
      setUsers(prev => prev.map(user => 
        user.id === currentUser.id 
          ? { ...user, offeringCount: user.offeringCount + 1 }
          : user
      ));
      setCurrentUser(prev => prev ? { ...prev, offeringCount: prev.offeringCount + 1 } : null);
    }
  };

  // 供物に祈念（いいね）を追加
  const likeOffering = (offeringId: string) => {
    if (!currentUser) return;
    
    setOfferings(prev => prev.map(offering => {
      if (offering.id === offeringId) {
        const hasLiked = offering.likedBy.includes(currentUser.id);
        if (hasLiked) {
          // すでに祈念済みの場合は取り消し
          return {
            ...offering,
            likes: offering.likes - 1,
            likedBy: offering.likedBy.filter(id => id !== currentUser.id)
          };
        } else {
          // まだ祈念していない場合は追加
          return {
            ...offering,
            likes: offering.likes + 1,
            likedBy: [...offering.likedBy, currentUser.id]
          };
        }
      }
      return offering;
    }));
  };

  // 供物に導き（コメント）を追加
  const addComment = (offeringId: string, content: string) => {
    if (!currentUser) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      author: currentUser.name,
      content,
      createdAt: new Date()
    };

    setOfferings(prev => prev.map(offering => {
      if (offering.id === offeringId) {
        return {
          ...offering,
          comments: [...offering.comments, newComment]
        };
      }
      return offering;
    }));
    
    // ユーザーの総コメント数を更新
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id 
        ? { ...user, totalComments: user.totalComments + 1 }
        : user
    ));
    setCurrentUser(prev => prev ? { ...prev, totalComments: prev.totalComments + 1 } : null);
  };

  // プロフィール更新
  const updateProfile = (userData: Partial<Pick<User, 'name' | 'department' | 'age' | 'avatar'>>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id ? updatedUser : user
    ));
    
    // 供物の作者名も更新
    if (userData.name) {
      setOfferings(prev => prev.map(offering => 
        offering.authorId === currentUser.id 
          ? { ...offering, author: userData.name || offering.author}
          : {
              ...offering,
              comments: offering.comments.map(comment =>
                comment.authorId === currentUser.id
                  ? { ...comment, author: userData.name || offering.content}
                  : comment
              )
            }
      ));
    }
  };

  // パスワード変更（簡易版）
  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    // 実際のアプリではサーバーサイドで処理
    if (oldPassword && newPassword && newPassword.length >= 6) {
      return true;
    }
    return false;
  };

  // ユーザー検索
  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  // ユーザーの供物を取得
  const getOfferingsByUserId = (userId: string): Offering[] => {
    return offerings.filter(offering => offering.authorId === userId);
  };

  // ユーザーがいいねした供物を取得
  const getLikedOfferingsByUserId = (userId: string): Offering[] => {
    return offerings.filter(offering => offering.likedBy.includes(userId));
  };

  // ユーザーがコメントした供物を取得
  const getCommentedOfferingsByUserId = (userId: string): Offering[] => {
    return offerings.filter(offering => 
      offering.comments.some(comment => comment.authorId === userId)
    );
  };

  // コンテキスト値を作成
  const value: AppContextType = {
    isAuthenticated,
    currentUser,
    currentScreen,
    selectedUserId,
    theme,
    offerings,
    cognitoUser,
    users,
    searchQuery,
    selectedGenres,
    sortBy,
    sortOrder,
    login,
    register,
    logout,
    setCurrentScreen,
    setSelectedUserId,
    toggleTheme,
    addOffering,
    likeOffering,
    addComment,
    updateProfile,
    changePassword,
    getUserById,
    getOfferingsByUserId,
    getLikedOfferingsByUserId,
    getCommentedOfferingsByUserId,
    setSearchQuery,
    setSelectedGenres,
    setSortBy,
    setSortOrder
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};