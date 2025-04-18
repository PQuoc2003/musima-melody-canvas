
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/use-theme';
import { useMusicPlayer, Song } from '@/contexts/MusicPlayerContext';
import SongCard from '@/components/music/SongCard';

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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredSongs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onPlay={playSong}
          />
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
