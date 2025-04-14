
import React, { useState } from 'react';
import { Clock, Heart, MoreHorizontal, Play, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

// Sample wishlist data
const initialWishlist = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Wishlist Song ${i + 1}`,
  artist: `Artist ${Math.floor(i / 2) + 1}`,
  album: `Album ${Math.floor(i / 3) + 1}`,
  duration: Math.floor(Math.random() * 300) + 120, // Random duration between 2-5 mins
}));

// Format time helper
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const WishlistPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState(initialWishlist);
  const { theme } = useTheme();
  
  // Filter wishlist based on search term
  const filteredWishlist = wishlist.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter(song => song.id !== id));
  };
  
  const textColorClass = theme === 'dark' ? 'text-musima-text' : 'text-musima-text-light';
  const mutedTextClass = theme === 'dark' ? 'text-musima-muted' : 'text-musima-muted-light';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Heart className="h-8 w-8 mr-3 text-musima-primary" />
          <h1 className={`text-3xl font-bold ${textColorClass}`}>Your Wishlist</h1>
        </div>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${mutedTextClass}`} />
          <Input 
            placeholder="Search in wishlist" 
            className={`pl-10 w-64 bg-white/5 ${textColorClass}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className={`h-16 w-16 mx-auto ${mutedTextClass} mb-4`} />
          <h2 className={`text-2xl font-bold mb-2 ${textColorClass}`}>Your wishlist is empty</h2>
          <p className={`${mutedTextClass} mb-6`}>Start adding songs to your wishlist by clicking the heart icon.</p>
          <Button variant="default">Browse Library</Button>
        </div>
      ) : (
        <div className={`${theme === 'dark' ? 'bg-musima-surface/60' : 'bg-musima-surface-light/60'} rounded-md border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} overflow-hidden`}>
          <div className={`grid grid-cols-12 py-3 px-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} text-xs font-medium ${mutedTextClass} uppercase tracking-wider`}>
            <div className="col-span-1">#</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-3">Artist</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-1 text-right">Duration</div>
          </div>
          
          <div className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-black/5'}`}>
            {filteredWishlist.map((song, index) => (
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
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className={`col-span-4 font-medium truncate ${textColorClass}`}>{song.title}</div>
                <div className={`col-span-3 ${mutedTextClass} truncate`}>{song.artist}</div>
                <div className={`col-span-3 ${mutedTextClass} truncate`}>{song.album}</div>
                <div className="col-span-1 flex items-center justify-end space-x-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-musima-primary opacity-0 group-hover:opacity-100 hover:text-musima-primary/80"
                    onClick={() => removeFromWishlist(song.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <span className={`${mutedTextClass} text-sm`}>{formatTime(song.duration)}</span>
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
                    <DropdownMenuContent className={`${theme === 'dark' ? 'bg-musima-surface border-white/10' : 'bg-musima-surface-light border-black/10'} ${textColorClass}`}>
                      <DropdownMenuItem>Add to Library</DropdownMenuItem>
                      <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Remove from Wishlist</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
