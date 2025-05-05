
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { formatTime } from '@/utils/audioUtils';
import { Song } from '@/data/playlists';

interface NowPlayingSectionProps {
  currentSong: Song;
  songProgress: number;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number) => void;
  onProgressChange: (value: number) => void;
  onToggleMute: () => void;
  playlistCoverUrl: string;
}

export const NowPlayingSection: React.FC<NowPlayingSectionProps> = ({
  currentSong,
  songProgress,
  volume,
  isMuted,
  onVolumeChange,
  onProgressChange,
  onToggleMute,
  playlistCoverUrl
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "flex items-center mb-6 p-4 rounded-md",
      isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
    )}>
      <div className="flex items-center flex-1">
        <img 
          src={playlistCoverUrl} 
          alt={currentSong.title} 
          className="w-12 h-12 object-cover rounded mr-4"
        />
        <div>
          <p className={cn("font-medium", isDark ? "text-white" : "text-gray-800")}>
            Now Playing: {currentSong.title}
          </p>
          <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
            {currentSong.artist}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="w-64 flex items-center">
          <span className={cn("text-xs mr-2", isDark ? "text-gray-400" : "text-gray-500")}>
            {formatTime(songProgress)}
          </span>
          <Slider
            value={[songProgress]}
            max={currentSong.duration}
            step={1}
            onValueChange={([value]) => onProgressChange(value)}
            className="w-40"
          />
          <span className={cn("text-xs ml-2", isDark ? "text-gray-400" : "text-gray-500")}>
            {formatTime(currentSong.duration)}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className={cn(isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800")}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={([value]) => onVolumeChange(value)}
          className="w-24"
        />
      </div>
    </div>
  );
};
