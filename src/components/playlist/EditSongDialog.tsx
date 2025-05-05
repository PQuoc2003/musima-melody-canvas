
import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';

interface EditSongDialogProps {
  song: {
    id: number;
    title: string;
    artist: string;
    album: string;
  };
  onClose: () => void;
  onSave: (updatedSong: {
    id: number;
    title: string;
    artist: string;
    album: string;
  }) => void;
}

export const EditSongDialog = ({ song, onClose, onSave }: EditSongDialogProps) => {
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [album, setAlbum] = useState(song.album);
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const isDark = theme === 'dark';

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a song title",
        variant: "destructive"
      });
      return;
    }

    onSave({
      id: song.id,
      title,
      artist,
      album
    });

    toast({
      title: "Success",
      description: `Song "${title}" has been updated`,
    });
    
    onClose();
  };

  return (
    <DialogContent className={cn("sm:max-w-[425px]", isDark ? "bg-musima-surface text-white" : "bg-white text-gray-800")}>
      <DialogHeader>
        <DialogTitle>Edit Song</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="song-title" className="text-right">
            Title
          </Label>
          <Input 
            id="song-title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn("col-span-3", isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")} 
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="song-artist" className="text-right">
            Artist
          </Label>
          <Input 
            id="song-artist" 
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className={cn("col-span-3", isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")} 
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="song-album" className="text-right">
            Album
          </Label>
          <Input 
            id="song-album" 
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className={cn("col-span-3", isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")} 
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};
