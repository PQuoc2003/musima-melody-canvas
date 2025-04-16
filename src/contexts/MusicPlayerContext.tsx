
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the song type to use throughout the application
export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  songUrl: string;
  duration?: number;
  liked?: boolean;
}

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: Song[];
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  nextSong: () => void;
  previousSong: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<Song[]>([]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      const newQueue = queue.slice(1);
      setCurrentSong(nextSong);
      setQueue(newQueue);
      setProgress(0);
    }
  };

  const previousSong = () => {
    // In a real app, you might have a history of played songs
    // For simplicity, we'll just reset the progress
    setProgress(0);
  };

  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        progress,
        queue,
        playSong,
        togglePlayPause,
        setVolume,
        setProgress,
        nextSong,
        previousSong,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
