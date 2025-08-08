import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Crown, Search, Plus, Heart, MessageCircle, Users } from 'lucide-react';
import { useApp } from './AppContext';

// 使い方画面コンポーネント
export const HelpScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();

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
            <h1 className="text-primary">使い方</h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto p-4 max-w-4xl">
        <div className="space-y-6">
          {/* イントロダクション */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary flex items-center space-x-2">
                <span>供物台へようこそ</span>
              </CardTitle>
              <CardDescription>
                この神秘的な場所で、あなたの想いや成果を供物として捧げ、
                他の参拝者と共に祈念（いいね）や導き（コメント）を通じて交流しましょう。
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 基本機能の説明 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 審神の壇 */}
            <Card className="shadow-lg border-2 border-border/50">
              <CardHeader>
                <CardTitle className="text-primary flex items-center space-x-2">
                  <Crown size={20} className="text-autumn-gold" />
                  <span>審神の壇</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  最も多くの祈念（いいね）を集めた供物や、活発な導き（コメント）がある供物を確認できます。
                </p>
                <ul className="text-sm space-y-2">
                  <li>• 祈念数ランキング</li>
                  <li>• 導き数ランキング</li>
                  <li>• 最新投稿の確認</li>
                </ul>
              </CardContent>
            </Card>

            {/* 探求の壇 */}
            <Card className="shadow-lg border-2 border-border/50">
              <CardHeader>
                <CardTitle className="text-primary flex items-center space-x-2">
                  <Search size={20} className="text-winter-primary" />
                  <span>探求の壇</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  キーワードやジャンルで供物を検索し、興味のある内容を見つけることができます。
                </p>
                <ul className="text-sm space-y-2">
                  <li>• キーワード検索</li>
                  <li>• ジャンル絞り込み</li>
                  <li>• 並び替え機能</li>
                </ul>
              </CardContent>
            </Card>

            {/* 献納の壇 */}
            <Card className="shadow-lg border-2 border-border/50">
              <CardHeader>
                <CardTitle className="text-primary flex items-center space-x-2">
                  <Plus size={20} className="text-autumn-accent" />
                  <span>献納の壇</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  あなたの学習成果や想いを供物として投稿し、他の参拝者と共有できます。
                </p>
                <ul className="text-sm space-y-2">
                  <li>• 題名と内容の入力</li>
                  <li>• ジャンルの選択</li>
                  <li>• 供物の投稿</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* 祈念と導きの説明 */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">祈念と導きについて</CardTitle>
              <CardDescription>
                供物台での主要なコミュニケーション機能について詳しく説明します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Heart size={24} className="text-destructive" />
                    <div>
                      <h4 className="text-primary">祈念（いいね）</h4>
                      <p className="text-sm text-muted-foreground">
                        供物に共感や賞賛の気持ちを表現します。ハートアイコンをクリックするだけで簡単に祈念できます。
                      </p>
                    </div>
                  </div>
                  
                  <ul className="text-sm text-muted-foreground space-y-1 ml-9">
                    <li>• 一度祈念すると再度クリックで取り消し可能</li>
                    <li>• 祈念数は供物の人気度を示します</li>
                    <li>• 自分の供物にも祈念できます</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle size={24} className="text-primary" />
                    <div>
                      <h4 className="text-primary">導き（コメント）</h4>
                      <p className="text-sm text-muted-foreground">
                        供物に対する具体的なフィードバックや質問、感想を記入できます。
                      </p>
                    </div>
                  </div>
                  
                  <ul className="text-sm text-muted-foreground space-y-1 ml-9">
                    <li>• 建設的なコメントを心がけましょう</li>
                    <li>• 質問や追加情報の要求も歓迎</li>
                    <li>• 他の参拝者との議論も可能</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ユーザープロフィールの説明 */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary flex items-center space-x-2">
                <Users size={20} />
                <span>写し絵（プロフィール）機能</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  他の参拝者の名前やアイコンをクリックすると、その人の活動を確認できます。
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <h5 className="text-primary mb-2">投稿した供物</h5>
                    <p className="text-sm text-muted-foreground">
                      その人が投稿したすべての供物を時系列で確認
                    </p>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <h5 className="text-primary mb-2">祈念した供物</h5>
                    <p className="text-sm text-muted-foreground">
                      その人が祈念（いいね）した供物の一覧
                    </p>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <h5 className="text-primary mb-2">導きを与えた供物</h5>
                    <p className="text-sm text-muted-foreground">
                      その人がコメントした供物とコメント内容
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ジャンルについて */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">ジャンル分類について</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <h5 className="text-primary">学習・成長</h5>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 学習</li>
                    <li>• 修練</li>
                    <li>• 挑戦</li>
                  </ul>
                </div>
                
                <div className="space-y-1">
                  <h5 className="text-primary">創作・表現</h5>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 創作</li>
                    <li>• 写真</li>
                    <li>• 料理</li>
                  </ul>
                </div>
                
                <div className="space-y-1">
                  <h5 className="text-primary">知識・研究</h5>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 研究</li>
                    <li>• 証明</li>
                    <li>• 技術</li>
                  </ul>
                </div>
                
                <div className="space-y-1">
                  <h5 className="text-primary">精神・哲学</h5>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 思索</li>
                    <li>• 哲学</li>
                    <li>• 瞑想</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 季節テーマについて */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">季節テーマの切り替え</CardTitle>
              <CardDescription>
                ヘッダーの月/太陽アイコンで、秋と冬のテーマを切り替えできます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h5 className="text-autumn-primary">🍂 秋のテーマ</h5>
                  <p className="text-sm text-muted-foreground">
                    暖かみのある深紅、琥珀、橙色の色調で、落ち着いた雰囲気を演出します。
                    学習や思索の時期にふさわしい温もりを感じられます。
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-winter-primary">❄️ 冬のテーマ</h5>
                  <p className="text-sm text-muted-foreground">
                    清涼感のある青、藍、氷色の色調で、澄んだ空気感を表現します。
                    集中と静寂を求める時期に適した凛とした雰囲気です。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};