
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Heart, MoreHorizontal, Play, Pause, MoreVertical, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Format time helper
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
    })),
    coverUrl: "https://via.placeholder.com/300",
    createdAt: "2023-06-22"
  },
];

const PlaylistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Find the playlist with the given ID
  const playlist = playlists.find(p => p.id === id) || playlists[0]; // Fallback to first playlist if not found
  
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
    <div>
      {/* Playlist header */}
      <div className="flex items-start mb-8">
        <div className="relative mr-6">
          <img 
            src={playlist.coverUrl} 
            alt={playlist.name} 
            className="w-48 h-48 object-cover rounded-md shadow-lg" 
          />
        </div>
        
        <div className="flex-1">
          <div className="mb-2 text-sm font-medium text-musima-muted">PLAYLIST</div>
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-musima-muted text-sm mb-3">{playlist.description}</p>
          <div className="flex items-center text-musima-muted text-sm mb-6">
            <span>{playlist.songs.length} songs</span>
            <span className="mx-1">•</span>
            <span>{formattedTotalDuration()}</span>
            <span className="mx-1">•</span>
            <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-musima-primary hover:bg-musima-primary/90 gap-2"
              onClick={() => setIsPlaying(!isPlaying)}
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
              <DropdownMenuContent className="bg-musima-surface border-white/10 text-musima-text">
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuItem>Share Playlist</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">Delete Playlist</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Song list */}
      <div className="bg-musima-surface/60 rounded-md border border-white/10 overflow-hidden">
        <div className="flex justify-between items-center py-3 px-4 border-b border-white/10">
          <h2 className="font-bold">Songs</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Songs
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-musima-surface text-musima-text">
              <DialogHeader>
                <DialogTitle>Add Songs to Playlist</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {/* Song selection UI would go here */}
                <p className="text-musima-muted">Select songs from your library to add to this playlist.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-12 py-3 px-4 border-b border-white/10 text-xs font-medium text-musima-muted uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-3">Artist</div>
          <div className="col-span-3">Album</div>
          <div className="col-span-1 text-right">Duration</div>
        </div>
        
        <div className="divide-y divide-white/5">
          {playlist.songs.map((song, index) => (
            <div 
              key={song.id}
              className="grid grid-cols-12 py-3 px-4 items-center hover:bg-white/5 group transition-colors playlist-item"
            >
              <div className="col-span-1 flex items-center">
                <span className="text-musima-muted group-hover:hidden">{index + 1}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden group-hover:flex h-7 w-7 text-musima-text"
                >
                  <Play className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="col-span-4 font-medium truncate">{song.title}</div>
              <div className="col-span-3 text-musima-muted truncate">{song.artist}</div>
              <div className="col-span-3 text-musima-muted truncate">{song.album}</div>
              <div className="col-span-1 flex items-center justify-end space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-musima-muted opacity-0 group-hover:opacity-100 hover:text-musima-text"
                >
                  <Heart className={cn("h-4 w-4", song.liked && "fill-musima-primary text-musima-primary")} />
                </Button>
                <span className="text-musima-muted text-sm">{formatTime(song.duration)}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-musima-muted opacity-0 group-hover:opacity-100 hover:text-musima-text"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-musima-surface border-white/10 text-musima-text">
                    <DropdownMenuItem>Add to Another Playlist</DropdownMenuItem>
                    <DropdownMenuItem>Add to Wishlist</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
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
