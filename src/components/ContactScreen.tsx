import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Send, Mail, Bug, Lightbulb, HelpCircle } from 'lucide-react';
import { useApp } from './AppContext';
import { toast } from 'sonner';

// 囁き（お問い合わせ）画面コンポーネント
export const ContactScreen: React.FC = () => {
  const { setCurrentScreen, currentUser } = useApp();
  
  // フォームの状態管理
  const [contactData, setContactData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    category: '',
    subject: '',
    message: ''
  });

  // フォーム送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactData.category || !contactData.subject || !contactData.message) {
      toast.error('すべての必須項目を入力してください');
      return;
    }

    // 実際のアプリでは、ここでAPIを呼び出してお問い合わせを送信
    console.log('お問い合わせ送信:', contactData);
    toast.success('囁きを神々に届けました。ありがとうございます。');
    
    // フォームをリセット
    setContactData(prev => ({
      ...prev,
      category: '',
      subject: '',
      message: ''
    }));
  };

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
            <h1 className="text-primary">囁き（お問い合わせ）</h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto p-4 max-w-2xl">
        <div className="space-y-6">
          {/* イントロダクション */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary flex items-center space-x-2">
                <Mail size={20} />
                <span>神々への囁き</span>
              </CardTitle>
              <CardDescription>
                供物台についてのご質問、ご要望、不具合報告など、
                どのような囁きでもお気軽にお聞かせください。
                神々（制作者）が真摯にお答えいたします。
              </CardDescription>
            </CardHeader>
          </Card>

          {/* お問い合わせフォーム */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">囁きの内容</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">お名前</Label>
                    <Input
                      id="name"
                      value={contactData.name}
                      onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="禊 ミコト"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">符丁（メール）</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="mikoto@shrine.jp"
                      disabled
                    />
                  </div>
                </div>

                {/* お問い合わせカテゴリ */}
                <div className="space-y-2">
                  <Label htmlFor="category">囁きの種類 *</Label>
                  <Select 
                    value={contactData.category} 
                    onValueChange={(value) => setContactData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="お問い合わせの種類を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">
                        <div className="flex items-center space-x-2">
                          <HelpCircle size={16} />
                          <span>質問・使い方について</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bug">
                        <div className="flex items-center space-x-2">
                          <Bug size={16} />
                          <span>不具合・エラーの報告</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="feature">
                        <div className="flex items-center space-x-2">
                          <Lightbulb size={16} />
                          <span>機能追加・改善の提案</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center space-x-2">
                          <Mail size={16} />
                          <span>その他</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 件名 */}
                <div className="space-y-2">
                  <Label htmlFor="subject">件名 *</Label>
                  <Input
                    id="subject"
                    value={contactData.subject}
                    onChange={(e) => setContactData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="囁きの要約をご記入ください"
                    required
                  />
                </div>

                {/* メッセージ */}
                <div className="space-y-2">
                  <Label htmlFor="message">詳細な内容 *</Label>
                  <Textarea
                    id="message"
                    value={contactData.message}
                    onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="具体的な内容、状況、ご要望などを詳しくお聞かせください..."
                    className="min-h-32"
                    required
                  />
                </div>

                {/* 送信ボタン */}
                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 transition-colors"
                >
                  <Send size={16} className="mr-2" />
                  囁きを神々に届ける
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 注意事項 */}
          <Card className="shadow-lg border-2 border-border/50 bg-accent/10">
            <CardHeader>
              <CardTitle className="text-primary">ご注意</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 個人情報の取り扱いには十分注意しております</li>
                <li>• 返信には数日お時間をいただく場合があります</li>
                <li>• 技術的な問題の場合は、具体的な手順や環境をお教えください</li>
                <li>• 建設的なフィードバックをお待ちしております</li>
              </ul>
            </CardContent>
          </Card>

          {/* よくある質問 */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">よくある囁き</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h5 className="text-primary">Q. 供物を削除することはできますか？</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    現在、投稿した供物の削除機能は実装されていません。今後のアップデートで対応予定です。
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h5 className="text-primary">Q. パスワードを忘れてしまいました</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    パスワードリセット機能は開発中です。お問い合わせフォームからご連絡ください。
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h5 className="text-primary">Q. 通知機能はありますか？</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    現在開発中の機能です。祈念やコメントの通知機能を予定しています。
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h5 className="text-primary">Q. モバイルアプリの予定は？</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    現在はWebアプリのみですが、将来的にはモバイルアプリの開発も検討しています。
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