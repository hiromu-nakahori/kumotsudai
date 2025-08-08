import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { useApp } from './AppContext';
import { Send, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

// 献納の壇（投稿タブ）コンポーネント
export const SubmissionTab: React.FC = () => {
  const { currentUser, addOffering } = useApp();
  
  // フォームの状態管理
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    genres: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 利用可能なジャンル一覧
  const availableGenres = [
    '修練', '日々', '証明', '挑戦', '学習', '創作',
    '発見', '体験', '感謝', '決意', '成長', '智恵',
    '技術', '芸術', '研究', '実践', '共有', '貢献'
  ];

  // フォーム入力値の更新
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ジャンル選択の切り替え
  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = '題名を入力してください';
    } else if (formData.title.length > 100) {
      newErrors.title = '題名は100文字以内で入力してください';
    }

    if (!formData.content.trim()) {
      newErrors.content = '供物の内容を入力してください';
    } else if (formData.content.length < 10) {
      newErrors.content = '内容は10文字以上で入力してください';
    } else if (formData.content.length > 2000) {
      newErrors.content = '内容は2000文字以内で入力してください';
    }

    if (formData.genres.length === 0) {
      newErrors.genres = '少なくとも1つのジャンルを選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 供物の投稿処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('ログインが必要です');
      return;
    }

    if (!validateForm()) {
      toast.error('入力内容に不備があります');
      return;
    }

    setIsSubmitting(true);

    try {
      // 実際のアプリでは、ここでAPIを呼び出してバックエンドに投稿
      addOffering({
        title: formData.title.trim(),
        content: formData.content.trim(),
        genres: formData.genres,
        author: currentUser.name,
        authorId: currentUser.id
      });

      // フォームをリセット
      setFormData({
        title: '',
        content: '',
        genres: []
      });

      toast.success('供物が祭壇に捧げられました', {
        description: '審神の壇と探求の壇で確認できます'
      });
    } catch (error) {
      toast.error('供物の奉納に失敗しました', {
        description: '再度お試しください'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームリセット
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      genres: []
    });
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h2 className="text-primary mb-2">献納の壇</h2>
        <p className="text-muted-foreground">
          あなたの成果や想いを、供物として祭壇に捧げましょう
        </p>
      </div>

      {/* 投稿フォーム */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus size={20} />
            <span>新しい供物を捧げる</span>
          </CardTitle>
          <CardDescription>
            日々の成果、学び、体験を記録し、森の仲間と共有しましょう
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 題名入力 */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                題名 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="供物の題名を入力してください（例：今日の学習成果）"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className={`${errors.title ? 'border-destructive' : ''}`}
                maxLength={100}
              />
              {errors.title && (
                <p className="text-destructive text-sm">{errors.title}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {formData.title.length}/100文字
              </p>
            </div>

            {/* 内容入力 */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">
                供物の内容 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="あなたの成果、学び、体験を詳しく記述してください。&#10;&#10;例：&#10;・今日新しく学んだこと&#10;・克服した課題について&#10;・感じた気づきや成長&#10;・他の人に共有したい知恵"
                value={formData.content}
                onChange={(e) => updateFormData('content', e.target.value)}
                className={`min-h-[150px] resize-none ${errors.content ? 'border-destructive' : ''}`}
                maxLength={2000}
              />
              {errors.content && (
                <p className="text-destructive text-sm">{errors.content}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {formData.content.length}/2000文字
              </p>
            </div>

            {/* ジャンル選択 */}
            <div className="space-y-3">
              <Label className="text-foreground">
                ジャンル選択 <span className="text-destructive">*</span>
              </Label>
              <p className="text-muted-foreground text-sm">
                供物の種類を表すジャンルを選択してください（複数選択可）
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableGenres.map(genre => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={formData.genres.includes(genre)}
                      onCheckedChange={() => toggleGenre(genre)}
                    />
                    <label 
                      htmlFor={genre} 
                      className="text-sm cursor-pointer select-none"
                    >
                      【{genre}】
                    </label>
                  </div>
                ))}
              </div>
              
              {formData.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-sm text-muted-foreground">選択中：</span>
                  {formData.genres.map(genre => (
                    <Button
                      key={genre}
                      variant="secondary"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => toggleGenre(genre)}
                    >
                      【{genre}】
                      <X size={12} className="ml-1" />
                    </Button>
                  ))}
                </div>
              )}
              
              {errors.genres && (
                <p className="text-destructive text-sm">{errors.genres}</p>
              )}
            </div>

            {/* 投稿ボタン */}
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
                <span>{isSubmitting ? '奉納中...' : '供物を捧げる'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 投稿のガイドライン */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">供物奉納の心得</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• 他者への敬意を持ち、建設的な内容を心がけましょう</p>
          <p>• 個人情報や機密情報は含めないようにしてください</p>
          <p>• 具体的で他の人の学びにもなる内容が好まれます</p>
          <p>• 失敗談も貴重な供物です。恐れずに共有しましょう</p>
          <p>• 投稿後は編集できませんので、よく確認してから投稿してください</p>
        </CardContent>
      </Card>
    </div>
  );
};