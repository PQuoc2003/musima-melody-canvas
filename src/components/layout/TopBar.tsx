
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="border-b h-16 flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">MusiMa</h1>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated && user ? (
          <>
            <span>Welcome, {user.username}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>Register</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
