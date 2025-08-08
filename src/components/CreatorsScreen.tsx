import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, TreePine, Github, Twitter, Globe, Mail } from 'lucide-react';
import { useApp } from './AppContext';
import { creatorsData } from './data/creatorsData';

// 制作者画面コンポーネント
export const CreatorsScreen: React.FC = () => {
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
            <h1 className="text-primary flex items-center space-x-2">
              <TreePine size={24} />
              <span>制作者たち</span>
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto p-4 max-w-6xl">
        <div className="space-y-8">
          {/* 概要 */}
          <Card className="shadow-lg border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary text-center">森の守り人たち</CardTitle>
              <CardDescription className="text-center">
                供物台の創造と運営に携わる、神秘的な技能を持つ者たちをご紹介します。<br />
                それぞれが異なる専門性を持ち、この幻想的な世界の構築に貢献しています。
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 制作者一覧 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {creatorsData.map((creator) => (
              <Card key={creator.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-border/50">
                <CardHeader>
                  <div className="flex items-start space-x-6">
                    <Avatar className="w-20 h-20 border-4 border-primary/20">
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {creator.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">{creator.name}</CardTitle>
                      <CardDescription className="mt-2 text-base">
                        {creator.role}
                      </CardDescription>
                      
                      {/* 連絡先リンク（デモ用） */}
                      <div className="flex space-x-2 mt-3">
                        <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                          <Github size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                          <Twitter size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                          <Mail size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* 詳細な説明 */}
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      {creator.description}
                    </p>
                    
                    {/* 追加の背景情報 */}
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h5 className="text-primary mb-2">森での活動歴</h5>
                      <p className="text-sm text-muted-foreground">
                        {creator.id === 'creator1' && 
                          '長年にわたり神秘的なユーザーインターフェースの設計に従事。直感的で美しい体験の創造を信条とする。'
                        }
                        {creator.id === 'creator2' && 
                          '複雑なロジックを魔法のように動作させる技術者。パフォーマンスと保守性の両立を追求している。'
                        }
                        {creator.id === 'creator3' && 
                          '神秘的な色彩とタイポグラフィの専門家。季節の移ろいを視覚的に表現することに情熱を注ぐ。'
                        }
                        {creator.id === 'creator4' && 
                          '利用者の心に寄り添うプロダクト設計の専門家。誰もが使いやすい体験の創造を目指している。'
                        }
                      </p>
                    </div>
                  </div>

                  {/* 専門分野 */}
                  <div className="space-y-3">
                    <h4 className="text-primary">専門分野</h4>
                    <div className="flex flex-wrap gap-2">
                      {creator.specialties.map((specialty, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-sm hover:bg-accent transition-colors"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 技術スタック（追加情報） */}
                  <div className="space-y-3">
                    <h4 className="text-primary">使用する魔法（技術）</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {creator.id === 'creator1' && (
                        <>
                          <span>• React & TypeScript</span>
                          <span>• Tailwind CSS</span>
                          <span>• Figma</span>
                          <span>• Framer Motion</span>
                        </>
                      )}
                      {creator.id === 'creator2' && (
                        <>
                          <span>• Node.js & Express</span>
                          <span>• PostgreSQL</span>
                          <span>• Docker</span>
                          <span>• AWS Services</span>
                        </>
                      )}
                      {creator.id === 'creator3' && (
                        <>
                          <span>• Adobe Creative Suite</span>
                          <span>• CSS Animation</span>
                          <span>• Color Theory</span>
                          <span>• Design Systems</span>
                        </>
                      )}
                      {creator.id === 'creator4' && (
                        <>
                          <span>• User Research</span>
                          <span>• Prototyping</span>
                          <span>• Analytics</span>
                          <span>• A/B Testing</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 神秘的な格言 */}
                  <div className="bg-gradient-to-r from-primary/10 to-accent/20 p-4 rounded-lg border-l-4 border-primary/30">
                    <p className="text-sm italic text-muted-foreground leading-relaxed">
                      「{creator.mysticalQuote}」
                    </p>
                  </div>

                  {/* 個人的な目標（追加） */}
                  <div className="border-t border-border pt-4">
                    <h5 className="text-primary mb-2">森への願い</h5>
                    <p className="text-sm text-muted-foreground">
                      {creator.id === 'creator1' && 
                        '利用者が心地よく過ごせる、美しく機能的な空間を継続的に改善していきたい'
                      }
                      {creator.id === 'creator2' && 
                        '安定性とパフォーマンスを兼ね備えた、信頼できるシステムを構築し続けたい'
                      }
                      {creator.id === 'creator3' && 
                        '季節ごとに移り変わる美しい視覚体験で、利用者の感性に響きたい'
                      }
                      {creator.id === 'creator4' && 
                        'すべての人が平等にアクセスでき、使いやすいプロダクトを実現したい'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* プロジェクトの歴史 */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">供物台の歴史</CardTitle>
              <CardDescription>
                このプロジェクトがどのように生まれ、育まれてきたかの物語
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-primary/30"></div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-2 top-4 w-4 h-4 bg-primary rounded-full"></div>
                    <h4 className="text-primary">2024年初頭 - 構想の始まり</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      学習成果を共有し、互いに励まし合える場所の必要性を感じ、森の中に神秘的な供物台のアイデアが生まれました。
                    </p>
                  </div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-2 top-4 w-4 h-4 bg-primary rounded-full"></div>
                    <h4 className="text-primary">設計・デザイン期</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      日本の神秘的な要素と現代的なUI/UXを融合し、季節感のある美しいデザインシステムを構築しました。
                    </p>
                  </div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-2 top-4 w-4 h-4 bg-primary rounded-full"></div>
                    <h4 className="text-primary">開発・実装期</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      React、TypeScript、Tailwind CSSを使用し、レスポンシブで直感的なユーザーインターフェースを実現しました。
                    </p>
                  </div>
                  
                  <div className="relative pl-12">
                    <div className="absolute left-2 top-4 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
                    <h4 className="text-primary">現在 - 継続的な改善</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      利用者の皆様からのフィードバックを基に、日々機能の追加と改善を続けています。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 感謝のメッセージ */}
          <Card className="shadow-lg border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
            <CardHeader>
              <CardTitle className="text-primary text-center">森への感謝</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  供物台は、森の仲間たちの協力と、利用者の皆様の温かい支援によって成り立っています。
                  日々の成果や学びを共有し、お互いを励まし合う、この美しいコミュニティを
                  これからも大切に育てていきたいと思います。
                </p>
                
                <div className="flex justify-center space-x-8 py-4">
                  <div className="text-center">
                    <div className="text-2xl text-primary">🌸</div>
                    <p className="text-sm text-muted-foreground mt-1">感謝</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-primary">🍂</div>
                    <p className="text-sm text-muted-foreground mt-1">成長</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-primary">❄️</div>
                    <p className="text-sm text-muted-foreground mt-1">調和</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-primary">🌿</div>
                    <p className="text-sm text-muted-foreground mt-1">希望</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <p className="text-primary italic">
                    ー 森の奥深くより、心を込めて ー
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 今後の展望 */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">未来への道筋</CardTitle>
              <CardDescription>
                供物台の今後の発展予定について
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h5 className="text-primary mb-2">🔔 通知機能</h5>
                  <p className="text-sm text-muted-foreground">
                    祈念やコメントを受けた際の通知システムの実装
                  </p>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h5 className="text-primary mb-2">📱 モバイル対応</h5>
                  <p className="text-sm text-muted-foreground">
                    よりモバイルフレンドリーな操作性の向上
                  </p>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h5 className="text-primary mb-2">🎨 テーマ追加</h5>
                  <p className="text-sm text-muted-foreground">
                    春・夏のテーマや個人設定可能なカラー
                  </p>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h5 className="text-primary mb-2">🏆 実績システム</h5>
                  <p className="text-sm text-muted-foreground">
                    投稿数や祈念数に基づく称号・バッジ機能
                  </p>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h5 className="text-primary mb-2">🔍 高度な検索</h5>
                  <p className="text-sm text-muted-foreground">
                    AIを活用した関連投稿の推薦システム
                  </p>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h5 className="text-primary mb-2">👥 グループ機能</h5>
                  <p className="text-sm text-muted-foreground">
                    学習グループやプロジェクトチーム機能
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