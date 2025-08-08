import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useApp } from './AppContext';
import { Heart, MessageCircle, Send } from 'lucide-react';
import type { Offering } from './AppContext';

interface OfferingDetailModalProps {
  offering: Offering;
  isOpen: boolean;
  onClose: () => void;
}

// 供物詳細モーダルコンポーネント
export const OfferingDetailModal: React.FC<OfferingDetailModalProps> = ({
  offering,
  isOpen,
  onClose
}) => {
  const { currentUser, likeOffering, addComment } = useApp();
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 現在のユーザーが祈念済みかチェック
  const hasLiked = currentUser ? offering.likedBy.includes(currentUser.id) : false;

  // 祈念（いいね）処理
  const handleLike = () => {
    if (currentUser) {
      likeOffering(offering.id);
    }
  };

  // 導き（コメント）の投稿
  const handleSubmitComment = async () => {
    if (!commentText.trim() || !currentUser) return;

    setIsSubmittingComment(true);
    
    // 実際のアプリでは、ここでAPIを呼び出してバックエンドに送信
    addComment(offering.id, commentText);
    
    setCommentText('');
    setIsSubmittingComment(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary pr-8">
            {offering.title}
          </DialogTitle>
          <DialogDescription>
            供物の詳細情報と導きの一覧を表示します。投稿者: {offering.author}、投稿日: {offering.createdAt.toLocaleDateString('ja-JP')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 供物のメタ情報 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>投稿者：{offering.author}</span>
              <span>{offering.createdAt.toLocaleDateString('ja-JP')}</span>
            </div>
            
            {/* ジャンルバッジ */}
            <div className="flex flex-wrap gap-2">
              {offering.genres.map((genre, index) => (
                <Badge key={index} variant="secondary">
                  【{genre}】
                </Badge>
              ))}
            </div>
          </div>

          {/* 供物の内容 */}
          <div className="bg-card p-4 rounded-lg border">
            <p className="whitespace-pre-wrap leading-relaxed">
              {offering.content}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="flex items-center space-x-4 pt-2 border-t">
            <Button
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                hasLiked ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <Heart size={16} className={hasLiked ? 'fill-current' : ''} />
              <span>祈念 {offering.likes}</span>
            </Button>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MessageCircle size={16} />
              <span>導き {offering.comments.length}</span>
            </div>
          </div>

          {/* 導き（コメント）投稿フォーム */}
          {currentUser && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-primary">導きを記す</h4>
              <div className="space-y-3">
                <Textarea
                  placeholder="この供物に対する導きの言葉を記してください..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Send size={14} />
                    <span>{isSubmittingComment ? '記録中...' : '導きを記す'}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 既存の導き（コメント）一覧 */}
          {offering.comments.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-primary">寄せられた導き</h4>
              <div className="space-y-4">
                {offering.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    {/* アバター */}
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {comment.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* コメント内容 */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt.toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="whitespace-pre-wrap text-sm">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};