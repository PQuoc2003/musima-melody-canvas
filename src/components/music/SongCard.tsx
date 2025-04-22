import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MoreHorizontal, Play } from 'lucide-react';
import { Song } from '@/contexts/MusicPlayerContext';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onPlay }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColorClass = isDark ? 'text-white' : 'text-gray-800';
  const mutedTextClass = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all hover:bg-black/5 dark:hover:bg-white/5",
      isDark ? "bg-musima-surface/60 border-white/10" : "bg-white border-gray-200"
    )}>
      <CardHeader className="p-4">
        <div className="aspect-square overflow-hidden rounded-md">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="h-full w-full object-cover transition-all group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <h3 className={`font-semibold truncate ${textColorClass}`}>{song.title}</h3>
        <p className={`text-sm truncate ${mutedTextClass}`}>{song.artist}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isDark ? "text-white hover:text-white/80" : "text-gray-800 hover:text-gray-600"
          )}
          onClick={() => onPlay(song)}
        >
          <Play className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              song.liked ? "text-musima-primary" : mutedTextClass
            )}
          >
            <Heart className={cn("h-4 w-4", song.liked && "fill-musima-primary")} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${mutedTextClass}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className={cn(
                "min-w-[200px] p-2",
                isDark 
                  ? "bg-musima-surface/95 backdrop-blur-lg border-white/10" 
                  : "bg-white/95 backdrop-blur-lg"
              )}
            >
              <DropdownMenuItem className="py-2 cursor-pointer">Add to Playlist</DropdownMenuItem>
              <DropdownMenuItem className="py-2 cursor-pointer">Add to Wishlist</DropdownMenuItem>
              <DropdownMenuItem className="py-2 cursor-pointer">Edit Details</DropdownMenuItem>
              <DropdownMenuItem className="py-2 cursor-pointer text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SongCard;
