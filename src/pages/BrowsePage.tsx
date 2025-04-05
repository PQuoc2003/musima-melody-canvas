
import React, { useState } from 'react';
import { Search, Music, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample genres for browsing
const genres = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Jazz", "Classical", "Electronic", 
  "Folk", "Country", "Metal", "Indie", "Blues", "Reggae", "Latin"
];

// Sample songs for browsing
const browseSongs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Discover Song ${i + 1}`,
  artist: `Artist ${Math.floor(i / 3) + 1}`,
  genre: genres[i % genres.length],
  coverUrl: `https://via.placeholder.com/120?text=Song${i+1}`
}));

// Sample albums for browsing
const browseAlbums = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Album ${i + 1}`,
  artist: `Artist ${Math.floor(i / 2) + 1}`,
  year: 2020 + (i % 5),
  songCount: Math.floor(Math.random() * 10) + 5,
  coverUrl: `https://via.placeholder.com/180?text=Album${i+1}`
}));

// Sample artists for browsing
const browseArtists = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Artist ${i + 1}`,
  genre: genres[i % genres.length],
  songCount: Math.floor(Math.random() * 30) + 10,
  imageUrl: `https://via.placeholder.com/150?text=Artist${i+1}`
}));

const BrowsePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter content based on search term
  const filteredSongs = browseSongs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAlbums = browseAlbums.filter(album => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredArtists = browseArtists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Browse Music</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-musima-muted" />
            <Input 
              placeholder="Search songs, albums, artists..." 
              className="pl-10 w-72 bg-white/5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Popular Genres</h2>
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Button 
              key={genre} 
              variant="outline" 
              className="bg-musima-surface/50 border-white/10 hover:border-white/30 hover:bg-musima-surface"
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
      
      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="bg-musima-surface/50 border border-white/10">
          <TabsTrigger value="songs" className="data-[state=active]:bg-musima-primary data-[state=active]:text-white">
            Songs
          </TabsTrigger>
          <TabsTrigger value="albums" className="data-[state=active]:bg-musima-primary data-[state=active]:text-white">
            Albums
          </TabsTrigger>
          <TabsTrigger value="artists" className="data-[state=active]:bg-musima-primary data-[state=active]:text-white">
            Artists
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="songs" className="mt-6">
          <div className="grid grid-cols-4 gap-6">
            {filteredSongs.slice(0, 8).map((song) => (
              <div key={song.id} className="group">
                <div className="relative overflow-hidden rounded-md album-cover">
                  <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" variant="ghost" className="text-white bg-musima-primary/90 hover:bg-musima-primary">
                      <Music className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium truncate">{song.title}</h3>
                <p className="text-xs text-musima-muted truncate">{song.artist}</p>
                <p className="text-xs text-musima-muted truncate">{song.genre}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="albums" className="mt-6">
          <div className="grid grid-cols-4 gap-6">
            {filteredAlbums.map((album) => (
              <Card key={album.id} className="bg-musima-surface border-white/5 hover:border-white/20 transition-colors">
                <CardContent className="p-4">
                  <div className="relative overflow-hidden rounded-md mb-3 album-cover">
                    <img src={album.coverUrl} alt={album.title} className="w-full aspect-square object-cover" />
                  </div>
                  <h3 className="font-bold text-lg truncate">{album.title}</h3>
                  <p className="text-xs text-musima-muted mb-1">{album.artist} • {album.year}</p>
                  <p className="text-xs text-musima-muted">{album.songCount} songs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="artists" className="mt-6">
          <div className="grid grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <div key={artist.id} className="text-center">
                <div className="relative overflow-hidden rounded-full aspect-square w-36 h-36 mx-auto mb-3 album-cover">
                  <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg truncate">{artist.name}</h3>
                <p className="text-xs text-musima-muted mb-1">{artist.genre}</p>
                <p className="text-xs text-musima-muted">{artist.songCount} songs</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrowsePage;
