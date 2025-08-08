import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useApp } from './AppContext';
import { TrendingUp, Sparkles, Clock, Users } from 'lucide-react';

// 右サイドバーコンポーネント - 神秘的な追加情報
export const RightSidebar: React.FC = () => {
  const { offerings, users, setCurrentScreen, setSelectedUserId, getUserById } = useApp();

  // 人気のジャンルを計算
  const popularGenres = useMemo(() => {
    const genreCount: Record<string, number> = {};
    offerings.forEach(offering => {
      offering.genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + offering.likes;
      });
    });
    
    return Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([genre, count]) => ({ genre, count }));
  }, [offerings]);

  // 最近活動的なユーザーを計算
  const activeUsers = useMemo(() => {
    const userActivity: Record<string, number> = {};
    const recentDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7日前

    offerings.forEach(offering => {
      if (offering.createdAt >= recentDate) {
        userActivity[offering.authorId] = (userActivity[offering.authorId] || 0) + offering.likes + offering.comments.length;
      }
    });

    return Object.entries(userActivity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([userId, score]) => ({ user: getUserById(userId), score }))
      .filter(item => item.user);
  }, [offerings, getUserById]);

  // 神託メッセージ（ランダム）
  const oracleMessages = [
    "森の精霊たちが今日も見守っています",
    "月の満ち欠けと共に、新たな供物が生まれる",
    "風のささやきに耳を傾けてみてください",
    "今日は特別な一日になりそうです",
    "古の知恵が新しい形で蘇る時",
    "星々の配列が創造力を高めています",
    "季節の移ろいに心を委ねましょう",
    "神秘の扉が少しだけ開かれています"
  ];

  const todayOracle = oracleMessages[new Date().getDate() % oracleMessages.length];

  // 最近の活動
  const recentActivity = useMemo(() => {
    return offerings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }, [offerings]);

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentScreen('userProfile');
  };

  return (
    <div className="space-y-6">
      {/* 今日の神託 */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 premium-shadow mystical-glow value-enhancement">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-primary content-hierarchy-2">
            <Sparkles size={22} className="haptic-feedback" />
            <span className="text-lg high-contrast-text">今日の神託</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="professional-spacing">
          <p className="text-sm text-muted-foreground italic leading-relaxed high-contrast-text">
            "{todayOracle}"
          </p>
        </CardContent>
      </Card>

      {/* 人気のジャンル */}
      <Card className="premium-shadow mystical-glow value-enhancement">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-primary content-hierarchy-2">
            <TrendingUp size={22} className="haptic-feedback" />
            <span className="text-lg high-contrast-text">人気の領域</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="professional-spacing">
          <div className="flex flex-wrap gap-2">
            {popularGenres.map(({ genre, count }) => (
              <Badge 
                key={genre} 
                variant="secondary" 
                className="text-xs hover:bg-primary/20 transition-colors cursor-pointer interactive-element haptic-feedback"
                role="button"
                tabIndex={0}
              >
                【{genre}】{count > 10 && '🔥'}
              </Badge>
            ))}
          </div>
          {popularGenres.length === 0 && (
            <p className="text-xs text-muted-foreground">
              まだ人気のジャンルがありません
            </p>
          )}
        </CardContent>
      </Card>

      {/* 活発な供奉者たち */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Users size={20} />
            <span className="text-lg">活発な供奉者</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeUsers.map(({ user, score }, index) => (
              <Button
                key={user?.id}
                variant="ghost"
                className="w-full justify-start h-auto p-2 hover:bg-accent/30 large-clickable interactive-element haptic-feedback click-animation"
                onClick={() => user && handleUserClick(user.id)}
                aria-label={`${user?.name}のプロフィールを表示`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-xs bg-primary/10">
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground font-bold">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium truncate">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      活動度: {score}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
            {activeUsers.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                最近の活動がありません
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 最近の動向 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Clock size={20} />
            <span className="text-lg">最近の動向</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((offering) => {
              const author = getUserById(offering.authorId);
              return (
                <div key={offering.id} className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={author?.avatar} alt={offering.author} />
                      <AvatarFallback className="text-xs bg-accent">
                        {offering.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto hover:bg-transparent"
                      onClick={() => author && handleUserClick(author.id)}
                    >
                      <span className="text-primary hover:underline font-medium">
                        {offering.author}
                      </span>
                    </Button>
                    <span className="text-muted-foreground">が</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate ml-7">
                    「{offering.title}」を投稿
                  </p>
                  <div className="text-xs text-muted-foreground ml-7 mt-1">
                    {offering.likes}の祈念 • {offering.comments.length}の導き
                  </div>
                </div>
              );
            })}
            {recentActivity.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                最近の活動がありません
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 神秘の統計 */}
      <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-primary text-lg">森の統計</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">総供物数</span>
              <span className="font-medium">{offerings.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">供奉者数</span>
              <span className="font-medium">{users.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">総祈念数</span>
              <span className="font-medium">
                {offerings.reduce((sum, offering) => sum + offering.likes, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">総導き数</span>
              <span className="font-medium">
                {offerings.reduce((sum, offering) => sum + offering.comments.length, 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};