
import React, { useRef, useState } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';

interface EditPlaylistDialogProps {
  playlist: {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
  };
  onClose: () => void;
  onSave: (updatedPlaylist: {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
  }) => void;
}

export const EditPlaylistDialog = ({ playlist, onClose, onSave }: EditPlaylistDialogProps) => {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [coverUrl, setCoverUrl] = useState(playlist.coverUrl);
  const [imagePreview, setImagePreview] = useState(playlist.coverUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const isDark = theme === 'dark';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server/storage
      // For now, we'll just create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setCoverUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview('');
    setCoverUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a playlist name",
        variant: "destructive"
      });
      return;
    }

    onSave({
      id: playlist.id,
      name,
      description,
      coverUrl: coverUrl || "https://via.placeholder.com/300"
    });

    toast({
      title: "Success",
      description: `Playlist "${name}" has been updated`,
    });
    
    onClose();
  };

  return (
    <DialogContent className={cn("sm:max-w-[500px]", isDark ? "bg-musima-surface text-white" : "bg-white text-gray-800")}>
      <DialogHeader>
        <DialogTitle>Edit Playlist</DialogTitle>
        <DialogDescription className={isDark ? "text-gray-300" : "text-gray-600"}>
          Update the details of your playlist.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="playlist-name" className="text-right">
            Name
          </Label>
          <Input 
            id="playlist-name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn("col-span-3", isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")} 
            placeholder="Enter playlist name"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="playlist-description" className="text-right">
            Description
          </Label>
          <Textarea 
            id="playlist-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn("col-span-3 min-h-[80px]", isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")}
            placeholder="Describe your playlist" 
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="playlist-cover" className="text-right pt-2">
            Cover Image
          </Label>
          <div className="col-span-3">
            <div className="flex items-center gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className={cn(isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")}
              >
                <Image className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                id="playlist-cover"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagePreview && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearImage}
                  className={cn("ml-2", isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-4 relative w-32 h-32">
                <img 
                  src={imagePreview} 
                  alt="Playlist cover preview" 
                  className="w-full h-full object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};
