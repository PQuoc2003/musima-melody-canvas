
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Home, ListMusic, Heart, PlusCircle, Search, ChevronLeft, ChevronRight, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const menuItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Browse', path: '/browse', icon: Search },
    { name: 'Library', path: '/library', icon: Music },
    { name: 'Playlists', path: '/playlists', icon: ListMusic },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNewPlaylist = () => {
    toast({
      title: "Create Playlist",
      description: "New playlist creation modal would appear here",
    });
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={cn(
        "h-full bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("p-6", collapsed ? "px-4" : "")}>
        <h1 className={cn("font-bold text-sidebar-foreground flex items-center", collapsed ? "text-xl justify-center" : "text-2xl")}>
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
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
      
      <div className={cn("p-6 border-t border-sidebar-border", collapsed ? "px-2" : "")}>
        <Button 
          className={cn("flex items-center", collapsed ? "w-full justify-center px-2" : "w-full")} 
          variant="outline"
          onClick={handleNewPlaylist}
        >
          <PlusCircle className="h-4 w-4" />
          {!collapsed && <span className="ml-2">New Playlist</span>}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="mt-4 w-full flex justify-center"
        >
          {theme === 'dark' ? 
            <Sun className="h-4 w-4" /> : 
            <Moon className="h-4 w-4" />
          }
          {!collapsed && <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </Button>
      </div>

      {/* Sidebar toggle button attached to the sidebar */}
      <Button 
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:text-sidebar-accent-foreground z-10"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Sidebar;
