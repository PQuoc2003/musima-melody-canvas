import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Clock, Heart, MoreHorizontal, Play, Pause, MoreVertical, 
  PlusCircle, Trash2, Volume2, VolumeX, Edit, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { EditPlaylistDialog } from '@/components/playlist/EditPlaylistDialog';
import { EditSongDialog } from '@/components/playlist/EditSongDialog';
import { AddSongDialog } from '@/components/playlist/AddSongDialog';
import { AddToPlaylistDialog } from '@/components/playlist/AddToPlaylistDialog';

// Format time helper
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Audio processing utilities
const applyFilter = (audioContext: AudioContext, audioSource: MediaElementAudioSourceNode, filterType: BiquadFilterType, frequency: number, gain: number) => {
  const filter = audioContext.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;
  if (filterType === 'peaking') {
    filter.gain.value = gain;
  }
  audioSource.connect(filter);
  filter.connect(audioContext.destination);
  return filter;
};

// Sample playlists data
const playlists = [
  { 
    id: "1", 
    name: "Chill Vibes", 
    description: "Relaxing tunes for your downtime",
    songs: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `Chill Song ${i + 1}`,
      artist: `Artist ${Math.floor(i / 3) + 1}`,
      album: `Album ${Math.floor(i / 4) + 1}`,
      duration: Math.floor(Math.random() * 300) + 120,
      liked: Math.random() > 0.7,
      songUrl: "https://docs.google.com/uc?export=open&id=1V-c_WmanMA9i6vi4lI-tOWXtf2AH_L1r" // Sample song URL (using a sample audio file)
    })),
    coverUrl: "https://via.placeholder.com/300",
    createdAt: "2023-04-15"
  },
  { 
    id: "2", 
    name: "Workout Mix", 
    description: "High energy beats to power your workout",
    songs: Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Workout Song ${i + 1}`,
      artist: `Artist ${Math.floor(i / 3) + 1}`,
      album: `Album ${Math.floor(i / 4) + 1}`,
      duration: Math.floor(Math.random() * 300) + 120,
      liked: Math.random() > 0.7,
      songUrl: "https://docs.google.com/uc?export=open&id=1V-c_WmanMA9i6vi4lI-tOWXtf2AH_L1r" // Sample song URL
    })),
    coverUrl: "https://via.placeholder.com/300",
    createdAt: "2023-06-22"
  },
];

const PlaylistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [volume, setVolume] = useState(70);
  const [showAudioEffectsDialog, setShowAudioEffectsDialog] = useState(false);
  const [bassBoost, setBassBoost] = useState(0);
  const [trebleBoost, setTrebleBoost] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  
  // New state variables for our new features
  const [playlistData, setPlaylistData] = useState(playlists.find(p => p.id === id) || playlists[0]);
  const [showEditPlaylistDialog, setShowEditPlaylistDialog] = useState(false);
  const [showAddSongsDialog, setShowAddSongsDialog] = useState(false);
  const [showEditSongDialog, setShowEditSongDialog] = useState(false);
  const [showAddToPlaylistDialog, setShowAddToPlaylistDialog] = useState(false);
  const [currentEditSong, setCurrentEditSong] = useState<typeof playlistData.songs[0] | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const previousVolumeRef = useRef(volume);
  
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === 'dark';
  
  // Find the playlist with the given ID
  useEffect(() => {
    const playlistFound = playlists.find(p => p.id === id) || playlists[0];
    setPlaylistData(playlistFound);
  }, [id]);
  
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
        if (currentSongIndex === -1 && playlistData.songs.length > 0) {
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
    if (currentSongIndex < playlistData.songs.length - 1) {
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
  const handleProgressChange = (values: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = values[0];
      setSongProgress(values[0]);
    }
  };
  
  // New handlers for our features
  const handleEditPlaylist = (updatedPlaylist: {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
  }) => {
    setPlaylistData({
      ...playlistData,
      name: updatedPlaylist.name,
      description: updatedPlaylist.description,
      coverUrl: updatedPlaylist.coverUrl
    });
    setShowEditPlaylistDialog(false);
  };
  
  const handleAddSongs = (newSongs: Array<{
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number;
  }>) => {
    // Convert the incoming songs to match our song format
    const songsToAdd = newSongs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration,
      liked: false,
      songUrl: "https://docs.google.com/uc?export=open&id=1V-c_WmanMA9i6vi4lI-tOWXtf2AH_L1r" // Sample URL
    }));
    
    // Add the songs to the playlist
    setPlaylistData({
      ...playlistData,
      songs: [...playlistData.songs, ...songsToAdd]
    });
    
    setShowAddSongsDialog(false);
  };
  
  const handleEditSong = (updatedSong: {
    id: number;
    title: string;
    artist: string;
    album: string;
  }) => {
    // Update the song in the playlist
    const updatedSongs = playlistData.songs.map(song => 
      song.id === updatedSong.id 
        ? { ...song, title: updatedSong.title, artist: updatedSong.artist, album: updatedSong.album } 
        : song
    );
    
    setPlaylistData({
      ...playlistData,
      songs: updatedSongs
    });
    
    setShowEditSongDialog(false);
    setCurrentEditSong(null);
  };

  const handleRemoveSong = (songId: number) => {
    // Remove the song from the playlist
    setPlaylistData({
      ...playlistData,
      songs: playlistData.songs.filter(song => song.id !== songId)
    });
    
    toast({
      title: "Song Removed",
      description: "The song has been removed from this playlist"
    });
  };
  
  const handleAddToPlaylist = (playlistId: string) => {
    // In a real app, this would make an API call to add the song to another playlist
    toast({
      title: "Song Added",
      description: `The song has been added to another playlist (ID: ${playlistId})`
    });
    
    setShowAddToPlaylistDialog(false);
    setCurrentEditSong(null);
  };

  const handleToggleLike = (songId: number) => {
    // Toggle the liked status of the song
    const updatedSongs = playlistData.songs.map(song => 
      song.id === songId 
        ? { ...song, liked: !song.liked } 
        : song
    );
    
    setPlaylistData({
      ...playlistData,
      songs: updatedSongs
    });
    
    const song = playlistData.songs.find(s => s.id === songId);
    if (song) {
      toast({
        title: song.liked ? "Removed from Liked Songs" : "Added to Liked Songs",
        description: `${song.title} by ${song.artist}`
      });
    }
  };
  
  // Calculate total playlist duration
  const totalDuration = playlistData.songs.reduce((acc, song) => acc + song.duration, 0);
  const formattedTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const mins = Math.floor((totalDuration % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };
  
  return (
    <div>
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef}
        src={currentSongIndex >= 0 ? playlistData.songs[currentSongIndex].songUrl : ""}
        onEnded={handleSongEnd}
        onTimeUpdate={() => audioRef.current && setSongProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => initializeAudio()}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Playlist header */}
      <div className="flex items-start mb-8">
        <div className="relative mr-6">
          <img 
            src={playlistData.coverUrl} 
            alt={playlistData.name} 
            className="w-48 h-48 object-cover rounded-md shadow-lg" 
          />
        </div>
        
        <div className="flex-1">
          <div className={cn("mb-2 text-sm font-medium", isDark ? "text-gray-300" : "text-gray-600")}>PLAYLIST</div>
          <h1 className={cn("text-4xl font-bold mb-2", isDark ? "text-white" : "text-gray-800")}>{playlistData.name}</h1>
          <p className={cn("text-sm mb-3", isDark ? "text-gray-300" : "text-gray-600")}>{playlistData.description}</p>
          <div className={cn("flex items-center text-sm mb-6", isDark ? "text-gray-400" : "text-gray-500")}>
            <span>{playlistData.songs.length} songs</span>
            <span className="mx-1">•</span>
            <span>{formattedTotalDuration()}</span>
            <span className="mx-1">•</span>
            <span>Created {new Date(playlistData.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-musima-primary hover:bg-musima-primary/90 gap-2"
              onClick={togglePlayPause}
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
                <DropdownMenuItem onClick={() => setShowAudioEffectsDialog(true)}>
                  Audio Effects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditPlaylistDialog(true)}>
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
      
      {/* Audio Effects Dialog */}
      <Dialog open={showAudioEffectsDialog} onOpenChange={setShowAudioEffectsDialog}>
        <DialogContent className={cn(
          "sm:max-w-[425px]", 
          isDark ? "bg-musima-surface text-white border-white/10" : "bg-white text-gray-800 border-gray-200"
        )}>
          <DialogHeader>
            <DialogTitle>Audio Effects</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={cn(isDark ? "text-gray-200" : "text-gray-700")}>Bass Boost</span>
                <span className={cn(isDark ? "text-gray-300" : "text-gray-600")}>{bassBoost > 0 ? '+' : ''}{bassBoost}</span>
              </div>
              <Slider
                value={[bassBoost]}
                min={-10}
                max={10}
                step={1}
                onValueChange={([val]) => setBassBoost(val)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={cn(isDark ? "text-gray-200" : "text-gray-700")}>Treble Boost</span>
                <span className={cn(isDark ? "text-gray-300" : "text-gray-600")}>{trebleBoost > 0 ? '+' : ''}{trebleBoost}</span>
              </div>
              <Slider
                value={[trebleBoost]}
                min={-10}
                max={10}
                step={1}
                onValueChange={([val]) => setTrebleBoost(val)}
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setBassBoost(0);
                  setTrebleBoost(0);
                }}
              >
                Reset
              </Button>
              <Button 
                onClick={() => {
                  applyAudioFilters();
                  setShowAudioEffectsDialog(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Playlist Dialog */}
      <Dialog open={showEditPlaylistDialog} onOpenChange={setShowEditPlaylistDialog}>
        <EditPlaylistDialog 
          playlist={playlistData}
          onClose={() => setShowEditPlaylistDialog(false)}
          onSave={handleEditPlaylist}
        />
      </Dialog>

      {/* Edit Song Dialog */}
      <Dialog open={showEditSongDialog && currentEditSong !== null} onOpenChange={setShowEditSongDialog}>
        {currentEditSong && (
          <EditSongDialog 
            song={currentEditSong}
            onClose={() => {
              setShowEditSongDialog(false);
              setCurrentEditSong(null);
            }}
            onSave={handleEditSong}
          />
        )}
      </Dialog>

      {/* Add Song to Another Playlist Dialog */}
      <Dialog open={showAddToPlaylistDialog && currentEditSong !== null} onOpenChange={setShowAddToPlaylistDialog}>
        {currentEditSong && (
          <AddToPlaylistDialog 
            song={currentEditSong}
            currentPlaylistId={playlistData.id}
            onClose={() => {
              setShowAddToPlaylistDialog(false);
              setCurrentEditSong(null);
            }}
            onAddToPlaylist={handleAddToPlaylist}
          />
        )}
      </Dialog>
      
      {/* Now Playing Section (if a song is currently playing) */}
      {currentSongIndex >= 0 && (
        <div className={cn(
          "flex items-center mb-6 p-4 rounded-md",
          isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
        )}>
          <div className="flex items-center flex-1">
            <img 
              src={playlistData.coverUrl} 
              alt={playlistData.songs[currentSongIndex].title} 
              className="w-12 h-12 object-cover rounded mr-4"
            />
            <div>
              <p className={cn("font-medium", isDark ? "text-white" : "text-gray-800")}>
                Now Playing: {playlistData.songs[currentSongIndex].title}
              </p>
              <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                {playlistData.songs[currentSongIndex].artist}
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
                max={playlistData.songs[currentSongIndex].duration}
                step={1}
                onValueChange={handleProgressChange}
                className="w-40"
              />
              <span className={cn("text-xs ml-2", isDark ? "text-gray-400" : "text-gray-500")}>
                {formatTime(playlistData.songs[currentSongIndex].duration)}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
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
              onValueChange={([val]) => setVolume(val)}
              className="w-24"
            />
          </div>
        </div>
      )}
      
      {/* Song list */}
      <div className={cn(
        "rounded-md border overflow-hidden",
        isDark ? "bg-musima-surface/60 border-white/10" : "bg-white/60 border-gray-200"
      )}>
        <div className="flex justify-between items-center py-3 px-4 border-b border-white/10">
          <h2 className={cn("font-bold", isDark ? "text-white" : "text-gray-800")}>Songs</h2>
          <Dialog open={showAddSongsDialog} onOpenChange={setShowAddSongsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Songs
              </Button>
            </DialogTrigger>
            <AddSongDialog 
              onClose={() => setShowAddSongsDialog(false)}
              onAddSongs={handleAddSongs}
            />
          </Dialog>
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
          {playlistData.songs.map((song, index) => (
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
                      togglePlayPause();
                    } else {
                      playSong(index);
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
                  onClick={() => handleToggleLike(song.id)}
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
                    <DropdownMenuItem onClick={() => {
                      setCurrentEditSong(song);
                      setShowAddToPlaylistDialog(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Another Playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setCurrentEditSong(song);
                      setShowEditSongDialog(true);
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Song Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => handleRemoveSong(song.id)}>
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
    </div>
  );
};

export default PlaylistDetailPage;
