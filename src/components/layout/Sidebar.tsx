
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Home, ListMusic, Heart, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();
  
  const menuItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Browse', path: '/browse', icon: Search },
    { name: 'Library', path: '/library', icon: Music },
    { name: 'Playlists', path: '/playlists', icon: ListMusic },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
  ];

  const handleNewPlaylist = () => {
    toast({
      title: "Create Playlist",
      description: "New playlist creation modal would appear here",
    });
  };

  return (
    <div 
      className={cn(
        "h-full bg-musima-surface flex flex-col border-r border-white/10 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("p-6", collapsed ? "px-4" : "")}>
        <h1 className={cn("font-bold text-musima-text flex items-center", collapsed ? "text-xl justify-center" : "text-2xl")}>
          <Music className="h-6 w-6 text-musima-primary" />
          {!collapsed && <span className="ml-2">MusiMa</span>}
        </h1>
      </div>
      
      <nav className="mt-6 flex-1">
        <ul className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start font-normal",
                    collapsed ? "px-2 py-2" : "px-3 py-2 h-10",
                    location.pathname === item.path
                      ? "bg-musima-primary/20 text-musima-primary font-medium"
                      : "text-musima-text hover:bg-musima-primary/10"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                  {!collapsed && item.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={cn("p-6 border-t border-white/10", collapsed ? "px-2" : "")}>
        <Button 
          className={cn("flex items-center", collapsed ? "w-full justify-center px-2" : "w-full")} 
          variant="outline"
          onClick={handleNewPlaylist}
        >
          <PlusCircle className="h-4 w-4" />
          {!collapsed && <span className="ml-2">New Playlist</span>}
        </Button>
      </div>

      <Button 
        variant="ghost"
        size="icon"
        className="absolute top-4 -right-4 h-8 w-8 rounded-full border border-white/10 bg-musima-surface text-musima-muted hover:text-musima-text z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Sidebar;
