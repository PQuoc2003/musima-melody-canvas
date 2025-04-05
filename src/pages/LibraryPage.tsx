
import React, { useState } from 'react';
import { Clock, Heart, MoreHorizontal, Music, Play, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Sample song data
const songs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Song ${i + 1}`,
  artist: `Artist ${Math.floor(i / 3) + 1}`,
  album: `Album ${Math.floor(i / 5) + 1}`,
  duration: Math.floor(Math.random() * 300) + 120, // Random duration between 2-5 mins
  liked: Math.random() > 0.7, // Randomly liked
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
  
  // Filter songs based on search term
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-musima-muted" />
            <Input 
              placeholder="Search in library" 
              className="pl-10 w-64 bg-white/5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={showAddSongDialog} onOpenChange={setShowAddSongDialog}>
            <DialogTrigger asChild>
              <Button>Add Song</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-musima-surface text-musima-text">
              <DialogHeader>
                <DialogTitle>Add New Song</DialogTitle>
                <DialogDescription className="text-musima-muted">
                  Enter the details of the song you want to add to your library.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" className="col-span-3 bg-white/5" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="artist" className="text-right">
                    Artist
                  </Label>
                  <Input id="artist" className="col-span-3 bg-white/5" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="album" className="text-right">
                    Album
                  </Label>
                  <Input id="album" className="col-span-3 bg-white/5" />
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
      
      <div className="bg-musima-surface/60 rounded-md border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 py-3 px-4 border-b border-white/10 text-xs font-medium text-musima-muted uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-3">Artist</div>
          <div className="col-span-3">Album</div>
          <div className="col-span-1 text-right">Duration</div>
        </div>
        
        <div className="divide-y divide-white/5">
          {filteredSongs.map((song, index) => (
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
                  onClick={() => {/* Toggle like */}}
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
