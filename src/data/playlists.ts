
// Sample playlists data
export const playlists = [
  { 
    id: "1", 
    name: "Chill Vibes", 
    description: "Relaxing tunes for your downtime",
    songs: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `Chill Song ${i + 1}`,
      artist: `Artist ${Math.floor(i / 3) + 1}`,
      album: `Album ${Math.floor(i / 4) + 1}`,
      duration: Math.floor(Math.random() * 300) + 120,
      liked: Math.random() > 0.7,
      songUrl: "https://docs.google.com/uc?export=open&id=1V-c_WmanMA9i6vi4lI-tOWXtf2AH_L1r" // Sample song URL (using a sample audio file)
    })),
    coverUrl: "https://via.placeholder.com/300",
    createdAt: "2023-04-15"
  },
  { 
    id: "2", 
    name: "Workout Mix", 
    description: "High energy beats to power your workout",
    songs: Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Workout Song ${i + 1}`,
      artist: `Artist ${Math.floor(i / 3) + 1}`,
      album: `Album ${Math.floor(i / 4) + 1}`,
      duration: Math.floor(Math.random() * 300) + 120,
      liked: Math.random() > 0.7,
      songUrl: "https://docs.google.com/uc?export=open&id=1V-c_WmanMA9i6vi4lI-tOWXtf2AH_L1r" // Sample song URL
    })),
    coverUrl: "https://via.placeholder.com/300",
    createdAt: "2023-06-22"
  },
];

export type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  liked: boolean;
  songUrl: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverUrl: string;
  createdAt: string;
};
