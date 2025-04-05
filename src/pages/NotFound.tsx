
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-musima-background text-musima-text p-6">
      <Music className="h-24 w-24 text-musima-primary mb-6 animate-pulse-gentle" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-musima-muted mb-8 text-center max-w-md">
        Oops! The melody you're looking for seems to have gone off-beat.
      </p>
      <Link to="/">
        <Button className="gap-2">
          <Home className="h-4 w-4" />
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
