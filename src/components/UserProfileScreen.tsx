import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Calendar, MapPin, Award, Heart, MessageCircle, FileText } from 'lucide-react';
import { useApp } from './AppContext';
import { OfferingCard } from './OfferingCard';

// ユーザープロフィール表示画面コンポーネント
export const UserProfileScreen: React.FC = () => {
  const { 
    setCurrentScreen, 
    selectedUserId, 
    getUserById, 
    getOfferingsByUserId, 
    getLikedOfferingsByUserId, 
    getCommentedOfferingsByUserId,
  /*   currentUser  */
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('offerings');

  // 選択されたユーザーの情報を取得
  const user = selectedUserId ? getUserById(selectedUserId) : null;
  const userOfferings = selectedUserId ? getOfferingsByUserId(selectedUserId) : [];
  const likedOfferings = selectedUserId ? getLikedOfferingsByUserId(selectedUserId) : [];
  const commentedOfferings = selectedUserId ? getCommentedOfferingsByUserId(selectedUserId) : [];

  // ユーザーが見つからない場合
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="shadow-lg border-2 border-border/50">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">ユーザーが見つかりません</p>
            <Button onClick={() => setCurrentScreen('main')}>
              メインに戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 加入からの日数計算
  const daysSinceJoined = Math.floor((new Date().getTime() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen('main')}
              className="hover:bg-accent/50 transition-colors"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-primary">
              {user.name}の写し絵
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto p-4 max-w-4xl">
        <div className="space-y-6">
          {/* プロフィールヘッダー */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* アバター */}
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={user.avatar} alt={`${user.name}のアバター`} />
                  <AvatarFallback className="text-4xl bg-accent text-primary">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* 基本情報 */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl text-primary">{user.name}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{user.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{user.age}</span>
                      </div>
                    </div>
                  </div>

                  {/* 統計情報 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center bg-accent/20 p-3 rounded-lg">
                      <div className="text-xl text-primary">{user.offeringCount}</div>
                      <div className="text-sm text-muted-foreground">供物</div>
                    </div>
                    <div className="text-center bg-accent/20 p-3 rounded-lg">
                      <div className="text-xl text-primary">{user.totalLikes}</div>
                      <div className="text-sm text-muted-foreground">総祈念</div>
                    </div>
                    <div className="text-center bg-accent/20 p-3 rounded-lg">
                      <div className="text-xl text-primary">{user.totalComments}</div>
                      <div className="text-sm text-muted-foreground">総導き</div>
                    </div>
                    <div className="text-center bg-accent/20 p-3 rounded-lg">
                      <div className="text-xl text-primary">{daysSinceJoined}</div>
                      <div className="text-sm text-muted-foreground">参拝日数</div>
                    </div>
                  </div>

                  {/* 称号・バッジ（デモ用） */}
                  <div className="space-y-2">
                    <h4 className="text-sm text-primary">授けられた称号</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.offeringCount >= 20 && (
                        <Badge variant="secondary" className="bg-autumn-gold/20 text-autumn-warm">
                          <Award size={12} className="mr-1" />
                          多作の者
                        </Badge>
                      )}
                      {user.totalLikes >= 100 && (
                        <Badge variant="secondary" className="bg-winter-primary/20 text-winter-deep">
                          <Heart size={12} className="mr-1" />
                          愛された者
                        </Badge>
                      )}
                      {user.totalComments >= 50 && (
                        <Badge variant="secondary" className="bg-autumn-accent/20 text-autumn-crimson">
                          <MessageCircle size={12} className="mr-1" />
                          導きの者
                        </Badge>
                      )}
                      {daysSinceJoined >= 100 && (
                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                          <Calendar size={12} className="mr-1" />
                          古参の者
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 活動タブ */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
              <TabsTrigger 
                value="offerings" 
                className="flex items-center space-x-2 transition-all hover:bg-accent/70"
              >
                <FileText size={16} />
                <span>投稿した供物 ({userOfferings.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="liked" 
                className="flex items-center space-x-2 transition-all hover:bg-accent/70"
              >
                <Heart size={16} />
                <span>祈念した供物 ({likedOfferings.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="commented" 
                className="flex items-center space-x-2 transition-all hover:bg-accent/70"
              >
                <MessageCircle size={16} />
                <span>導いた供物 ({commentedOfferings.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* 投稿した供物 */}
            <TabsContent value="offerings">
              <div className="space-y-4">
                {userOfferings.length > 0 ? (
                  userOfferings.map((offering) => (
                    <OfferingCard key={offering.id} offering={offering} />
                  ))
                ) : (
                  <Card className="shadow-lg border-2 border-border/50">
                    <CardContent className="p-8 text-center">
                      <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {user.name}はまだ供物を投稿していません
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* 祈念した供物 */}
            <TabsContent value="liked">
              <div className="space-y-4">
                {likedOfferings.length > 0 ? (
                  likedOfferings.map((offering) => (
                    <OfferingCard key={offering.id} offering={offering} />
                  ))
                ) : (
                  <Card className="shadow-lg border-2 border-border/50">
                    <CardContent className="p-8 text-center">
                      <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {user.name}はまだ供物に祈念していません
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* 導いた供物 */}
            <TabsContent value="commented">
              <div className="space-y-4">
                {commentedOfferings.length > 0 ? (
                  commentedOfferings.map((offering) => {
                    // このユーザーのコメントのみ表示
                    const userComments = offering.comments.filter(comment => comment.authorId === user.id);
                    return (
                      <Card key={offering.id} className="shadow-lg border-2 border-border/50">
                        <CardContent className="p-6">
                          {/* 供物の基本情報 */}
                          <div className="border-b border-border pb-4 mb-4">
                            <h4 className="text-primary">{offering.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              投稿者: {offering.author} • {offering.createdAt.toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                          
                          {/* ユーザーのコメント */}
                          <div className="space-y-3">
                            <h5 className="text-sm text-primary">
                              {user.name}の導き:
                            </h5>
                            {userComments.map((comment) => (
                              <div key={comment.id} className="bg-accent/20 p-3 rounded-lg">
                                <p className="text-sm">{comment.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {comment.createdAt.toLocaleDateString('ja-JP')} {comment.createdAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="shadow-lg border-2 border-border/50">
                    <CardContent className="p-8 text-center">
                      <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {user.name}はまだ供物に導きを与えていません
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* 追加情報（参拝履歴など） */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">参拝の記録</CardTitle>
              <CardDescription>
                {user.name}の供物台での活動履歴
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">初回参拝日</span>
                  <span className="text-primary">
                    {user.joinedAt.toLocaleDateString('ja-JP')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">参拝継続日数</span>
                  <span className="text-primary">
                    {daysSinceJoined}日
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">平均祈念数（1投稿あたり）</span>
                  <span className="text-primary">
                    {user.offeringCount > 0 ? Math.round(user.totalLikes / user.offeringCount) : 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">最も活動的なジャンル</span>
                  <span className="text-primary">
                    {/* 最も多く投稿しているジャンルを計算（デモ用） */}
                    {userOfferings.length > 0 ? 
                      userOfferings[0].genres[0] || '未分類' : 
                      '未分類'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};