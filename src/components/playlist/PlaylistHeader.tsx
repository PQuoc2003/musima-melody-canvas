
import React from 'react';
import { Play, Pause, MoreVertical, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { Playlist } from '@/data/playlists';

interface PlaylistHeaderProps {
  playlist: Playlist;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEditPlaylist: () => void;
  onShowAudioEffects: () => void;
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ 
  playlist, 
  isPlaying, 
  onPlayPause, 
  onEditPlaylist,
  onShowAudioEffects
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calculate total playlist duration
  const totalDuration = playlist.songs.reduce((acc, song) => acc + song.duration, 0);
  const formattedTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const mins = Math.floor((totalDuration % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  return (
    <div className="flex items-start mb-8">
      <div className="relative mr-6">
        <img 
          src={playlist.coverUrl} 
          alt={playlist.name} 
          className="w-48 h-48 object-cover rounded-md shadow-lg" 
        />
      </div>
      
      <div className="flex-1">
        <div className={cn("mb-2 text-sm font-medium", isDark ? "text-gray-300" : "text-gray-600")}>PLAYLIST</div>
        <h1 className={cn("text-4xl font-bold mb-2", isDark ? "text-white" : "text-gray-800")}>{playlist.name}</h1>
        <p className={cn("text-sm mb-3", isDark ? "text-gray-300" : "text-gray-600")}>{playlist.description}</p>
        <div className={cn("flex items-center text-sm mb-6", isDark ? "text-gray-400" : "text-gray-500")}>
          <span>{playlist.songs.length} songs</span>
          <span className="mx-1">•</span>
          <span>{formattedTotalDuration()}</span>
          <span className="mx-1">•</span>
          <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            className="bg-musima-primary hover:bg-musima-primary/90 gap-2"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play All
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn(
              "border", 
              isDark ? "bg-musima-surface text-white border-white/10" : "bg-white text-gray-800 border-gray-200"
            )}>
              <DropdownMenuItem onClick={onShowAudioEffects}>
                Audio Effects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEditPlaylist}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem>Share Playlist</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Delete Playlist</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
