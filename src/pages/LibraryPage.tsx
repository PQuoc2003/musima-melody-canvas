
import React, { useState, useRef } from 'react';
import { Search, Image, X, Music, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/use-theme';
import { useMusicPlayer, Song } from '@/contexts/MusicPlayerContext';
import SongCard from '@/components/music/SongCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const libraryItems: Song[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Song ${i + 1}`,
  artist: `Artist ${Math.floor(i / 3) + 1}`,
  album: `Album ${Math.floor(i / 5) + 1}`,
  duration: Math.floor(Math.random() * 300) + 120,
  liked: Math.random() > 0.7,
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

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ITEMS_PER_PAGE = 10;

const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSongDialog, setShowAddSongDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState('');
  const [songCoverUrl, setSongCoverUrl] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [songs, setSongs] = useState<Song[]>(libraryItems);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const songFileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const { playSong } = useMusicPlayer();
  const { toast } = useToast();

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.album && song.album.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSongs = filteredSongs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setSongCoverUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview('');
    setSongCoverUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'audio/mpeg') {
      setSongFile(file);
    }
  };

  const clearSongFile = () => {
    setSongFile(null);
    if (songFileInputRef.current) {
      songFileInputRef.current.value = '';
    }
  };

  const handleConfirmDelete = () => {
    if (songToDelete) {
      // Filter out the song to delete
      setSongs(prevSongs => prevSongs.filter(song => song.id !== songToDelete.id));
      
      // Show toast notification
      toast({
        title: "Song Deleted",
        description: `"${songToDelete.title}" has been removed from your library.`
      });
      
      // Reset state
      setSongToDelete(null);
      setShowDeleteConfirmDialog(false);
    }
  };

  const handleDeleteClick = (song: Song) => {
    setSongToDelete(song);
    setShowDeleteConfirmDialog(true);
  };

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
          <Dialog open={showAddSongDialog} onOpenChange={(open) => {
            if (!open) {
              setImagePreview('');
              setSongCoverUrl('');
              setSongFile(null);
            }
            setShowAddSongDialog(open);
          }}>
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
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="song-cover" className="text-right pt-2">
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
                        id="song-cover"
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
                          alt="Song cover preview" 
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="song-file" className="text-right pt-2">
                    Song File
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => songFileInputRef.current?.click()}
                        className={cn(isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")}
                      >
                        <Music className="h-4 w-4 mr-2" />
                        Choose MP3
                      </Button>
                      <input
                        ref={songFileInputRef}
                        id="song-file"
                        type="file"
                        accept="audio/mpeg"
                        onChange={handleSongFileChange}
                        className="hidden"
                      />
                      {songFile && (
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${textColorClass}`}>{songFile.name}</span>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={clearSongFile}
                            className={cn("ml-2", isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-800")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddSongDialog(false);
                    setImagePreview('');
                    setSongCoverUrl('');
                    setSongFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowAddSongDialog(false)}>Add Song</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {paginatedSongs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onPlay={playSong}
            onDelete={() => handleDeleteClick(song)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  className={isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  className={cn(
                    isDark ? "hover:bg-white/10" : "hover:bg-gray-100",
                    currentPage === page && (isDark ? "bg-white/20" : "bg-gray-200")
                  )}
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  className={isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <AlertDialogContent className={`${isDark ? 'bg-musima-surface text-white' : 'bg-white text-gray-800'}`}>
          <AlertDialogHeader>
            <AlertDialogTitle className={textColorClass}>
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className={mutedTextClass}>
              Are you sure you want to delete "{songToDelete?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className={isDark ? "bg-white/10 text-white hover:bg-white/20" : ""}
              onClick={() => setSongToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleConfirmDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LibraryPage;
