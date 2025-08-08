import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp, type Offering } from './AppContext';
import { OfferingCard } from './OfferingCard';
import { Search, Filter, X, TrendingUp, Clock, Heart, MessageCircle, Sparkles, Command } from 'lucide-react';
import { toast } from 'sonner';

// 高度な検索・フィルター機能を持つ探求の壇
export const SearchTab: React.FC = () => {
  const { offerings, getUserById } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'mostCommented' | 'relevance'>('relevance');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [authorFilter, setAuthorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [minLikes, setMinLikes] = useState<number>(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // キーボードショートカット（Ctrl/Cmd + K で検索フォーカス）
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        toast.info('検索にフォーカスしました', {
          description: 'キーワードを入力して供物を探索してください'
        });
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  // 全ジャンルを取得
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    offerings.forEach(offering => {
      offering.genres.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, [offerings]);

  // 全作者を取得
  const allAuthors = useMemo(() => {
    const authors = new Set<string>();
    offerings.forEach(offering => authors.add(offering.author));
    return Array.from(authors).sort();
  }, [offerings]);

  // 検索候補の生成
  useEffect(() => {
    if (searchQuery.length > 0) {
      const titleSuggestions = offerings
        .filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(o => o.title)
        .slice(0, 3);
      
      const genreSuggestions = allGenres
        .filter(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 2);

      setSuggestions([...titleSuggestions, ...genreSuggestions]);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, offerings, allGenres]);

  // 日付フィルターの適用
  const filterByDate = (offering: Offering) => {
    if (dateFilter === 'all') return true;
    
    const now = new Date();
    const offeringDate = offering.createdAt;
    
    switch (dateFilter) {
      case 'today':
        return offeringDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return offeringDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return offeringDate >= monthAgo;
      default:
        return true;
    }
  };

  // 高度な検索アルゴリズム（関連度スコア計算）
  const calculateRelevanceScore = (offering: Offering, query: string): number => {
    if (!query) return 0;
    
    const lowerQuery = query.toLowerCase();
    let score = 0;
    
    // タイトルマッチ（重要度: 高）
    if (offering.title.toLowerCase().includes(lowerQuery)) {
      score += offering.title.toLowerCase().indexOf(lowerQuery) === 0 ? 100 : 50;
    }
    
    // 内容マッチ（重要度: 中）
    if (offering.content.toLowerCase().includes(lowerQuery)) {
      score += 30;
    }
    
    // ジャンルマッチ（重要度: 中）
    if (offering.genres.some(genre => genre.toLowerCase().includes(lowerQuery))) {
      score += 40;
    }
    
    // 作者マッチ（重要度: 低）
    if (offering.author.toLowerCase().includes(lowerQuery)) {
      score += 20;
    }
    
    // 人気度による調整
    score += Math.min(offering.likes * 2, 20);
    score += Math.min(offering.comments.length, 10);
    
    return score;
  };

  // フィルタリングとソート
  const filteredAndSortedOfferings = useMemo(() => {
    let filtered = offerings.filter(offering => {
      // 基本検索
      const matchesSearch = !searchQuery || 
        offering.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offering.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offering.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        offering.author.toLowerCase().includes(searchQuery.toLowerCase());

      // ジャンルフィルター（'all'の場合は全て通す）
      const matchesGenre = selectedGenre === 'all' || offering.genres.includes(selectedGenre);
      
      // 作者フィルター
      const matchesAuthor = !authorFilter || offering.author.toLowerCase().includes(authorFilter.toLowerCase());
      
      // 日付フィルター
      const matchesDate = filterByDate(offering);
      
      // いいね数フィルター
      const matchesLikes = offering.likes >= minLikes;

      return matchesSearch && matchesGenre && matchesAuthor && matchesDate && matchesLikes;
    });

    // ソート
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'mostCommented':
        filtered.sort((a, b) => b.comments.length - a.comments.length);
        break;
      case 'relevance':
        if (searchQuery) {
          filtered.sort((a, b) => calculateRelevanceScore(b, searchQuery) - calculateRelevanceScore(a, searchQuery));
        } else {
          filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        break;
    }

    return filtered;
  }, [offerings, searchQuery, selectedGenre, sortBy, authorFilter, dateFilter, minLikes]);

  // 検索実行時の処理
  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm && !searchHistory.includes(searchTerm)) {
      const newHistory = [searchTerm, ...searchHistory.slice(0, 4)];
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
    
    if (searchTerm) {
      toast.success(`"${searchTerm}" で検索しました`, {
        description: `${filteredAndSortedOfferings.length}件の供物が見つかりました`
      });
    }
  };

  // 検索履歴の読み込み
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // フィルターのクリア
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setAuthorFilter('');
    setDateFilter('all');
    setMinLikes(0);
    setSortBy('relevance');
    toast.info('フィルターをクリアしました');
  };

  // 人気の検索キーワード
  const popularKeywords = useMemo(() => {
    const keywordCount: Record<string, number> = {};
    offerings.forEach(offering => {
      // タイトルから単語を抽出
      const words = offering.title.split(/\s+|[、。！？]/);
      words.forEach(word => {
        if (word.length > 1) {
          keywordCount[word] = (keywordCount[word] || 0) + offering.likes;
        }
      });
    });
    
    return Object.entries(keywordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([word]) => word);
  }, [offerings]);

  return (
    <div className="space-y-6 p-6">
      {/* 検索ヘッダー */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Search size={24} className="text-primary" />
          <h1 className="content-hierarchy-1 text-primary">探求の壇</h1>
          <Sparkles size={20} className="text-accent animate-pulse" />
        </div>
        <p className="text-muted-foreground">
          神秘の森に眠る供物を探索し、新たな発見を得ましょう
        </p>
      </div>

      {/* メイン検索バー */}
      <Card className="premium-shadow value-enhancement">
        <CardContent className="p-6">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="探求したいキーワードを入力... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="pl-10 pr-4 py-3 text-base large-clickable"
                  aria-label="供物を検索"
                  aria-describedby="search-help"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Command size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">K</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSearch()} 
                className="px-6 py-3 large-clickable haptic-feedback click-animation"
                aria-label="検索実行"
              >
                探求
              </Button>
            </div>
            
            {/* 検索候補とヒストリー */}
            {isSearchFocused && (suggestions.length > 0 || searchHistory.length > 0) && (
              <Card className="absolute top-full left-0 right-0 z-10 mt-2 premium-shadow">
                <CardContent className="p-4">
                  {suggestions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">候補</h4>
                      <div className="space-y-1">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              handleSearch(suggestion);
                            }}
                            className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded interactive-element"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {searchHistory.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">最近の検索</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(term);
                              handleSearch(term);
                            }}
                            className="px-2 py-1 text-xs bg-muted hover:bg-accent rounded interactive-element"
                          >
                            <Clock size={12} className="inline mr-1" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div id="search-help" className="text-xs text-muted-foreground mt-2">
            タイトル、内容、ジャンル、作者から検索できます
          </div>
        </CardContent>
      </Card>

      {/* 人気キーワード */}
      {!searchQuery && popularKeywords.length > 0 && (
        <Card className="mystical-glow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <TrendingUp size={20} />
              <span>人気の探求キーワード</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(keyword);
                    handleSearch(keyword);
                  }}
                  className="interactive-element haptic-feedback"
                >
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">
                    {keyword}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* フィルターと並び替え */}
      <Card className="value-enhancement">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter size={20} />
              <span>絞り込み・並び替え</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
              className="interactive-element"
              aria-expanded={isAdvancedSearchOpen}
            >
              {isAdvancedSearchOpen ? '簡易表示' : '詳細表示'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ジャンルフィルター */}
            <div>
              <label className="text-sm font-medium mb-2 block">ジャンル</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="large-clickable">
                  <SelectValue placeholder="全てのジャンル" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全てのジャンル</SelectItem>
                  {allGenres.map(genre => (
                    <SelectItem key={genre} value={genre}>【{genre}】</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 並び替え */}
            <div>
              <label className="text-sm font-medium mb-2 block">並び替え</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="large-clickable">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">関連度順</SelectItem>
                  <SelectItem value="latest">最新順</SelectItem>
                  <SelectItem value="popular">人気順</SelectItem>
                  <SelectItem value="mostCommented">コメント数順</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 期間フィルター */}
            <div>
              <label className="text-sm font-medium mb-2 block">期間</label>
              <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                <SelectTrigger className="large-clickable">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全期間</SelectItem>
                  <SelectItem value="today">今日</SelectItem>
                  <SelectItem value="week">1週間以内</SelectItem>
                  <SelectItem value="month">1ヶ月以内</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* クリアボタン */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full large-clickable haptic-feedback"
                aria-label="フィルターをクリア"
              >
                <X size={16} className="mr-2" />
                クリア
              </Button>
            </div>
          </div>

          {/* 詳細フィルター */}
          {isAdvancedSearchOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <label className="text-sm font-medium mb-2 block">作者名</label>
                <Input
                  type="text"
                  placeholder="作者名で絞り込み"
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="large-clickable"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">最小いいね数</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minLikes || ''}
                  onChange={(e) => setMinLikes(Number(e.target.value) || 0)}
                  className="large-clickable"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 検索結果 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="content-hierarchy-2">
            探求結果 
            <span className="text-sm text-muted-foreground ml-2">
              ({filteredAndSortedOfferings.length}件の供物)
            </span>
          </h2>
          {searchQuery && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Search size={12} />
              <span>"{searchQuery}"</span>
            </Badge>
          )}
        </div>

        {filteredAndSortedOfferings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">供物が見つかりませんでした</h3>
              <p className="text-muted-foreground mb-4">
                検索条件を変更するか、フィルターをクリアしてお試しください
              </p>
              <Button onClick={clearFilters} variant="outline" className="haptic-feedback">
                フィルターをクリア
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedOfferings.map((offering, index) => (
              <div key={offering.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <OfferingCard offering={offering} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};