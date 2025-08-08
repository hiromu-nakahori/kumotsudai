import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useApp } from './AppContext';
import { KumotsudaiLogo } from './KumotsudaiLogo';
import { TreePine, ArrowLeft, Moon, Sun } from 'lucide-react';
import { RegisterForm } from './RegisterForm';

// 魂紋の刻印（新規登録）コンポーネント
export const RegisterScreen: React.FC = () => {
  const { register, setCurrentScreen, theme, toggleTheme } = useApp();

  // 新規登録処理
  const handleRegister = (formData: any) => {
    const success = register(formData);
    if (!success) {
      // エラーハンドリングは RegisterForm 内で行う
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
      theme === 'autumn' ? 'autumn-theme' : 'winter-theme'
    }`}>
      {/* 背景の装飾エフェクト */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 opacity-20">
          <TreePine size={40} className="text-primary" />
        </div>
        <div className="absolute top-20 right-20 opacity-15">
          <TreePine size={60} className="text-secondary" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10">
          <TreePine size={80} className="text-accent" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-25">
          <TreePine size={30} className="text-primary" />
        </div>
      </div>

      {/* メインの登録カード */}
      <Card className="w-full max-w-md relative z-10 shadow-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-4">
          {/* ヘッダーボタン */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen('login')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={16} className="mr-2" />
              戻る
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary"
            >
              {theme === 'autumn' ? (
                <>
                  <Moon size={16} className="mr-2" />
                  冬色
                </>
              ) : (
                <>
                  <Sun size={16} className="mr-2" />
                  秋色
                </>
              )}
            </Button>
          </div>
          
          {/* 新しいデザイン性の高いロゴ */}
          <div className="flex justify-center mb-2">
            <KumotsudaiLogo 
              size="medium"
              showSubtitle={false}
              animated={true}
              clickable={false}
              className="transform transition-all duration-500"
            />
          </div>
          
          {/* 登録用タイトル */}
          <CardTitle className="text-primary text-xl mb-2">魂紋の刻印</CardTitle>
          
          <CardDescription className="text-muted-foreground">
            新たな魂を祭壇に迎え入れます
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm onSubmit={handleRegister} isSubmitting={false} />
        </CardContent>
      </Card>

      {/* フッターメッセージ */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-muted-foreground italic opacity-70">
          新たな魂よ、森の仲間として歩み始めよう
        </p>
      </div>
    </div>
  );
};