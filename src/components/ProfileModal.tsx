import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApp } from './AppContext';
import { Edit2, Save, User, Mail, Building, Calendar, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// プロフィールモーダルコンポーネント
export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, offerings } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    department: currentUser?.department || '',
    age: currentUser?.age || ''
  });

  // ユーザーの統計データを計算
  const userStats = React.useMemo(() => {
    if (!currentUser) return { posts: 0, totalLikes: 0, totalComments: 0 };

    const userOfferings = offerings.filter(offering => offering.authorId === currentUser.id);
    const totalLikes = userOfferings.reduce((sum, offering) => sum + offering.likes, 0);
    const totalComments = userOfferings.reduce((sum, offering) => sum + offering.comments.length, 0);

    return {
      posts: userOfferings.length,
      totalLikes,
      totalComments
    };
  }, [currentUser, offerings]);

  // ユーザーの最近の投稿を取得
  const recentOfferings = React.useMemo(() => {
    if (!currentUser) return [];
    
    return offerings
      .filter(offering => offering.authorId === currentUser.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }, [currentUser, offerings]);

  // 編集データの更新
  const updateEditData = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // プロフィールの保存
  const handleSave = () => {
    // 実際のアプリでは、ここでAPIを呼び出してバックエンドに保存
    // currentUserの更新処理もここで行う
    
    setIsEditing(false);
    toast.success('写し絵が更新されました');
  };

  // 編集のキャンセル
  const handleCancel = () => {
    setEditData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      department: currentUser?.department || '',
      age: currentUser?.age || ''
    });
    setIsEditing(false);
  };

  if (!currentUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            写し絵（プロフィール）
          </DialogTitle>
          <DialogDescription>
            {currentUser?.name}のプロフィール情報と活動統計を表示・編集します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* プロフィール基本情報 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User size={20} />
                  <span>基本情報</span>
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={14} className="mr-1" />
                    編集
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* アバター */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{currentUser.name}</h3>
                  <p className="text-muted-foreground text-sm">{currentUser.department}</p>
                </div>
              </div>

              {isEditing ? (
                // 編集モード
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">呼び名</Label>
                    <Input
                      id="edit-name"
                      value={editData.name}
                      onChange={(e) => updateEditData('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-email">符丁</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => updateEditData('email', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-department">所属</Label>
                    <Select value={editData.department} onValueChange={(value) => updateEditData('department', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wind">風の部署</SelectItem>
                        <SelectItem value="water">水の工房</SelectItem>
                        <SelectItem value="earth">土の組合</SelectItem>
                        <SelectItem value="fire">火の結社</SelectItem>
                        <SelectItem value="wood">木の集団</SelectItem>
                        <SelectItem value="valley">谷の工房</SelectItem>
                        <SelectItem value="mountain">山の連盟</SelectItem>
                        <SelectItem value="forest">森の同志</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-age">年代</Label>
                    <Select value={editData.age} onValueChange={(value) => updateEditData('age', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teens">10代</SelectItem>
                        <SelectItem value="20s">20代</SelectItem>
                        <SelectItem value="30s">30代</SelectItem>
                        <SelectItem value="40s">40代</SelectItem>
                        <SelectItem value="50s">50代</SelectItem>
                        <SelectItem value="60s">60代以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      取り消し
                    </Button>
                    <Button onClick={handleSave}>
                      <Save size={14} className="mr-1" />
                      保存
                    </Button>
                  </div>
                </div>
              ) : (
                // 表示モード
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <span className="text-sm">{currentUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building size={16} className="text-muted-foreground" />
                    <span className="text-sm">{currentUser.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="text-sm">{currentUser.age}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 活動統計 */}
          <Card>
            <CardHeader>
              <CardTitle>供物の記録</CardTitle>
              <CardDescription>
                これまでの活動の軌跡
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{userStats.posts}</div>
                  <div className="text-sm text-muted-foreground">投稿した供物</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{userStats.totalLikes}</div>
                  <div className="text-sm text-muted-foreground">受けた祈念</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{userStats.totalComments}</div>
                  <div className="text-sm text-muted-foreground">受けた導き</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最近の投稿 */}
          {recentOfferings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>最近の供物</CardTitle>
                <CardDescription>
                  最近捧げた供物の一覧
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOfferings.map(offering => (
                    <div 
                      key={offering.id} 
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{offering.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {offering.createdAt.toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Heart size={12} />
                          <span>{offering.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle size={12} />
                          <span>{offering.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};