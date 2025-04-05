
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const TopBar = () => {
  return (
    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-musima-surface/80 backdrop-blur-md sticky top-0 z-10">
      <div className="w-1/3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-musima-muted" />
          <Input 
            placeholder="Search songs, artists, playlists..." 
            className="pl-10 bg-white/5 border-white/10 focus:border-musima-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-musima-muted hover:text-musima-text">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-8 w-8 hover:ring-2 hover:ring-musima-primary cursor-pointer">
          <AvatarFallback className="bg-musima-primary text-white">U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default TopBar;
