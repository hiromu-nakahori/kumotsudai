import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { X, TreePine } from 'lucide-react';
import { creatorsData } from './data/creatorsData';

interface CreatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 制作者モーダルコンポーネント
export const CreatorsModal: React.FC<CreatorsModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary flex items-center space-x-2">
            <TreePine size={24} />
            <span>制作者たち</span>
          </DialogTitle>
          <DialogDescription>
            供物台の制作者たちの詳細な紹介ページです。各制作者の専門分野と役割について説明しています。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 概要 */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">森の守り人たち</CardTitle>
              <CardDescription>
                供物台の創造と運営に携わる、神秘的な技能を持つ者たちをご紹介します
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 制作者一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creatorsData.map((creator) => (
              <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {creator.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{creator.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {creator.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 説明 */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {creator.description}
                  </p>

                  {/* 専門分野 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">専門分野</h4>
                    <div className="flex flex-wrap gap-1">
                      {creator.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 神秘的な格言 */}
                  <div className="bg-muted/30 p-3 rounded-lg border-l-4 border-primary/30">
                    <p className="text-sm italic text-muted-foreground">
                      「{creator.mysticalQuote}」
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 感謝のメッセージ */}
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle>森への感謝</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                供物台は、森の仲間たちの協力と、利用者の皆様の温かい支援によって成り立っています。
                日々の成果や学びを共有し、お互いを励まし合う、この美しいコミュニティを
                これからも大切に育てていきたいと思います。
              </p>
              <div className="mt-4 text-center">
                <p className="text-primary italic">
                  ー 森の奥深くより、心を込めて ー
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};