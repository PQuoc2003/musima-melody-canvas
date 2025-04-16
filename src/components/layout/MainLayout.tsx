
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MusicPlayer from './MusicPlayer';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext';

const MainLayout = () => {
  const { theme } = useTheme();
  
  return (
    <MusicPlayerProvider>
      <div className={cn(
        "flex h-screen overflow-hidden",
        theme === 'dark' ? 'bg-background' : 'bg-musima-background-light'
      )}>
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          
          <main className="flex-1 overflow-auto p-6 pb-24">
            <Outlet />
          </main>
          
          <MusicPlayer />
        </div>
      </div>
    </MusicPlayerProvider>
  );
};

export default MainLayout;
