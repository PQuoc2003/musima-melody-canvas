import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, PlusCircle, Music } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface MusicPlayerProps {
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ className }) => {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    progress, 
    playSong, 
    togglePlayPause, 
    setVolume, 
    setProgress,
    nextSong,
    previousSong
  } = useMusicPlayer();
  
  const [isLiked, setIsLiked] = useState(false);
  const [showAddToPlaylistDialog, setShowAddToPlaylistDialog] = useState(false);
  const { theme } = useTheme();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const playlists = [
    { id: 1, name: "Chill Vibes" },
    { id: 2, name: "Workout Mix" },
    { id: 3, name: "Focus & Study" }
  ];
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [setProgress]);

  useEffect(() => {
    const handleTrackEnd = () => {
      nextSong();
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleTrackEnd);
      return () => {
        audio.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [nextSong]);

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleAddToPlaylist = (playlistId: number) => {
    if (!currentSong) return;
    
    toast({
      title: "Added to playlist",
      description: `${currentSong.title} was added to playlist ${playlists.find(p => p.id === playlistId)?.name}`,
    });
    setShowAddToPlaylistDialog(false);
  };
  
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-20 border-t px-4 flex items-center", 
      isDark ? "bg-musima-surface border-white/10 text-white" : "bg-white border-gray-200 text-gray-800",
      className
    )}>
      <audio 
        ref={audioRef} 
        src={currentSong?.songUrl} 
        preload="auto"
      />
      
      <div className="flex items-center w-1/4">
        {currentSong ? (
          <>
            <img 
              src={currentSong.coverUrl} 
              alt={`${currentSong.title} cover`} 
              className="h-12 w-12 rounded mr-3" 
            />
            <div className="truncate">
              <p className={cn("text-sm font-medium truncate", isDark ? "text-white" : "text-gray-800")}>
                {currentSong.title}
              </p>
              <p className={cn("text-xs", isDark ? "text-gray-300" : "text-gray-600")}>
                {currentSong.artist}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="ml-2"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("h-4 w-4", isLiked ? "fill-primary text-primary" : isDark ? "text-gray-300" : "text-gray-600")} />
            </Button>
            
            <Dialog open={showAddToPlaylistDialog} onOpenChange={setShowAddToPlaylistDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-1"
                >
                  <PlusCircle className={cn("h-4 w-4", isDark ? "text-gray-300" : "text-gray-600")} />
                </Button>
              </DialogTrigger>
              <DialogContent className={cn(
                "sm:max-w-[425px]", 
                isDark ? "bg-musima-surface text-white border-white/10" : "bg-white text-gray-800 border-gray-200"
              )}>
                <DialogHeader>
                  <DialogTitle>Add to Playlist</DialogTitle>
                  <DialogDescription className={isDark ? "text-gray-300" : "text-gray-600"}>
                    Select a playlist to add "{currentSong.title}" by {currentSong.artist}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className={cn(
                    "space-y-2 max-h-60 overflow-y-auto",
                    isDark ? "bg-musima-surface" : "bg-white"
                  )}>
                    {playlists.map((playlist) => (
                      <Button
                        key={playlist.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left",
                          isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                        )}
                        onClick={() => handleAddToPlaylist(playlist.id)}
                      >
                        {playlist.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddToPlaylistDialog(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="flex items-center">
            <div className="h-12 w-12 rounded mr-3 bg-gray-200 flex items-center justify-center">
              <Music className={cn("h-6 w-6", isDark ? "text-gray-600" : "text-gray-400")} />
            </div>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              No song selected
            </p>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-2">
          <Button variant="ghost" size="icon" className={isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"}>
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"}
            onClick={previousSong}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button 
            onClick={togglePlayPause}
            variant="outline" 
            size="icon" 
            className={cn(
              "bg-musima-primary text-white border-none hover:bg-musima-primary/90 h-8 w-8",
            )}
            disabled={!currentSong}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"}
            onClick={nextSong}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className={isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"}>
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-full flex items-center">
          <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
            {formatTime(progress)}
          </span>
          <div className="flex-1 mx-2">
            <Slider
              value={[progress]}
              max={currentSong?.duration || 240}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
              disabled={!currentSong}
            />
          </div>
          <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
            {formatTime(currentSong?.duration || 0)}
          </span>
        </div>
      </div>
      
      <div className="w-1/4 flex justify-end items-center">
        <Volume2 className={cn("h-4 w-4 mr-2", isDark ? "text-gray-300" : "text-gray-600")} />
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={([val]) => setVolume(val)}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
