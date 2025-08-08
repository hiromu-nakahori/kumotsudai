import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { useApp } from './AppContext';
import { Menu, Crown, Search, Plus, Moon, Sun, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { RankingTab } from './RankingTab';
import { SearchTab } from './SearchTab';
import { SubmissionTab } from './SubmissionTab';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';

// X（Twitter）風のメインアプリケーションコンポーネント
export const MainApp: React.FC = () => {
  const { currentUser, theme, toggleTheme, logout, setCurrentScreen } = useApp();
  const [activeTab, setActiveTab] = useState('ranking');

  return (
    <div className="min-h-screen flex">
      {/* デスクトップ用サイドバー */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* モバイル用ハンバーガーメニュー */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-card/80 backdrop-blur-sm border border-border hover:bg-accent/50"
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 max-w-2xl mx-auto border-x border-border/50 min-h-screen">
        {/* モバイル用ヘッダー */}
        <div className="lg:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-primary">供物台</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="ml-2"
            >
              {theme === 'autumn' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
          </div>
        </div>

        {/* 神秘的なタブナビゲーション */}
        <div className="sticky top-0 lg:top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border/50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent border-0 rounded-none h-auto p-2 gap-2">
              <TabsTrigger 
                value="ranking" 
                className="tab-trigger flex flex-col items-center justify-center group relative overflow-hidden large-clickable interactive-element mystical-glow haptic-feedback click-animation"
                role="tab"
                aria-label="審神の壇 - ランキング表示"
              >
                <div className="flex flex-col items-center space-y-1 relative z-10">
                  <div className="relative status-indicator">
                    <Crown size={22} className="transition-all duration-300 group-hover:scale-110 group-data-[state=active]:text-yellow-300" />
                    <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300">
                      <Crown size={22} className="text-yellow-300 animate-pulse" />
                    </div>
                  </div>
                  <span className="text-sm font-medium tracking-wide content-hierarchy-3">審神の壇</span>
                  <span className="text-xs opacity-80 text-secondary">ランキング</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="search" 
                className="tab-trigger flex flex-col items-center justify-center group relative overflow-hidden large-clickable interactive-element mystical-glow haptic-feedback click-animation"
                role="tab"
                aria-label="探求の壇 - 検索と発見"
              >
                <div className="flex flex-col items-center space-y-1 relative z-10">
                  <div className="relative">
                    <Search size={22} className="transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-30 transition-opacity duration-500">
                      <div className="w-5 h-5 border-2 border-current rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium tracking-wide content-hierarchy-3">探求の壇</span>
                  <span className="text-xs opacity-80 text-secondary">検索・発見</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="submission" 
                className="tab-trigger flex flex-col items-center justify-center group relative overflow-hidden large-clickable interactive-element mystical-glow haptic-feedback click-animation"
                role="tab"
                aria-label="献納の壇 - 投稿と創造"
              >
                <div className="flex flex-col items-center space-y-1 relative z-10">
                  <div className="relative">
                    <Plus size={22} className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
                    <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-300">
                      <div className="w-5 h-5 border border-current rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium tracking-wide content-hierarchy-3">献納の壇</span>
                  <span className="text-xs opacity-80 text-secondary">投稿・創造</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* タブコンテンツ */}
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="ranking" className="mt-0">
              <RankingTab />
            </TabsContent>

            <TabsContent value="search" className="mt-0">
              <SearchTab />
            </TabsContent>

            <TabsContent value="submission" className="mt-0">
              <SubmissionTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 右側のサイドバー（デスクトップのみ） */}
      <div className="hidden xl:block w-80 p-4">
        <div className="sticky top-4">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};