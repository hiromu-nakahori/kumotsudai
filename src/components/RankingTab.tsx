import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useApp } from './AppContext';
import { Calendar, Clock, Infinity } from 'lucide-react';
import { OfferingCard } from './OfferingCard';

// 適切なサイズのランキングタブコンポーネント
export const RankingTab: React.FC = () => {
  const { offerings } = useApp();
  const [activeRanking, setActiveRanking] = useState('eternal');

  // 各ランキングのソート済み供物を計算
  const rankingData = useMemo(() => {
    const now = new Date();
    
    // 永久供物：累計祈念数（リセットなし）
    const eternalOfferings = [...offerings].sort((a, b) => b.likes - a.likes);
    
    // 季節供物：四半期で計算（簡易版では3ヶ月前からのデータ）
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const seasonalOfferings = offerings
      .filter(offering => offering.createdAt >= threeMonthsAgo)
      .sort((a, b) => b.likes - a.likes);
    
    // 月満供物：今月のデータ
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOfferings = offerings
      .filter(offering => offering.createdAt >= thisMonth)
      .sort((a, b) => b.likes - a.likes);
    
    // 七日供物：過去7日間のデータ
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyOfferings = offerings
      .filter(offering => offering.createdAt >= weekAgo)
      .sort((a, b) => b.likes - a.likes);

    return {
      eternal: eternalOfferings,
      seasonal: seasonalOfferings,
      monthly: monthlyOfferings,
      weekly: weeklyOfferings
    };
  }, [offerings]);

  return (
    <div className="space-y-6">
      {/* ランキングタブ */}
      <Tabs value={activeRanking} onValueChange={setActiveRanking} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card/50 backdrop-blur-sm p-1">
          <TabsTrigger 
            value="eternal" 
            className="text-xs md:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Infinity size={16} className="mr-1" />
            <span className="hidden sm:inline">永久供物</span>
            <span className="sm:hidden">永久</span>
          </TabsTrigger>
          <TabsTrigger 
            value="seasonal" 
            className="text-xs md:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Calendar size={16} className="mr-1" />
            <span className="hidden sm:inline">季節供物</span>
            <span className="sm:hidden">季節</span>
          </TabsTrigger>
          <TabsTrigger 
            value="monthly" 
            className="text-xs md:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Calendar size={16} className="mr-1" />
            <span className="hidden sm:inline">月満供物</span>
            <span className="sm:hidden">月満</span>
          </TabsTrigger>
          <TabsTrigger 
            value="weekly" 
            className="text-xs md:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Clock size={16} className="mr-1" />
            <span className="hidden sm:inline">七日供物</span>
            <span className="sm:hidden">七日</span>
          </TabsTrigger>
        </TabsList>

        {/* 永久供物ランキング */}
        <TabsContent value="eternal" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-primary mb-2">永久供物の間</h2>
            <p className="text-sm text-muted-foreground">
              時を超えて愛され続ける、不朽の供物たち
            </p>
          </div>
          
          <div className="space-y-4">
            {rankingData.eternal.slice(0, 10).map((offering, index) => (
              <OfferingCard 
                key={offering.id} 
                offering={offering} 
                rank={index + 1}
                showInteractions={true}
              />
            ))}
            {rankingData.eternal.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-lg mb-2">まだ供物が捧げられていません</div>
                <div className="text-sm opacity-75">最初の供物を投稿してみませんか？</div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 季節供物ランキング */}
        <TabsContent value="seasonal" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-primary mb-2">季節供物の間</h2>
            <p className="text-sm text-muted-foreground">
              四季の移ろいと共に輝く、季節限定の供物たち
            </p>
          </div>
          
          <div className="space-y-4">
            {rankingData.seasonal.slice(0, 10).map((offering, index) => (
              <OfferingCard 
                key={offering.id} 
                offering={offering} 
                rank={index + 1}
                showInteractions={true}
              />
            ))}
            {rankingData.seasonal.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-lg mb-2">この季節の供物はまだありません</div>
                <div className="text-sm opacity-75">季節の変化を感じる供物を投稿してみませんか？</div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 月満供物ランキング */}
        <TabsContent value="monthly" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-primary mb-2">月満供物の間</h2>
            <p className="text-sm text-muted-foreground">
              満月の夜に映える、今月の優秀な供物たち
            </p>
          </div>
          
          <div className="space-y-4">
            {rankingData.monthly.slice(0, 10).map((offering, index) => (
              <OfferingCard 
                key={offering.id} 
                offering={offering} 
                rank={index + 1}
                showInteractions={true}
              />
            ))}
            {rankingData.monthly.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-lg mb-2">今月の供物はまだありません</div>
                <div className="text-sm opacity-75">新月から満月へ、今月の成果を共有しませんか？</div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 七日供物ランキング */}
        <TabsContent value="weekly" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-primary mb-2">七日供物の間</h2>
            <p className="text-sm text-muted-foreground">
              一週間で最も注目を集めた、新鮮な供物たち
            </p>
          </div>
          
          <div className="space-y-4">
            {rankingData.weekly.slice(0, 10).map((offering, index) => (
              <OfferingCard 
                key={offering.id} 
                offering={offering} 
                rank={index + 1}
                showInteractions={true}
              />
            ))}
            {rankingData.weekly.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-lg mb-2">今週の供物はまだありません</div>
                <div className="text-sm opacity-75">新しい一週間の始まり、今週の成果を記録してみませんか？</div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};