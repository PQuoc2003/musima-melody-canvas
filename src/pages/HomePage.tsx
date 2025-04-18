
import React from 'react';
import { Play, Clock, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { useMusicPlayer, Song } from '@/contexts/MusicPlayerContext';

// Sample data
const recentlyPlayed: Song[] = [
  { id: 1, title: "Starlight Melody", artist: "Cosmic Dreamers", coverUrl: "https://via.placeholder.com/120", songUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" },
  { id: 2, title: "Ocean Waves", artist: "Nature Sounds", coverUrl: "https://via.placeholder.com/120", songUrl: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" },
  { id: 3, title: "Urban Rhythm", artist: "City Beats", coverUrl: "https://via.placeholder.com/120", songUrl: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3" },
  { id: 4, title: "Mountain Echo", artist: "Highland Band", coverUrl: "https://via.placeholder.com/120", songUrl: "https://assets.mixkit.co/music/preview/mixkit-classical-strings-chamber-quartet-518.mp3" },
  { id: 5, title: "Electric Dreams", artist: "Synth Masters", coverUrl: "https://via.placeholder.com/120", songUrl: "https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3" },
];

const topPlaylists = [
  { id: 1, name: "Chill Vibes", description: "Relaxing tunes for your downtime", coverUrl: "https://via.placeholder.com/160", songCount: 25 },
  { id: 2, name: "Workout Mix", description: "High energy beats to power your workout", coverUrl: "https://via.placeholder.com/160", songCount: 18 },
  { id: 3, name: "Focus & Study", description: "Concentration boosting instrumentals", coverUrl: "https://via.placeholder.com/160", songCount: 32 },
  { id: 4, name: "Road Trip", description: "The perfect soundtrack for the open road", coverUrl: "https://via.placeholder.com/160", songCount: 40 },
];

const featuredArtists = [
  { id: 1, name: "Electronic Pulse", imageUrl: "https://via.placeholder.com/200", genre: "Electronic" },
  { id: 2, name: "Acoustic Journey", imageUrl: "https://via.placeholder.com/200", genre: "Acoustic" },
  { id: 3, name: "Jazz Ensemble", imageUrl: "https://via.placeholder.com/200", genre: "Jazz" },
];

const HomePage = () => {
  const { theme } = useTheme();
  const { playSong } = useMusicPlayer();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Function to handle playing a song
  const handlePlaySong = (song: Song) => {
    playSong(song);
  };

  // Function to navigate to playlist details
  const handlePlaylistClick = (playlistId: number) => {
    navigate(`/playlist/${playlistId}`);
  };

  // Recently played songs row
  const RecentlyPlayed = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-800")}>Recently Played</h2>
        <Button variant="ghost" size="sm" className="text-musima-muted hover:text-musima-primary">
          See All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentlyPlayed.map((song) => (
          <div key={song.id} className="group relative">
            <div className="relative overflow-hidden rounded-md album-cover">
              <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-white bg-musima-primary/90 hover:bg-musima-primary"
                  onClick={() => handlePlaySong(song)}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <h3 className={cn("mt-2 text-sm font-medium truncate", isDark ? "text-white" : "text-gray-800")}>{song.title}</h3>
            <p className="text-xs text-musima-muted truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Top playlists section
  const TopPlaylists = () => (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-800")}>Your Playlists</h2>
        <Link to="/playlists">
          <Button variant="ghost" size="sm" className="text-musima-muted hover:text-musima-primary">
            See All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topPlaylists.map((playlist) => (
          <Card 
            key={playlist.id} 
            className={cn(
              "border-white/5 hover:border-white/20 transition-colors cursor-pointer",
              isDark 
                ? "bg-musima-surface text-white" 
                : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handlePlaylistClick(playlist.id)}
          >
            <CardContent className="p-4">
              <div className="relative overflow-hidden rounded-md mb-3 album-cover">
                <img src={playlist.coverUrl} alt={playlist.name} className="w-full aspect-square object-cover" />
                <div className="absolute bottom-2 right-2">
                  <Button 
                    size="icon" 
                    className="bg-musima-primary text-white hover:bg-musima-primary/90 h-10 w-10 rounded-full shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handlePlaylistClick(playlist.id);
                    }}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <h3 className={cn("font-bold text-lg truncate", isDark ? "text-white" : "text-gray-800")}>{playlist.name}</h3>
              <p className={cn("text-xs mb-1 line-clamp-2", isDark ? "text-gray-300" : "text-gray-600")}>{playlist.description}</p>
              <div className={cn("flex items-center text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                <Clock className="h-3 w-3 mr-1" />
                {playlist.songCount} songs
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Featured Artists section
  const FeaturedArtists = () => (
    <div className="mt-10">
      <h2 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-800")}>Featured Artists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuredArtists.map((artist) => (
          <div 
            key={artist.id} 
            className={cn(
              "flex items-center p-4 rounded-lg transition-colors",
              isDark 
                ? "bg-musima-surface/60 hover:bg-musima-surface text-white" 
                : "bg-gray-100/60 hover:bg-gray-100 text-gray-800"
            )}
          >
            <img 
              src={artist.imageUrl} 
              alt={artist.name} 
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="font-bold">{artist.name}</h3>
              <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>{artist.genre}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-musima-muted hover:text-musima-primary">
              <Star className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-800")}>Welcome Back</h1>
      </div>
      
      <RecentlyPlayed />
      <Separator className={cn("my-8", isDark ? "bg-white/5" : "bg-gray-200")} />
      <TopPlaylists />
      <Separator className={cn("my-8", isDark ? "bg-white/5" : "bg-gray-200")} />
      <FeaturedArtists />
    </div>
  );
};

export default HomePage;
