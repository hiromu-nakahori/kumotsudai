import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useApp } from './AppContext';
import { KumotsudaiLogo } from './KumotsudaiLogo';
import { 
  Crown, 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  HelpCircle, 
  MessageSquare, 
  Users 
} from 'lucide-react';

// X（Twitter）風の左サイドバーコンポーネント
export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    theme, 
    toggleTheme, 
    logout, 
    setCurrentScreen 
  } = useApp();

  const menuItems = [
    {
      icon: User,
      label: '写し絵',
      sublabel: 'プロフィール編集',
      action: () => setCurrentScreen('profile'),
    },
    {
      icon: HelpCircle,
      label: '使い方',
      sublabel: 'ガイド',
      action: () => setCurrentScreen('help'),
    },
    {
      icon: MessageSquare,
      label: '囁き',
      sublabel: 'お問い合わせ',
      action: () => setCurrentScreen('contact'),
    },
    {
      icon: Users,
      label: '制作者たち',
      sublabel: '開発チーム',
      action: () => setCurrentScreen('creators'),
    },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 border-r border-border/50 bg-card/30 backdrop-blur-sm overflow-y-auto">
      <div className="flex flex-col h-full p-4">
        {/* アプリタイトル */}
        <div className="mb-8 pt-4 flex justify-center">
          <KumotsudaiLogo 
            size="medium"
            showSubtitle={true}
            animated={true}
            clickable={false}
            className="transform transition-all duration-300 hover:scale-105"
          />
        </div>

        {/* ユーザー情報 */}
        {currentUser && (
          <div className="mb-6 p-3 rounded-lg bg-accent/30 border border-border">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground truncate">{currentUser.department}</div>
              </div>
            </div>
          </div>
        )}

        {/* メニュー項目 */}
        <nav className="space-y-2 mb-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-accent/50 transition-colors"
                onClick={item.action}
              >
                <Icon size={20} className="mr-3 shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.sublabel}</div>
                </div>
              </Button>
            );
          })}
        </nav>

        {/* スペーサー */}
        <div className="flex-1" />

        {/* 下部のアクション */}
        <div className="space-y-3">
          {/* テーマ切り替え */}
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-3 hover:bg-accent/50 transition-colors"
            onClick={toggleTheme}
          >
            {theme === 'autumn' ? (
              <Moon size={20} className="mr-3" />
            ) : (
              <Sun size={20} className="mr-3" />
            )}
            <div className="text-left">
              <div className="font-medium text-sm">
                {theme === 'autumn' ? '冬の装い' : '秋の装い'}
              </div>
              <div className="text-xs text-muted-foreground">テーマ変更</div>
            </div>
          </Button>

          {/* ログアウト */}
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-3 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={logout}
          >
            <LogOut size={20} className="mr-3" />
            <div className="text-left">
              <div className="font-medium text-sm">降霊を解く</div>
              <div className="text-xs opacity-75">ログアウト</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};