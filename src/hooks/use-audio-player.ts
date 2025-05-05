
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { applyFilter } from '@/utils/audioUtils';
import { Song } from '@/data/playlists';

export const useAudioPlayer = (songs: Song[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [bassBoost, setBassBoost] = useState(0);
  const [trebleBoost, setTrebleBoost] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const previousVolumeRef = useRef(volume);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup audio context when component unmounts
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Update audio volume when volume state changes
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    // Handle song progress updates
    const updateProgress = () => {
      if (audioRef.current) {
        setSongProgress(audioRef.current.currentTime);
      }
    };

    const progressInterval = setInterval(updateProgress, 1000);
    return () => clearInterval(progressInterval);
  }, []);

  // Initialize audio context and source
  const initializeAudio = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      
      // Initialize with default connections
      audioSourceRef.current.connect(audioContextRef.current.destination);
    }
  };

  // Apply audio filters
  const applyAudioFilters = () => {
    if (audioContextRef.current && audioSourceRef.current) {
      // Disconnect any existing filters
      if (bassFilterRef.current) {
        bassFilterRef.current.disconnect();
      }
      if (trebleFilterRef.current) {
        trebleFilterRef.current.disconnect();
      }
      
      // Reset the connection
      audioSourceRef.current.disconnect();
      
      // Apply bass filter if needed
      if (bassBoost !== 0) {
        bassFilterRef.current = applyFilter(
          audioContextRef.current, 
          audioSourceRef.current, 
          'lowshelf', 
          200, 
          bassBoost * 10
        );
      } else {
        // If no bass boost, connect to next filter or destination
        if (trebleBoost !== 0) {
          trebleFilterRef.current = applyFilter(
            audioContextRef.current, 
            audioSourceRef.current, 
            'highshelf', 
            2000, 
            trebleBoost * 10
          );
        } else {
          // If no filters, connect directly to destination
          audioSourceRef.current.connect(audioContextRef.current.destination);
        }
      }
      
      toast({
        title: "Audio Effects Applied",
        description: `Bass: ${bassBoost > 0 ? '+' : ''}${bassBoost}, Treble: ${trebleBoost > 0 ? '+' : ''}${trebleBoost}`,
      });
    }
  };

  // Play or pause the current song
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // If no song is selected, play the first one
        if (currentSongIndex === -1 && songs.length > 0) {
          setCurrentSongIndex(0);
          // We'll start the playback in useEffect when the src is set
        } else {
          audioRef.current.play().catch(error => {
            console.error("Playback failed:", error);
            toast({
              title: "Playback Error",
              description: "Unable to play the audio. Check your connection.",
              variant: "destructive"
            });
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Play a specific song from the playlist
  const playSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    
    // The actual playing will be handled in useEffect when the src changes
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
          toast({
            title: "Playback Error",
            description: "Unable to play the audio. Check your connection.",
            variant: "destructive"
          });
          setIsPlaying(false);
        });
      }
    }, 100);
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Restore previous volume
        setVolume(previousVolumeRef.current);
        audioRef.current.volume = previousVolumeRef.current / 100;
      } else {
        // Store current volume and mute
        previousVolumeRef.current = volume;
        setVolume(0);
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  // Handle the end of a song (auto-play next)
  const handleSongEnd = () => {
    if (currentSongIndex < songs.length - 1) {
      // Play next song
      setCurrentSongIndex(currentSongIndex + 1);
      // Playback will be handled in useEffect
    } else {
      // End of playlist
      setIsPlaying(false);
      setCurrentSongIndex(-1);
    }
  };

  // Update progress bar when user drags it
  const handleProgressChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setSongProgress(value);
    }
  };

  return {
    audioRef,
    isPlaying,
    currentSongIndex,
    volume,
    isMuted,
    songProgress,
    bassBoost,
    trebleBoost,
    initializeAudio,
    togglePlayPause,
    playSong,
    toggleMute,
    handleSongEnd,
    handleProgressChange,
    setVolume,
    setBassBoost,
    setTrebleBoost,
    applyAudioFilters,
    setSongProgress
  };
};
