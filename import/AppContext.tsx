
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Auth } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

// ==========================
// 型定義
// ==========================

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

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  cognitoUser: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'joinedAt' | 'offeringCount' | 'totalLikes' | 'totalComments'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<Pick<User, 'name' | 'department' | 'age' | 'avatar'>>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cognitoUser, setCognitoUser] = useState<any | null>(null);

  // ログイン処理（Cognito認証）
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await Auth.signIn(email, password);
      setCognitoUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('ログイン失敗:', error);
      return false;
    }
  };

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

      return true;
    } catch (error) {
      console.error('登録失敗:', error);
      return false;
    }
  };

  // ログアウト処理
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCognitoUser(null);
  };

  // ユーザー情報更新（ローカルのみ）
  const updateProfile = (userData: Partial<Pick<User, 'name' | 'department' | 'age' | 'avatar'>>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
  };

  return (
    <AppContext.Provider value={{ isAuthenticated, currentUser, cognitoUser, login, register, logout, updateProfile }}>
      {children}
    </AppContext.Provider>
  );
};
