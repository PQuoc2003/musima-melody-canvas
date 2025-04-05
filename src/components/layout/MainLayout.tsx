
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MusicPlayer from './MusicPlayer';
import { ThemeProvider } from '@/hooks/use-theme';

const MainLayout = () => {
  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-musima-background">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          
          <main className="flex-1 overflow-auto p-6 pb-24">
            <Outlet />
          </main>
          
          <MusicPlayer />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
