
import React, { useState, useRef } from 'react';
import { PlusCircle, Edit, Trash2, Music, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Sample playlists data
const samplePlaylists = [
  { id: 1, name: "Chill Vibes", description: "Relaxing tunes for your downtime", songCount: 25, coverUrl: "https://via.placeholder.com/160" },
  { id: 2, name: "Workout Mix", description: "High energy beats to power your workout", songCount: 18, coverUrl: "https://via.placeholder.com/160" },
  { id: 3, name: "Focus & Study", description: "Concentration boosting instrumentals", songCount: 32, coverUrl: "https://via.placeholder.com/160" },
  { id: 4, name: "Road Trip", description: "The perfect soundtrack for the open road", songCount: 40, coverUrl: "https://via.placeholder.com/160" },
  { id: 5, name: "90s Throwbacks", description: "Classic hits from the 90s", songCount: 28, coverUrl: "https://via.placeholder.com/160" },
  { id: 6, name: "Indie Discoveries", description: "Fresh indie tracks you'll love", songCount: 15, coverUrl: "https://via.placeholder.com/160" },
];

const PlaylistsPage = () => {
  const [showNewPlaylistDialog, setShowNewPlaylistDialog] = useState(false);
  const [playlists, setPlaylists] = useState(samplePlaylists);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistCoverUrl, setPlaylistCoverUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
        // In a real app, you'd set the playlistCoverUrl to the URL returned from your server
        setPlaylistCoverUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview('');
    setPlaylistCoverUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const createPlaylist = () => {
    if (!playlistName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a playlist name",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would be an API call to create a playlist
    const newPlaylist = {
      id: playlists.length + 1,
      name: playlistName,
      description: playlistDescription,
      songCount: 0,
      coverUrl: playlistCoverUrl || "https://via.placeholder.com/160"
    };

    setPlaylists([...playlists, newPlaylist]);
    toast({
      title: "Success",
      description: `Playlist "${playlistName}" has been created`,
    });
    
    // Reset form
    setPlaylistName('');
    setPlaylistDescription('');
    setPlaylistCoverUrl('');
    setImagePreview('');
    setShowNewPlaylistDialog(false);
  };

  const handlePlaylistClick = (playlistId: number) => {
    // Navigate to the playlist detail page
    navigate(`/playlists/${playlistId}`);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-800")}>Your Playlists</h1>
        <Dialog open={showNewPlaylistDialog} onOpenChange={setShowNewPlaylistDialog}>
          <DialogTrigger asChild>
            <Button variant="default" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className={cn("sm:max-w-[500px]", isDark ? "bg-musima-surface text-white" : "bg-white text-gray-800")}>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription className={isDark ? "text-gray-300" : "text-gray-600"}>
                Fill out the details for your new playlist.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="playlist-name" className="text-right">
                  Name
                </Label>
                <Input 
                  id="playlist-name" 
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
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
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
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
              <Button variant="outline" onClick={() => {
                setShowNewPlaylistDialog(false);
                setPlaylistName('');
                setPlaylistDescription('');
                setImagePreview('');
                setPlaylistCoverUrl('');
              }}>Cancel</Button>
              <Button onClick={createPlaylist}>Create Playlist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Card 
            key={playlist.id} 
            className={cn(
              "transition-colors cursor-pointer",
              isDark 
                ? "bg-musima-surface border-white/5 hover:border-white/20" 
                : "bg-white border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handlePlaylistClick(playlist.id)}
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <img src={playlist.coverUrl} alt={playlist.name} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <Button className="bg-musima-primary text-white hover:bg-musima-primary/90 h-10 w-10 rounded-full">
                      <Music className="h-5 w-5" />
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="text-white bg-white/10 hover:bg-white/20 h-9 w-9 rounded-full">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white bg-white/10 hover:bg-white/20 h-9 w-9 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className={cn("font-bold text-lg truncate", isDark ? "text-white" : "text-gray-800")}>{playlist.name}</h3>
                <p className={cn("text-xs mb-1 line-clamp-2 h-8", isDark ? "text-gray-300" : "text-gray-600")}>{playlist.description}</p>
                <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{playlist.songCount} songs</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsPage;
