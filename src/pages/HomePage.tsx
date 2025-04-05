
import React from 'react';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Sample data
const recentlyPlayed = [
  { id: 1, title: "Starlight Melody", artist: "Cosmic Dreamers", coverUrl: "https://via.placeholder.com/120" },
  { id: 2, title: "Ocean Waves", artist: "Nature Sounds", coverUrl: "https://via.placeholder.com/120" },
  { id: 3, title: "Urban Rhythm", artist: "City Beats", coverUrl: "https://via.placeholder.com/120" },
  { id: 4, title: "Mountain Echo", artist: "Highland Band", coverUrl: "https://via.placeholder.com/120" },
  { id: 5, title: "Electric Dreams", artist: "Synth Masters", coverUrl: "https://via.placeholder.com/120" },
];

const topPlaylists = [
  { id: 1, name: "Chill Vibes", description: "Relaxing tunes for your downtime", coverUrl: "https://via.placeholder.com/160", songCount: 25 },
  { id: 2, name: "Workout Mix", description: "High energy beats to power your workout", coverUrl: "https://via.placeholder.com/160", songCount: 18 },
  { id: 3, name: "Focus & Study", description: "Concentration boosting instrumentals", coverUrl: "https://via.placeholder.com/160", songCount: 32 },
  { id: 4, name: "Road Trip", description: "The perfect soundtrack for the open road", coverUrl: "https://via.placeholder.com/160", songCount: 40 },
];

// Recently played songs row
const RecentlyPlayed = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
    <div className="grid grid-cols-5 gap-4">
      {recentlyPlayed.map((song) => (
        <div key={song.id} className="group relative">
          <div className="relative overflow-hidden rounded-md album-cover">
            <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="icon" variant="ghost" className="text-white bg-musima-primary/90 hover:bg-musima-primary">
                <Play className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <h3 className="mt-2 text-sm font-medium truncate">{song.title}</h3>
          <p className="text-xs text-musima-muted truncate">{song.artist}</p>
        </div>
      ))}
    </div>
  </div>
);

// Top playlists section
const TopPlaylists = () => (
  <div className="mt-10">
    <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
    <div className="grid grid-cols-4 gap-6">
      {topPlaylists.map((playlist) => (
        <Card key={playlist.id} className="bg-musima-surface border-white/5 hover:border-white/20 transition-colors">
          <CardContent className="p-4">
            <div className="relative overflow-hidden rounded-md mb-3 album-cover">
              <img src={playlist.coverUrl} alt={playlist.name} className="w-full aspect-square object-cover" />
              <div className="absolute bottom-2 right-2">
                <Button size="icon" className="bg-musima-primary text-white hover:bg-musima-primary/90 h-10 w-10 rounded-full shadow-lg">
                  <Play className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <h3 className="font-bold text-lg truncate">{playlist.name}</h3>
            <p className="text-xs text-musima-muted mb-1 line-clamp-2">{playlist.description}</p>
            <div className="flex items-center text-xs text-musima-muted">
              <Clock className="h-3 w-3 mr-1" />
              {playlist.songCount} songs
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
      <RecentlyPlayed />
      <TopPlaylists />
    </div>
  );
};

export default HomePage;
