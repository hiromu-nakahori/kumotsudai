import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Auth } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

// ==========================
// 型定義群
// ==========================

// 導き（コメント）の型
export interface Comment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: Date;
}

// 供物（投稿）の型
export interface Offering {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  genres: string[];
  createdAt: Date;
  likes: number;
  comments: Comment[];
  likedBy: string[];
}

// 魂紋（ユーザー）の型
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  age: string;
  avatar?: string;
  joinedAt: Date;
  offeringCount: number;
  totalLikes: number;
  totalComments: number;
}

// アプリ全体の状態管理型
interface AppContextType {
  // 認証・画面・テーマなどのUI状態
  isAuthenticated: boolean;
  currentUser: User | null;
  currentScreen: 'login' | 'register' | 'main' | 'profile' | 'help' | 'contact' | 'creators' | 'userProfile';
  selectedUserId: string | null;
  theme: 'autumn' | 'winter';

  // データ管理
  offerings: Offering[];
  users: User[];
  cognitoUser: any | null;

  // フィルタ・ソート設定
  searchQuery: string;
  selectedGenres: string[];
  sortBy: 'likes' | 'comments' | 'date';
  sortOrder: 'asc' | 'desc';

  // アクション関数
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'joinedAt' | 'offeringCount' | 'totalLikes' | 'totalComments'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  setCurrentScreen: (screen: AppContextType['currentScreen']) => void;
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
  setSortBy: (sortBy: AppContextType['sortBy']) => void;
  setSortOrder: (order: AppContextType['sortOrder']) => void;
}

// ==========================
// コンテキストとフック定義
// ==========================

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// ==========================
// プロバイダコンポーネント
// ==========================

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // UI状態
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cognitoUser, setCognitoUser] = useState<any | null>(null);
  const [currentScreen, setCurrentScreen] = useState<AppContextType['currentScreen']>('login');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'autumn' | 'winter'>('autumn');

  // データ状態
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'likes' | 'comments' | 'date'>('likes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 降霊（ログインCognito認証）
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await Auth.signIn(email, password);
      setCognitoUser(user);
      setIsAuthenticated(true);
      setCurrentScreen('main');
      return true;
    } catch (error) {
      console.error('降霊失敗:', error);
      return false;
    }
  };

  // 魂紋の刻印（新規登録）
  // 新規登録（Cognito + DynamoDB）
  const register = async (userData: Omit<User, 'id' | 'joinedAt' | 'offeringCount' | 'totalLikes' | 'totalComments'> & { password: string }): Promise<boolean> => {
    const { name, email, password, department, age, avatar } = userData;
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: { email }
      });

      const client = generateClient<Schema>();
      await client.models.User.create({
        name,
        email,
        department,
        age,
        avatar,
        joinedAt: new Date().toISOString(),
      });

      setCurrentScreen('login');
      return true;
    } catch (error) {
      console.error('登録失敗:', error);
      return false;
    }
  };

  // 離脱（ログアウト）
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentScreen('login');
    setSelectedUserId(null);
  };

  // テーマ切替
  const toggleTheme = () => setTheme(prev => (prev === 'autumn' ? 'winter' : 'autumn'));

  // 新たな供物の追加
  const addOffering: AppContextType['addOffering'] = (offering) => {
    if (!currentUser) return;
    const newOffering: Offering = {
      ...offering,
      id: Date.now().toString(),
      createdAt: new Date(),
      likes: 0,
      comments: [],
      likedBy: []
    };
    setOfferings(prev => [newOffering, ...prev]);
  };

  // 供物への祈念（いいね）
  const likeOffering = (offeringId: string) => {
    if (!currentUser) return;
    setOfferings(prev => prev.map(offering => {
      if (offering.id !== offeringId) return offering;
      const liked = offering.likedBy.includes(currentUser.id);
      return {
        ...offering,
        likes: liked ? offering.likes - 1 : offering.likes + 1,
        likedBy: liked ? offering.likedBy.filter(id => id !== currentUser.id) : [...offering.likedBy, currentUser.id]
      };
    }));
  };

  // 導き（コメント）の追加
  const addComment: AppContextType['addComment'] = (offeringId, content) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      author: currentUser.name,
      content,
      createdAt: new Date()
    };
    setOfferings(prev => prev.map(offering =>
      offering.id === offeringId ? { ...offering, comments: [...offering.comments, newComment] } : offering
    ));
  };

  // 魂紋の更新（プロフィール）
  const updateProfile: AppContextType['updateProfile'] = (userData) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // 符丁の改変（仮）
  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    const isValid = oldPassword.length > 0 && newPassword.length >= 6;
    return isValid;
  };
  
  // ユーザーデータ取得群
  const getUserById = (userId: string) => users.find(u => u.id === userId);
  const getOfferingsByUserId = (userId: string) => offerings.filter(o => o.authorId === userId);
  const getLikedOfferingsByUserId = (userId: string) => offerings.filter(o => o.likedBy.includes(userId));
  const getCommentedOfferingsByUserId = (userId: string) => offerings.filter(o => o.comments.some(c => c.authorId === userId));

  // ==========================
  // コンテキストプロバイダ
  // ==========================

  const value: AppContextType = {
    isAuthenticated,
    currentUser,
    currentScreen,
    selectedUserId,
    theme,
    offerings,
    users,
    cognitoUser,
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
