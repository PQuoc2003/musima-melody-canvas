
import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <Dialog open={showNewPlaylistDialog} onOpenChange={setShowNewPlaylistDialog}>
          <DialogTrigger asChild>
            <Button variant="default" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-musima-surface text-musima-text">
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription className="text-musima-muted">
                Fill out the details for your new playlist.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="playlist-name" className="text-right">
                  Name
                </Label>
                <Input id="playlist-name" className="col-span-3 bg-white/5" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="playlist-description" className="text-right">
                  Description
                </Label>
                <Textarea 
                  id="playlist-description" 
                  className="col-span-3 bg-white/5 min-h-[80px]"
                  placeholder="Describe your playlist" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewPlaylistDialog(false)}>Cancel</Button>
              <Button onClick={() => setShowNewPlaylistDialog(false)}>Create Playlist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="bg-musima-surface border-white/5 hover:border-white/20 transition-colors">
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
                <h3 className="font-bold text-lg truncate">{playlist.name}</h3>
                <p className="text-xs text-musima-muted mb-1 line-clamp-2 h-8">{playlist.description}</p>
                <p className="text-xs text-musima-muted">{playlist.songCount} songs</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsPage;
