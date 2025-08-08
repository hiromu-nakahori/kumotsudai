import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Heart, MessageCircle, Send, Trophy } from 'lucide-react';
import { useApp, type Offering } from './AppContext';

interface OfferingCardProps {
  offering: Offering;
  rank?: number; // ランキング表示用（オプション）
  showInteractions?: boolean; // いいね・コメント機能の表示有無
}

// 適切なサイズの供物カードコンポーネント
export const OfferingCard: React.FC<OfferingCardProps> = ({ 
  offering, 
  rank, 
  showInteractions = true 
}) => {
  const { 
    currentUser, 
    likeOffering, 
    addComment, 
    setCurrentScreen, 
    setSelectedUserId, 
    getUserById 
  } = useApp();
  
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  // 現在のユーザーがいいねしているかチェック
  const isLiked = currentUser ? offering.likedBy.includes(currentUser.id) : false;

  // いいねボタンの処理
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // カードクリックのイベント伝播を止める
    if (currentUser) {
      likeOffering(offering.id);
    }
  };

  // コメント投稿の処理
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!commentText.trim() || !currentUser) return;
    
    addComment(offering.id, commentText.trim());
    setCommentText('');
  };

  // ユーザー名クリックでプロフィール表示
  const handleUserClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUserId(userId);
    setCurrentScreen('userProfile');
  };

  // 順位の色を取得（上位3位まで特別色）
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600'; // 金
      case 2: return 'text-gray-500';   // 銀
      case 3: return 'text-amber-600';  // 銅
      default: return 'text-muted-foreground';
    }
  };

  // 投稿者の情報を取得
  const author = getUserById(offering.authorId);

  return (
    <Card className="premium-shadow hover:shadow-2xl transition-all duration-300 border border-border bg-card/95 backdrop-blur-sm consistent-border-radius professional-spacing value-enhancement mystical-glow interactive-element">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* ランキング表示（オプション） */}
            {rank && (
              <div className={`flex items-center space-x-2 mb-2 ${getRankColor(rank)}`}>
                {rank <= 3 && <Trophy size={16} />}
                <span className="font-bold text-sm">{rank}位</span>
              </div>
            )}
            
            <CardTitle className="text-lg mb-2 text-primary leading-relaxed">{offering.title}</CardTitle>
            
            {/* 投稿者情報 */}
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto hover:bg-transparent"
                onClick={(e) => handleUserClick(offering.authorId, e)}
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={author?.avatar} alt={offering.author} />
                    <AvatarFallback className="text-xs bg-accent text-primary">
                      {offering.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {offering.author}
                  </span>
                </div>
              </Button>
              <span className="text-xs text-muted-foreground">
                • {offering.createdAt.toLocaleDateString('ja-JP')}
              </span>
            </div>
          </div>
        </div>
        
        {/* ジャンルバッジ */}
        <div className="flex flex-wrap gap-1">
          {offering.genres.map((genre, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              【{genre}】
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 供物の内容 */}
        <p className="text-muted-foreground leading-relaxed text-sm">
          {offering.content}
        </p>

        {/* 統計情報とアクション */}
        {showInteractions && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* いいねボタン */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center space-x-1 transition-all duration-200 large-clickable haptic-feedback click-animation ${
                    isLiked 
                      ? 'text-destructive hover:text-destructive/80' 
                      : 'text-muted-foreground hover:text-destructive'
                  }`}
                  aria-label={isLiked ? '祈念を取り消す' : '祈念を捧げる'}
                >
                  <Heart 
                    size={18} 
                    className={isLiked ? 'fill-current' : ''} 
                  />
                  <span className="text-sm">{offering.likes}</span>
                </Button>

                {/* コメントボタン */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowComments(!showComments);
                  }}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors large-clickable haptic-feedback click-animation"
                  aria-label={showComments ? '導きを隠す' : '導きを表示'}
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">{offering.comments.length}</span>
                </Button>
              </div>
            </div>

            {/* コメントセクション */}
            {showComments && (
              <div className="space-y-3 pt-3 border-t border-border">
                {/* コメント一覧 */}
                {offering.comments.length > 0 && (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {offering.comments.map((comment) => {
                      const commentAuthor = getUserById(comment.authorId);
                      return (
                        <div key={comment.id} className="bg-accent/20 p-3 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto hover:bg-transparent"
                              onClick={(e) => handleUserClick(comment.authorId, e)}
                            >
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={commentAuthor?.avatar} alt={comment.author} />
                                <AvatarFallback className="text-xs bg-accent text-primary">
                                  {comment.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </Button>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-auto hover:bg-transparent"
                                  onClick={(e) => handleUserClick(comment.authorId, e)}
                                >
                                  <span className="text-sm text-primary hover:underline">
                                    {comment.author}
                                  </span>
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                  {comment.createdAt.toLocaleDateString('ja-JP')} {comment.createdAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* コメント投稿フォーム */}
                {currentUser && (
                  <form onSubmit={handleAddComment} className="flex space-x-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback className="text-xs bg-accent text-primary">
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="導きの言葉を捧げる..."
                        className="flex-1 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!commentText.trim()}
                      className="shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Send size={14} />
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};