import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Share2, ThumbsUp, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReactionShareProps {
  itemId: number;
  itemType: 'deal' | 'event';
  initialReactions?: {
    likes: number;
    hearts: number;
    comments: number;
  };
  onReactionChange?: (reactions: { likes: number; hearts: number; comments: number }) => void;
}

export function ReactionShare({ itemId, itemType, initialReactions = { likes: 0, hearts: 0, comments: 0 }, onReactionChange }: ReactionShareProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReactions, setUserReactions] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();

  const handleReaction = async (reactionType: 'like' | 'heart') => {
    if (!user) {
      toast.error('Please sign in to react');
      return;
    }

    try {
      const newReactions = { ...reactions };
      const hasReacted = userReactions[reactionType];

      // Update local state
      if (reactionType === 'like') {
        newReactions.likes += hasReacted ? -1 : 1;
      } else {
        newReactions.hearts += hasReacted ? -1 : 1;
      }

      setReactions(newReactions);
      setUserReactions(prev => ({
        ...prev,
        [reactionType]: !hasReacted
      }));

      // Update in database
      const { error } = await supabase
        .from('reactions')
        .upsert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
          reaction_type: reactionType,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Track analytics
      await supabase.from('analytics').insert({
        event_type: 'reaction',
        event_source: itemType,
        source_id: itemId,
        metadata: { reaction_type: reactionType }
      });

      onReactionChange?.(newReactions);
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = document.title;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
        return;
    }

    // Track share analytics
    try {
      await supabase.from('analytics').insert({
        event_type: 'share',
        event_source: itemType,
        source_id: itemId,
        metadata: { platform }
      });
    } catch (error) {
      console.error('Error tracking share:', error);
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`gap-1 ${userReactions.like ? 'text-blue-500' : ''}`}
        onClick={() => handleReaction('like')}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{reactions.likes}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`gap-1 ${userReactions.heart ? 'text-red-500' : ''}`}
        onClick={() => handleReaction('heart')}
      >
        <Heart className="h-4 w-4" />
        <span>{reactions.hearts}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={() => toast.info('Comments coming soon!')}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{reactions.comments}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShare('facebook')}>
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('twitter')}>
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
            Share on WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('copy')}>
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 