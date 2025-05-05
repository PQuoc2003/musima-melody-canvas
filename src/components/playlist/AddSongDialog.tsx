
import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search } from 'lucide-react';

// Sample library songs data - in a real app this would come from an API
const librarySongs = [
  { id: 101, title: "New Horizon", artist: "Studio Band", album: "First Light", duration: 245 },
  { id: 102, title: "Everlasting", artist: "The Waves", album: "Ocean Breeze", duration: 198 },
  { id: 103, title: "Silent Motion", artist: "Rhythm Collective", album: "Deep Thoughts", duration: 274 },
  { id: 104, title: "Midnight Dreams", artist: "Luna Park", album: "After Hours", duration: 215 },
  { id: 105, title: "First Light", artist: "Ray Charles", album: "Morning Sun", duration: 235 },
  { id: 106, title: "Urban Jungle", artist: "City Beats", album: "Concrete Rhythms", duration: 203 },
  { id: 107, title: "Summer Nostalgia", artist: "Chill Wave", album: "Memories", duration: 192 },
  { id: 108, title: "Mountain High", artist: "Nature Sounds", album: "Peaceful Mind", duration: 285 },
];

interface AddSongDialogProps {
  onClose: () => void;
  onAddSongs: (selectedSongs: Array<{
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number;
  }>) => void;
}

export const AddSongDialog = ({ onClose, onAddSongs }: AddSongDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<Array<typeof librarySongs[0]>>([]);
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const isDark = theme === 'dark';

  const filteredSongs = librarySongs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSongSelection = (song: typeof librarySongs[0]) => {
    if (selectedSongs.some(s => s.id === song.id)) {
      setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleAddSongs = () => {
    if (selectedSongs.length === 0) {
      toast({
        title: "No Songs Selected",
        description: "Please select at least one song to add",
        variant: "destructive"
      });
      return;
    }

    onAddSongs(selectedSongs);
    
    toast({
      title: "Success",
      description: `Added ${selectedSongs.length} song${selectedSongs.length > 1 ? 's' : ''} to playlist`,
    });
    
    onClose();
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <DialogContent className={cn("sm:max-w-[600px]", isDark ? "bg-musima-surface text-white" : "bg-white text-gray-800")}>
      <DialogHeader>
        <DialogTitle>Add Songs to Playlist</DialogTitle>
        <DialogDescription className={isDark ? "text-gray-300" : "text-gray-600"}>
          Search and select songs from your library.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="relative mb-6">
          <Search className={cn("absolute left-3 top-3 h-4 w-4", isDark ? "text-gray-400" : "text-gray-500")} />
          <Input 
            placeholder="Search songs by title, artist, or album" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn("pl-10", isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")}
          />
        </div>
        
        <div className={cn(
          "max-h-[350px] overflow-auto rounded-md border",
          isDark ? "border-white/10" : "border-gray-200"
        )}>
          <table className="w-full">
            <thead className={cn(
              "sticky top-0", 
              isDark ? "bg-musima-surface/80 text-gray-400" : "bg-white/80 text-gray-500"
            )}>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-10"></th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Artist</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Album</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-white/10" : "divide-gray-200")}>
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => (
                  <tr 
                    key={song.id}
                    className={cn(
                      "cursor-pointer hover:bg-white/5",
                      selectedSongs.some(s => s.id === song.id) && (isDark ? "bg-white/10" : "bg-gray-100")
                    )}
                    onClick={() => toggleSongSelection(song)}
                  >
                    <td className="px-4 py-3 w-10">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "h-8 w-8 p-0",
                          selectedSongs.some(s => s.id === song.id)
                            ? "bg-musima-primary text-white hover:bg-musima-primary/90"
                            : isDark ? "text-gray-300" : "text-gray-600"
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="px-4 py-3 text-sm">{song.title}</td>
                    <td className="px-4 py-3 text-sm">{song.artist}</td>
                    <td className="px-4 py-3 text-sm">{song.album}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatTime(song.duration)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm">
                    {searchTerm
                      ? "No songs match your search"
                      : "Your library is empty"
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
            {selectedSongs.length} song{selectedSongs.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddSongs} disabled={selectedSongs.length === 0}>
          Add to Playlist
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
