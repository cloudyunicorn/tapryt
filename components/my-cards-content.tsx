"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  PlusIcon, 
  EyeIcon, 
  ShareIcon, 
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  ChartBarIcon,
  GlobeAltIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface CardData {
  id: string;
  title: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string;
  slug: string;
  theme?: string;
  isPublic: boolean;
  createdAt: string;
  socialLinks?: Array<{ type: string; url: string }>;
  _count?: { analytics: number };
}

interface MyCardsContentProps {
  cards: CardData[];
  user: any;
}

export function MyCardsContent({ cards, user }: MyCardsContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => 
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.company?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getThemeColors = (theme?: string) => {
    switch (theme) {
      case 'modern':
        return 'from-blue-500 to-purple-600';
      case 'minimal':
        return 'from-slate-400 to-slate-600';
      case 'creative':
        return 'from-pink-500 to-orange-500';
      case 'professional':
        return 'from-slate-700 to-slate-900';
      case 'elegant':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          My Digital
          <span className="text-brand-gradient"> Cards</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Manage and view all your digital business cards in one place. Share, edit, and track performance.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-blue">{cards.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Cards</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-brand-purple">
              {cards.reduce((sum, card) => sum + (card._count?.analytics || 0), 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Views</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {cards.filter(card => card.isPublic).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Public Cards</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {cards.filter(card => !card.isPublic).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Private Cards</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>

        <Link href="/create-card">
          <Button className="bg-brand-gradient hover:opacity-90 whitespace-nowrap">
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Card
          </Button>
        </Link>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <EmptyState searchTerm={searchTerm} totalCards={cards.length} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <CardItem key={card.id} card={card} getThemeColors={getThemeColors} />
          ))}
        </div>
      )}
    </div>
  );
}

// Individual Card Component
function CardItem({ card, getThemeColors }: { card: CardData; getThemeColors: (theme?: string) => string }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-1">{card.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`bg-gradient-to-r ${getThemeColors(card.theme)} text-white text-xs`}>
                {card.theme || 'modern'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {card.isPublic ? (
                  <div className="flex items-center gap-1">
                    <GlobeAltIcon className="w-3 h-3" />
                    Public
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <LockClosedIcon className="w-3 h-3" />
                    Private
                  </div>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Card Preview */}
        <Link href={`/cards/${card.slug}`}>
          <div 
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 bg-gradient-to-r ${getThemeColors(card.theme)}`}
          >
            <div className="text-center text-white space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                <span className="text-lg font-bold">{card.fullName.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{card.fullName}</h3>
                {card.jobTitle && <p className="text-xs opacity-80">{card.jobTitle}</p>}
                {card.company && <p className="text-xs opacity-60">{card.company}</p>}
              </div>
            </div>
          </div>
        </Link>

        {/* Card Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Views</span>
            <span className="font-semibold">{card._count?.analytics || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Created</span>
            <span className="font-semibold">{format(new Date(card.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Social Links</span>
            <span className="font-semibold">{card.socialLinks?.length || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <Link href={`/cards/${card.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <EyeIcon className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="flex-1">
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <QrCodeIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <PencilIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({ searchTerm, totalCards }: { searchTerm: string; totalCards: number }) {
  if (searchTerm && totalCards > 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <MagnifyingGlassIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No cards found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No cards match your search for "{searchTerm}". Try adjusting your search terms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <PlusIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No cards yet</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Create your first digital business card to start networking professionally.
        </p>
        <Link href="/create-card">
          <Button className="bg-brand-gradient hover:opacity-90">
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Your First Card
          </Button>
        </Link>
      </div>
    </div>
  );
}
