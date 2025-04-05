
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Home, ListMusic, Heart, PlusCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Browse', path: '/browse', icon: Search },
    { name: 'Library', path: '/library', icon: Music },
    { name: 'Playlists', path: '/playlists', icon: ListMusic },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
  ];

  return (
    <div className="h-full w-64 bg-musima-surface flex flex-col border-r border-white/10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-musima-text flex items-center">
          <Music className="h-6 w-6 mr-2 text-musima-primary" />
          MusiMa
        </h1>
      </div>
      
      <nav className="mt-6 flex-1">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal px-3 py-2 h-10",
                    location.pathname === item.path
                      ? "bg-musima-primary/20 text-musima-primary font-medium"
                      : "text-musima-text hover:bg-musima-primary/10"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-6 border-t border-white/10">
        <Button className="w-full flex items-center" variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" /> New Playlist
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
