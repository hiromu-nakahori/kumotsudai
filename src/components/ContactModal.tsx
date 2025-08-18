import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// お問い合わせモーダルコンポーネント
export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // フォーム入力値の更新
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.category) {
      newErrors.category = 'お問い合わせの種類を選択してください';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '件名を入力してください';
    } else if (formData.subject.length > 100) {
      newErrors.subject = '件名は100文字以内で入力してください';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'お問い合わせ内容を入力してください';
    } else if (formData.content.length < 10) {
      newErrors.content = '内容は10文字以上で入力してください';
    } else if (formData.content.length > 1000) {
      newErrors.content = '内容は1000文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // お問い合わせ送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('入力内容に不備があります');
      return;
    }

    setIsSubmitting(true);

    try {
      // 実際のアプリでは、ここでAPIを呼び出してバックエンドに送信
      await new Promise(resolve => setTimeout(resolve, 1500)); // 送信のシミュレーション

      toast.success('囁きが制作者に届きました', {
        description: '貴重なご意見をありがとうございます'
      });

      // フォームをリセット
      setFormData({
        category: '',
        subject: '',
        content: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      toast.error('囁きの送信に失敗しました', {
        description: '再度お試しください'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームリセット
  const resetForm = () => {
    setFormData({
      category: '',
      subject: '',
      content: ''
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary flex items-center space-x-2">
            <MessageSquare size={24} />
            <span>囁き（お問い合わせ）</span>
          </DialogTitle>
          <DialogDescription>
            制作者へのお問い合わせフォームです。ご質問、ご要望、不具合報告などをお送りください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 説明 */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">制作者への囁き</CardTitle>
              <CardDescription>
                ご質問、ご要望、不具合報告など、何でもお気軽にお聞かせください
              </CardDescription>
            </CardHeader>
          </Card>

          {/* お問い合わせフォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* カテゴリ選択 */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                お問い合わせの種類 <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                <SelectTrigger className={`${errors.category ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="種類を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">不具合報告</SelectItem>
                  <SelectItem value="feature">新機能のご要望</SelectItem>
                  <SelectItem value="question">使い方のご質問</SelectItem>
                  <SelectItem value="feedback">ご意見・ご感想</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-destructive text-sm">{errors.category}</p>
              )}
            </div>

            {/* 件名入力 */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground">
                件名 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="お問い合わせの件名を入力してください"
                value={formData.subject}
                onChange={(e) => updateFormData('subject', e.target.value)}
                className={`${errors.subject ? 'border-destructive' : ''}`}
                maxLength={100}
              />
              {errors.subject && (
                <p className="text-destructive text-sm">{errors.subject}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {formData.subject.length}/100文字
              </p>
            </div>

            {/* 内容入力 */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">
                お問い合わせ内容 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="詳細な内容をお聞かせください。&#10;&#10;不具合報告の場合：&#10;・発生した状況や操作手順&#10;・ブラウザの種類&#10;・エラーメッセージなど&#10;&#10;ご要望の場合：&#10;・どのような機能が欲しいか&#10;・なぜその機能が必要かなど"
                value={formData.content}
                onChange={(e) => updateFormData('content', e.target.value)}
                className={`min-h-[120px] resize-none ${errors.content ? 'border-destructive' : ''}`}
                maxLength={1000}
              />
              {errors.content && (
                <p className="text-destructive text-sm">{errors.content}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {formData.content.length}/1000文字
              </p>
            </div>

            {/* 送信ボタン */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                リセット
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                <Send size={16} />
                <span>{isSubmitting ? '送信中...' : '囁きを送る'}</span>
              </Button>
            </div>
          </form>

          {/* 注意事項 */}
          <Card className="border-muted bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">ご注意</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• 個人情報は含めないでください</p>
              <p>• 返信が必要な場合は、プロフィールの符丁（メールアドレス）をご確認ください</p>
              <p>• お問い合わせへの対応には時間がかかる場合があります</p>
              <p>• 不適切な内容のお問い合わせは対応いたしかねます</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};