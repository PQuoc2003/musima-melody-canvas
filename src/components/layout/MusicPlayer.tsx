
import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(30);
  
  // Sample song data - in a real app this would come from props or context
  const song = {
    title: "Midnight Serenade",
    artist: "Luna Waves",
    album: "Ethereal Dreams",
    coverUrl: "https://via.placeholder.com/60"
  };
  
  // Format time (seconds -> mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 h-20 bg-musima-surface border-t border-white/10 px-4 flex items-center", className)}>
      <div className="flex items-center w-1/4">
        <img src={song.coverUrl} alt={`${song.title} cover`} className="h-12 w-12 rounded mr-3" />
        <div className="truncate">
          <p className="text-sm font-medium truncate">{song.title}</p>
          <p className="text-xs text-musima-muted truncate">{song.artist}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-4"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn("h-4 w-4", isLiked ? "fill-musima-primary text-musima-primary" : "text-musima-muted")} />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-2">
          <Button variant="ghost" size="icon" className="text-musima-muted hover:text-musima-text">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-musima-muted hover:text-musima-text">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button 
            onClick={() => setIsPlaying(!isPlaying)}
            variant="outline" 
            size="icon" 
            className="bg-musima-primary text-white border-none hover:bg-musima-primary/90 h-8 w-8"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-musima-muted hover:text-musima-text">
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-musima-muted hover:text-musima-text">
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-full flex items-center">
          <span className="text-xs text-musima-muted mr-2">{formatTime(progress)}</span>
          <div className="flex-1 mx-2">
            <Slider
              value={[progress]}
              max={240}
              step={1}
              onValueChange={([val]) => setProgress(val)}
              className="w-full"
            />
          </div>
          <span className="text-xs text-musima-muted ml-2">{formatTime(240)}</span>
        </div>
      </div>
      
      <div className="w-1/4 flex justify-end items-center">
        <Volume2 className="h-4 w-4 text-musima-muted mr-2" />
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
