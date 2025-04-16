
import React, { useState } from 'react';
import { Clock, Heart, MoreHorizontal, Music, Play, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useMusicPlayer, Song } from '@/contexts/MusicPlayerContext';

// Sample song data
const libraryItems: Song[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Song ${i + 1}`,
  artist: `Artist ${Math.floor(i / 3) + 1}`,
  album: `Album ${Math.floor(i / 5) + 1}`,
  duration: Math.floor(Math.random() * 300) + 120, // Random duration between 2-5 mins
  liked: Math.random() > 0.7, // Randomly liked
  // Add unique cover images and song URLs
  coverUrl: `https://via.placeholder.com/60/${Math.floor(Math.random()*16777215).toString(16)}`,
  songUrl: i % 5 === 0 
    ? "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
    : i % 5 === 1 
    ? "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3"
    : i % 5 === 2
    ? "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3"
    : i % 5 === 3
    ? "https://assets.mixkit.co/music/preview/mixkit-classical-strings-chamber-quartet-518.mp3"
    : "https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3",
}));

// Format time helper
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSongDialog, setShowAddSongDialog] = useState(false);
  const { theme } = useTheme();
  const { playSong } = useMusicPlayer();
  
  // Filter songs based on search term
  const filteredSongs = libraryItems.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.album && song.album.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const isDark = theme === 'dark';
  const textColorClass = isDark ? 'text-white' : 'text-gray-800';
  const mutedTextClass = isDark ? 'text-gray-400' : 'text-gray-500';
  
  const handlePlaySong = (song: Song) => {
    playSong(song);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${textColorClass}`}>Your Library</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${mutedTextClass}`} />
            <Input 
              placeholder="Search in library" 
              className={`pl-10 w-64 ${isDark ? 'bg-white/5' : 'bg-gray-100'} ${textColorClass}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={showAddSongDialog} onOpenChange={setShowAddSongDialog}>
            <DialogTrigger asChild>
              <Button>Add Song</Button>
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[425px] ${isDark ? 'bg-musima-surface text-white' : 'bg-white text-gray-800'}`}>
              <DialogHeader>
                <DialogTitle className={textColorClass}>Add New Song</DialogTitle>
                <DialogDescription className={mutedTextClass}>
                  Enter the details of the song you want to add to your library.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" className={`col-span-3 ${isDark ? 'bg-white/5' : 'bg-gray-100'} ${textColorClass}`} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="artist" className="text-right">
                    Artist
                  </Label>
                  <Input id="artist" className={`col-span-3 ${isDark ? 'bg-white/5' : 'bg-gray-100'} ${textColorClass}`} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="album" className="text-right">
                    Album
                  </Label>
                  <Input id="album" className={`col-span-3 ${isDark ? 'bg-white/5' : 'bg-gray-100'} ${textColorClass}`} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddSongDialog(false)}>Cancel</Button>
                <Button onClick={() => setShowAddSongDialog(false)}>Add Song</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className={`${isDark ? 'bg-musima-surface/60' : 'bg-white'} rounded-md border ${isDark ? 'border-white/10' : 'border-gray-200'} overflow-hidden`}>
        <div className={`grid grid-cols-12 py-3 px-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} text-xs font-medium ${mutedTextClass} uppercase tracking-wider`}>
          <div className="col-span-1">#</div>
          <div className="col-span-1"></div> {/* Cover column */}
          <div className="col-span-3">Title</div>
          <div className="col-span-3">Artist</div>
          <div className="col-span-3">Album</div>
          <div className="col-span-1 text-right">Duration</div>
        </div>
        
        <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
          {filteredSongs.map((song, index) => (
            <div 
              key={song.id}
              className={`grid grid-cols-12 py-3 px-4 items-center hover:bg-white/5 group transition-colors playlist-item`}
            >
              <div className="col-span-1 flex items-center">
                <span className={`${mutedTextClass} group-hover:hidden`}>{index + 1}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`hidden group-hover:flex h-7 w-7 ${textColorClass}`}
                  onClick={() => handlePlaySong(song)}
                >
                  <Play className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="col-span-1">
                <img 
                  src={song.coverUrl} 
                  alt={song.title} 
                  className="h-10 w-10 rounded object-cover"
                />
              </div>
              <div className={`col-span-3 font-medium truncate ${textColorClass}`}>{song.title}</div>
              <div className={`col-span-3 ${mutedTextClass} truncate`}>{song.artist}</div>
              <div className={`col-span-3 ${mutedTextClass} truncate`}>{song.album}</div>
              <div className="col-span-1 flex items-center justify-end space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-7 w-7 ${mutedTextClass} opacity-0 group-hover:opacity-100 hover:${textColorClass}`}
                  onClick={() => {/* Toggle like */}}
                >
                  <Heart className={cn("h-4 w-4", song.liked && "fill-musima-primary text-musima-primary")} />
                </Button>
                <span className={`${mutedTextClass} text-sm`}>{formatTime(song.duration || 0)}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-7 w-7 ${mutedTextClass} opacity-0 group-hover:opacity-100 hover:${textColorClass}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={`${isDark ? 'bg-musima-surface border-white/10' : 'bg-white border-gray-200'} ${textColorClass}`}>
                    <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                    <DropdownMenuItem>Add to Wishlist</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
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

export default LibraryPage;
