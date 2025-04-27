
import React from 'react';
import { Button } from '@/components/ui/button';

interface SuccessResetStepProps {
  onNavigateToLogin: () => void;
}

export const SuccessResetStep = ({ onNavigateToLogin }: SuccessResetStepProps) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-sm text-muted-foreground">
        A new password has been sent to your email address. 
        Please use this password to log in, and then change it from your settings.
      </p>
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onNavigateToLogin}
      >
        Return to Login
      </Button>
    </div>
  );
};
