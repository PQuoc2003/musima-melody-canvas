
import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { Check, Music } from 'lucide-react';

// Sample playlists data - in a real app this would come from an API
const availablePlaylists = [
  { id: "1", name: "Chill Vibes", description: "Relaxing tunes for your downtime", songCount: 12 },
  { id: "2", name: "Workout Mix", description: "High energy beats to power your workout", songCount: 15 },
  { id: "3", name: "Focus & Study", description: "Concentration boosting instrumentals", songCount: 20 },
  { id: "4", name: "Road Trip", description: "The perfect soundtrack for the open road", songCount: 25 },
  { id: "5", name: "90s Throwbacks", description: "Classic hits from the 90s", songCount: 18 },
];

interface AddToPlaylistDialogProps {
  song: {
    id: number;
    title: string;
    artist: string;
  };
  currentPlaylistId: string;
  onClose: () => void;
  onAddToPlaylist: (playlistId: string) => void;
}

export const AddToPlaylistDialog = ({ song, currentPlaylistId, onClose, onAddToPlaylist }: AddToPlaylistDialogProps) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const isDark = theme === 'dark';

  const handleAddToPlaylist = () => {
    if (!selectedPlaylist) {
      toast({
        title: "No Playlist Selected",
        description: "Please select a playlist",
        variant: "destructive"
      });
      return;
    }

    onAddToPlaylist(selectedPlaylist);
    
    const playlistName = availablePlaylists.find(p => p.id === selectedPlaylist)?.name;
    toast({
      title: "Success",
      description: `Added "${song.title}" to ${playlistName}`,
    });
    
    onClose();
  };

  // Filter out the current playlist
  const filteredPlaylists = availablePlaylists.filter(playlist => playlist.id !== currentPlaylistId);

  return (
    <DialogContent className={cn("sm:max-w-[425px]", isDark ? "bg-musima-surface text-white" : "bg-white text-gray-800")}>
      <DialogHeader>
        <DialogTitle>Add to Playlist</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <div className={cn("mb-4", isDark ? "text-white" : "text-gray-800")}>
          <p className="font-medium">{song.title}</p>
          <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>{song.artist}</p>
        </div>
        
        <h3 className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-600")}>
          Select a playlist:
        </h3>
        
        <div className={cn(
          "max-h-[250px] overflow-auto rounded-md border",
          isDark ? "border-white/10" : "border-gray-200"
        )}>
          {filteredPlaylists.length > 0 ? (
            <div className="divide-y">
              {filteredPlaylists.map((playlist) => (
                <div 
                  key={playlist.id}
                  className={cn(
                    "flex items-center p-3 cursor-pointer",
                    selectedPlaylist === playlist.id 
                      ? isDark ? "bg-white/10" : "bg-gray-100"
                      : "hover:bg-white/5",
                  )}
                  onClick={() => setSelectedPlaylist(playlist.id)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center mr-3",
                    isDark ? "bg-white/10" : "bg-gray-100",
                  )}>
                    {selectedPlaylist === playlist.id ? (
                      <Check className="h-4 w-4 text-musima-primary" />
                    ) : (
                      <Music className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-medium", isDark ? "text-white" : "text-gray-800")}>
                      {playlist.name}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                      {playlist.songCount} songs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                No other playlists available
              </p>
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddToPlaylist} disabled={!selectedPlaylist}>
          Add to Playlist
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
