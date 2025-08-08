import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ArrowLeft, Camera, Eye, EyeOff } from 'lucide-react';
import { useApp } from './AppContext';
import { toast } from 'sonner';

// プロフィール編集画面コンポーネント
export const ProfileEditScreen: React.FC = () => {
  const { currentUser, setCurrentScreen, updateProfile, changePassword } = useApp();
  
  // プロフィール編集用の状態管理
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    department: currentUser?.department || '',
    age: currentUser?.age || '',
    avatar: currentUser?.avatar || ''
  });

  // パスワード変更用の状態管理
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // パスワード表示/非表示の状態管理
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // プロフィール更新処理
  const handleProfileUpdate = () => {
    if (!profileData.name.trim()) {
      toast.error('呼び名は必須です');
      return;
    }

    updateProfile(profileData);
    toast.success('写し絵（プロフィール）を更新しました');
  };

  // パスワード変更処理
  const handlePasswordChange = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error('すべてのパスワード欄を入力してください');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('新しい結界文が一致しません');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('新しい結界文は6文字以上で入力してください');
      return;
    }

    const success = changePassword(passwordData.oldPassword, passwordData.newPassword);
    if (success) {
      toast.success('結界文を変更しました');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error('現在の結界文が正しくありません');
    }
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
            <h1 className="text-primary">写し絵の編集</h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto p-4 max-w-2xl">
        <div className="space-y-6">
          {/* プロフィール編集セクション */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">基本情報の変更</CardTitle>
              <CardDescription>
                あなたの写し絵（プロフィール）情報を更新できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* アバター編集 */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profileData.avatar} alt="プロフィール画像" />
                  <AvatarFallback className="bg-accent text-primary">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full space-y-2">
                  <Label htmlFor="avatar">写し絵（アイコンURL）</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="avatar"
                      type="url"
                      value={profileData.avatar}
                      onChange={(e) => setProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProfileData(prev => ({ ...prev, avatar: '' }))}
                    >
                      <Camera size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* 基本情報入力 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">呼び名 *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="禊 ミコト"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">所属</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="風の部署"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="age">年代</Label>
                  <Input
                    id="age"
                    value={profileData.age}
                    onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="20代"
                  />
                </div>
              </div>

              <Button 
                onClick={handleProfileUpdate}
                className="w-full bg-primary hover:bg-primary/90 transition-colors"
              >
                写し絵を更新
              </Button>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* パスワード変更セクション */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary">結界文の変更</CardTitle>
              <CardDescription>
                アカウントの結界文（パスワード）を変更できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">現在の結界文</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showPasswords.old ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                    placeholder="現在のパスワード"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                  >
                    {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">新しい結界文</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="新しいパスワード（6文字以上）"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">結界文の確認</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="新しいパスワードを再入力"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handlePasswordChange}
                variant="destructive"
                className="w-full"
              >
                結界文を変更
              </Button>
            </CardContent>
          </Card>

          {/* 降霊解除（ログアウト）セクション */}
          <Card className="shadow-lg border-2 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">降霊を解く</CardTitle>
              <CardDescription>
                現在のセッションを終了し、ログイン画面に戻ります
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive"
                className="w-full"
                onClick={() => setCurrentScreen('login')}
              >
                降霊を解く（ログアウト）
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};