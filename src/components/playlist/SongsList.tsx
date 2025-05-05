
import React from 'react';
import { Heart, MoreHorizontal, Play, Pause, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { formatTime } from '@/utils/audioUtils';
import { Song } from '@/data/playlists';

interface SongsListProps {
  songs: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  onPlaySong: (index: number) => void;
  onToggleLike: (songId: number) => void;
  onRemoveSong: (songId: number) => void;
  onEditSong: (song: Song) => void;
  onAddToOtherPlaylist: (song: Song) => void;
  onShowAddSongsDialog: () => void;
}

export const SongsList: React.FC<SongsListProps> = ({
  songs,
  currentSongIndex,
  isPlaying,
  onPlaySong,
  onToggleLike,
  onRemoveSong,
  onEditSong,
  onAddToOtherPlaylist,
  onShowAddSongsDialog
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "rounded-md border overflow-hidden",
      isDark ? "bg-musima-surface/60 border-white/10" : "bg-white/60 border-gray-200"
    )}>
      <div className="flex justify-between items-center py-3 px-4 border-b border-white/10">
        <h2 className={cn("font-bold", isDark ? "text-white" : "text-gray-800")}>Songs</h2>
        <Button variant="outline" className="gap-2" onClick={onShowAddSongsDialog}>
          <Plus className="h-4 w-4" />
          Add Songs
        </Button>
      </div>
      
      <div className={cn(
        "grid grid-cols-12 py-3 px-4 border-b text-xs font-medium uppercase tracking-wider",
        isDark ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-500"
      )}>
        <div className="col-span-1">#</div>
        <div className="col-span-4">Title</div>
        <div className="col-span-3">Artist</div>
        <div className="col-span-3">Album</div>
        <div className="col-span-1 text-right">Duration</div>
      </div>
      
      <div className={cn(
        "divide-y", 
        isDark ? "divide-white/5" : "divide-gray-100"
      )}>
        {songs.map((song, index) => (
          <div 
            key={song.id}
            className={cn(
              "grid grid-cols-12 py-3 px-4 items-center hover:bg-white/5 group transition-colors playlist-item",
              currentSongIndex === index && (isDark ? "bg-white/10" : "bg-gray-100")
            )}
          >
            <div className="col-span-1 flex items-center">
              <span className={cn(
                "group-hover:hidden",
                isDark ? "text-gray-400" : "text-gray-500",
                currentSongIndex === index && "hidden"
              )}>
                {index + 1}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-7 w-7",
                  isDark ? "text-white" : "text-gray-800",
                  (currentSongIndex === index && isPlaying) ? "flex" : "hidden group-hover:flex"
                )}
                onClick={() => {
                  if (currentSongIndex === index && isPlaying) {
                    // This will be handled by the parent component's togglePlayPause
                    onPlaySong(index);
                  } else {
                    onPlaySong(index);
                  }
                }}
              >
                {currentSongIndex === index && isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div className={cn(
              "col-span-4 font-medium truncate",
              isDark ? "text-white" : "text-gray-800",
              currentSongIndex === index && "font-semibold"
            )}>
              {song.title}
            </div>
            <div className={cn("col-span-3 truncate", isDark ? "text-gray-300" : "text-gray-600")}>
              {song.artist}
            </div>
            <div className={cn("col-span-3 truncate", isDark ? "text-gray-300" : "text-gray-600")}>
              {song.album}
            </div>
            <div className="col-span-1 flex items-center justify-end space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-7 w-7 opacity-0 group-hover:opacity-100",
                  isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
                )}
                onClick={() => onToggleLike(song.id)}
              >
                <Heart className={cn(
                  "h-4 w-4", 
                  song.liked && "fill-musima-primary text-musima-primary"
                )} />
              </Button>
              <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                {formatTime(song.duration)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-7 w-7 opacity-0 group-hover:opacity-100",
                      isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={cn(
                  "border",
                  isDark ? "bg-musima-surface text-white border-white/10" : "bg-white text-gray-800 border-gray-200"
                )}>
                  <DropdownMenuItem onClick={() => onAddToOtherPlaylist(song)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Another Playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditSong(song)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Song Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500" onClick={() => onRemoveSong(song.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove from Playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
