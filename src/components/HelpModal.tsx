import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Crown, Search, Plus, Heart, MessageCircle, TreePine, Moon, Sun } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 使い方モーダルコンポーネント
export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary flex items-center space-x-2">
            <TreePine size={24} />
            <span>供物台の使い方</span>
          </DialogTitle>
          <DialogDescription>
            供物台の基本的な使い方と機能について詳しく説明します。ランキング、検索、投稿機能の利用方法を学べます。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 概要 */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">供物台とは</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                供物台は、日々の成果や学び、体験を「供物」として投稿し、
                森の仲間と共有するプラットフォームです。
                投稿された供物は他の人からの「祈念（いいね）」や「導き（コメント）」を通じて、
                互いに励まし合い、成長を促進する場となっています。
              </p>
            </CardContent>
          </Card>

          {/* 基本操作 */}
          <div className="space-y-4">
            <h3 className="text-primary text-lg font-medium">基本的な使い方</h3>
            
            {/* 審神の壇 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown size={20} className="text-primary" />
                  <span>審神の壇</span>
                </CardTitle>
                <CardDescription>
                  供物のランキングを確認できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">4種類のランキング</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">永久供物</Badge>
                      <span className="text-sm text-muted-foreground">累計祈念数でランキング</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">季節供物</Badge>
                      <span className="text-sm text-muted-foreground">四半期ごとの祈念数</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">月満供物</Badge>
                      <span className="text-sm text-muted-foreground">月間の祈念数</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">七日供物</Badge>
                      <span className="text-sm text-muted-foreground">週間の祈念数</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>💡 ヒント：</strong> 
                    供物をタップすると詳細画面が開き、「導き（コメント）」の閲覧や投稿ができます。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 探求の壇 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search size={20} className="text-primary" />
                  <span>探求の壇</span>
                </CardTitle>
                <CardDescription>
                  供物を検索・フィルタリングできます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">検索・フィルタ機能</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• キーワードで供物の題名や内容を検索</li>
                    <li>• ジャンルでの絞り込み（複数選択可能）</li>
                    <li>• 投稿者名での絞り込み</li>
                    <li>• 祈念数、導き数、投稿日時での並び替え</li>
                  </ul>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>💡 ヒント：</strong> 
                    「詳細な探求」ボタンで高度なフィルタリングオプションが利用できます。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 献納の壇 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus size={20} className="text-primary" />
                  <span>献納の壇</span>
                </CardTitle>
                <CardDescription>
                  新しい供物を投稿できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">投稿時の入力項目</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <strong>題名：</strong> 供物の要約（100文字以内）</li>
                    <li>• <strong>内容：</strong> 詳細な説明（10〜2000文字）</li>
                    <li>• <strong>ジャンル：</strong> 供物の種類を示すタグ（複数選択可）</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">利用可能なジャンル例</h4>
                  <div className="flex flex-wrap gap-1">
                    {['修練', '日々', '証明', '挑戦', '学習', '創作', '発見', '体験'].map(genre => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        【{genre}】
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>💡 ヒント：</strong> 
                    具体的で他の人の学びにもなる内容を心がけると、より多くの祈念や導きをいただけます。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 交流機能 */}
          <div className="space-y-4">
            <h3 className="text-primary text-lg font-medium">交流機能</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>祈念と導き</CardTitle>
                <CardDescription>
                  他の人の供物に対してリアクションできます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Heart size={16} className="text-primary" />
                      <h4 className="font-medium">祈念（いいね）</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      供物に対する共感や応援の気持ちを表現できます。
                      1回のタップで簡単に祈念でき、再度タップで取り消すこともできます。
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MessageCircle size={16} className="text-primary" />
                      <h4 className="font-medium">導き（コメント）</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      より詳細な感想やアドバイス、質問などを投稿できます。
                      建設的な対話を通じて、お互いの成長を促進しましょう。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* その他の機能 */}
          <div className="space-y-4">
            <h3 className="text-primary text-lg font-medium">その他の機能</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>テーマとプロフィール</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Sun size={16} className="text-yellow-500" />
                        <Moon size={16} className="text-blue-500" />
                      </div>
                      <h4 className="font-medium">配色切り替え</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      秋色（暖色）と冬色（寒色）の間で配色を切り替えて、
                      お好みの雰囲気でアプリを利用できます。
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">写し絵（プロフィール）</h4>
                    <p className="text-sm text-muted-foreground">
                      ハンバーガーメニューから自分の活動統計や最近の投稿を確認、
                      プロフィール情報の編集ができます。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 利用の心得 */}
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle>供物台利用の心得</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• <strong>敬意を持って：</strong> 他者の成果や体験を尊重し、建設的なコミュニケーションを心がけましょう</p>
                <p>• <strong>具体性を重視：</strong> 抽象的でなく、具体的で学びのある内容を共有しましょう</p>
                <p>• <strong>継続的な参加：</strong> 定期的な投稿と他者への反応で、活発なコミュニティを育てましょう</p>
                <p>• <strong>個人情報保護：</strong> 機密情報や個人を特定できる情報は投稿しないでください</p>
                <p>• <strong>失敗も価値：</strong> 成功談だけでなく、失敗談や学びのプロセスも価値ある供物です</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};