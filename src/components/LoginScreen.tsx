import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApp } from './AppContext';
import { KumotsudaiLogo } from './KumotsudaiLogo';
import { TreePine, Moon, Sun, Leaf, Snowflake } from 'lucide-react';

// 降霊画面（ログイン）コンポーネント - 改良されたテーマ対応版
export const LoginScreen: React.FC = () => {
  const { login, setCurrentScreen, theme, toggleTheme } = useApp();
  
  // フォームの状態管理
  const [email, setEmail] = useState('mikoto@shrine.jp'); // デモ用初期値
  const [password, setPassword] = useState('password123'); // デモ用初期値
  const [error, setError] = useState('');

  // ログイン処理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('呼び名と結界文を入力してください');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('降霊に失敗しました。呼び名と結界文をご確認ください。');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 theme-transition floating-particles ${
      theme === 'autumn' ? 'autumn-theme' : 'winter-theme'
    }`}>
      {/* 背景の装飾エフェクト - テーマ別 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {theme === 'autumn' ? (
          <>
            <div className="absolute top-10 left-10 opacity-20 animate-pulse">
              <Leaf size={40} className="text-autumn-crimson" />
            </div>
            <div className="absolute top-20 right-20 opacity-15 animate-bounce">
              <TreePine size={60} className="text-autumn-ochre" />
            </div>
            <div className="absolute bottom-20 left-20 opacity-10">
              <Leaf size={80} className="text-autumn-gold" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-25 animate-pulse">
              <TreePine size={30} className="text-autumn-accent" />
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-10 left-10 opacity-20 animate-pulse">
              <Snowflake size={40} className="text-winter-primary" />
            </div>
            <div className="absolute top-20 right-20 opacity-15 animate-bounce">
              <TreePine size={60} className="text-winter-accent" />
            </div>
            <div className="absolute bottom-20 left-20 opacity-10">
              <Snowflake size={80} className="text-winter-ice" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-25 animate-pulse">
              <TreePine size={30} className="text-winter-silver" />
            </div>
          </>
        )}
      </div>

      {/* メインのログインカード */}
      <Card className="w-full max-w-md relative z-10 shadow-2xl backdrop-blur-sm bg-card/95 border-2 border-border/50">
        <CardHeader className="text-center space-y-4">
          {/* 新しいデザイン性の高いロゴ */}
          <div className="flex justify-center mb-6">
            <KumotsudaiLogo 
              size="large"
              showSubtitle={true}
              animated={true}
              clickable={false}
              className="transform transition-all duration-500 hover:scale-110"
            />
          </div>
          
          {/* サブタイトル */}
          <CardDescription className="text-muted-foreground">
            森の奥深くにひっそりと佇む祭壇へようこそ<br />
            あなたの学びと成長を神々に捧げる聖域
          </CardDescription>
          
          {/* テーマ切り替えボタン */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary transition-all hover:scale-105"
            >
              {theme === 'autumn' ? (
                <>
                  <Snowflake size={16} className="mr-2" />
                  冬の静寂へ
                </>
              ) : (
                <>
                  <Leaf size={16} className="mr-2" />
                  秋の暖もりへ
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* ログインフォーム */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* 呼び名（ユーザー名）入力 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                呼び名（符丁）
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="あなたの符丁を入力してください"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background border-border focus:border-primary transition-colors"
              />
            </div>

            {/* 結界文（パスワード）入力 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                結界文
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="秘密の結界文を入力してください"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background border-border focus:border-primary transition-colors"
              />
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="text-destructive text-center p-2 bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {/* 降霊ボタン */}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
            >
              降霊する
            </Button>

            {/* 新規登録への案内 */}
            <div className="text-center">
              <p className="text-muted-foreground">
                初めての方は
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:text-primary/80 p-0 ml-1 hover:underline"
                  onClick={() => setCurrentScreen('register')}
                >
                  魂紋の刻印
                </Button>
                へ
              </p>
            </div>
          </form>

          {/* デモ用ガイド */}
          <div className="mt-6 p-3 bg-accent/20 rounded-lg border border-accent/30">
            <p className="text-xs text-muted-foreground text-center">
              <strong>デモ用アカウント:</strong><br />
              符丁: mikoto@shrine.jp<br />
              結界文: password123
            </p>
          </div>
        </CardContent>
      </Card>

      {/* フッターの詩的なメッセージ */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-muted-foreground italic opacity-70">
          {theme === 'autumn' 
            ? '紅葉に包まれた森の静寂に、心の声を捧げよう' 
            : '雪化粧した森の澄んだ空気に、魂の響きを届けよう'
          }
        </p>
      </div>
    </div>
  );
};