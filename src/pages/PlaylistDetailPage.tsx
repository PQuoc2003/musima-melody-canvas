
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { EditPlaylistDialog } from '@/components/playlist/EditPlaylistDialog';
import { EditSongDialog } from '@/components/playlist/EditSongDialog';
import { AddSongDialog } from '@/components/playlist/AddSongDialog';
import { AddToPlaylistDialog } from '@/components/playlist/AddToPlaylistDialog';
import { PlaylistHeader } from '@/components/playlist/PlaylistHeader';
import { AudioEffectsDialog } from '@/components/playlist/AudioEffectsDialog';
import { NowPlayingSection } from '@/components/playlist/NowPlayingSection';
import { SongsList } from '@/components/playlist/SongsList';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { playlists, Song } from '@/data/playlists';

const PlaylistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showAudioEffectsDialog, setShowAudioEffectsDialog] = useState(false);
  
  // State variables for dialogs and editing
  const [playlistData, setPlaylistData] = useState(playlists.find(p => p.id === id) || playlists[0]);
  const [showEditPlaylistDialog, setShowEditPlaylistDialog] = useState(false);
  const [showAddSongsDialog, setShowAddSongsDialog] = useState(false);
  const [showEditSongDialog, setShowEditSongDialog] = useState(false);
  const [showAddToPlaylistDialog, setShowAddToPlaylistDialog] = useState(false);
  const [currentEditSong, setCurrentEditSong] = useState<Song | null>(null);
  
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Initialize the audio player hook
  const {
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
  } = useAudioPlayer(playlistData.songs);
  
  // Find the playlist with the given ID
  useEffect(() => {
    const playlistFound = playlists.find(p => p.id === id) || playlists[0];
    setPlaylistData(playlistFound);
  }, [id]);
  
  // Handlers for playlist and song operations
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

  return (
    <div>
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef}
        src={currentSongIndex >= 0 ? playlistData.songs[currentSongIndex].songUrl : ""}
        onEnded={handleSongEnd}
        onTimeUpdate={() => {
          if (audioRef.current) {
            // Fix: Use the current time from the audio element
            const currentTime = audioRef.current.currentTime;
            handleProgressChange(currentTime);
          }
        }}
        onLoadedMetadata={() => initializeAudio()}
        onPlay={() => {
          // Fix: No need to call setIsPlaying as it's managed by the audio hook
        }}
        onPause={() => {
          // Fix: No need to call setIsPlaying as it's managed by the audio hook
        }}
      />
      
      {/* Playlist header */}
      <PlaylistHeader
        playlist={playlistData}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onEditPlaylist={() => setShowEditPlaylistDialog(true)}
        onShowAudioEffects={() => setShowAudioEffectsDialog(true)}
      />
      
      {/* Audio Effects Dialog */}
      <Dialog open={showAudioEffectsDialog} onOpenChange={setShowAudioEffectsDialog}>
        <AudioEffectsDialog
          bassBoost={bassBoost}
          setBassBoost={setBassBoost}
          trebleBoost={trebleBoost}
          setTrebleBoost={setTrebleBoost}
          onApply={applyAudioFilters}
          onClose={() => setShowAudioEffectsDialog(false)}
        />
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
        <NowPlayingSection
          currentSong={playlistData.songs[currentSongIndex]}
          songProgress={songProgress}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onProgressChange={handleProgressChange}
          onToggleMute={toggleMute}
          playlistCoverUrl={playlistData.coverUrl}
        />
      )}
      
      {/* Song list */}
      <SongsList 
        songs={playlistData.songs}
        currentSongIndex={currentSongIndex}
        isPlaying={isPlaying}
        onPlaySong={playSong}
        onToggleLike={handleToggleLike}
        onRemoveSong={handleRemoveSong}
        onEditSong={(song) => {
          setCurrentEditSong(song);
          setShowEditSongDialog(true);
        }}
        onAddToOtherPlaylist={(song) => {
          setCurrentEditSong(song);
          setShowAddToPlaylistDialog(true);
        }}
        onShowAddSongsDialog={() => setShowAddSongsDialog(true)}
      />

      {/* Add Songs Dialog */}
      <Dialog open={showAddSongsDialog} onOpenChange={setShowAddSongsDialog}>
        <AddSongDialog 
          onClose={() => setShowAddSongsDialog(false)}
          onAddSongs={handleAddSongs}
        />
      </Dialog>
    </div>
  );
};

export default PlaylistDetailPage;
