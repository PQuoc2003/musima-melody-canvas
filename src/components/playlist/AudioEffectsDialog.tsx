
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

interface AudioEffectsDialogProps {
  bassBoost: number;
  setBassBoost: (value: number) => void;
  trebleBoost: number;
  setTrebleBoost: (value: number) => void;
  onApply: () => void;
  onClose: () => void;
}

export const AudioEffectsDialog: React.FC<AudioEffectsDialogProps> = ({
  bassBoost,
  setBassBoost,
  trebleBoost,
  setTrebleBoost,
  onApply,
  onClose
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <DialogContent className={cn(
      "sm:max-w-[425px]", 
      isDark ? "bg-musima-surface text-white border-white/10" : "bg-white text-gray-800 border-gray-200"
    )}>
      <DialogHeader>
        <DialogTitle>Audio Effects</DialogTitle>
      </DialogHeader>
      <div className="py-4 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={cn(isDark ? "text-gray-200" : "text-gray-700")}>Bass Boost</span>
            <span className={cn(isDark ? "text-gray-300" : "text-gray-600")}>{bassBoost > 0 ? '+' : ''}{bassBoost}</span>
          </div>
          <Slider
            value={[bassBoost]}
            min={-10}
            max={10}
            step={1}
            onValueChange={([val]) => setBassBoost(val)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={cn(isDark ? "text-gray-200" : "text-gray-700")}>Treble Boost</span>
            <span className={cn(isDark ? "text-gray-300" : "text-gray-600")}>{trebleBoost > 0 ? '+' : ''}{trebleBoost}</span>
          </div>
          <Slider
            value={[trebleBoost]}
            min={-10}
            max={10}
            step={1}
            onValueChange={([val]) => setTrebleBoost(val)}
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              setBassBoost(0);
              setTrebleBoost(0);
            }}
          >
            Reset
          </Button>
          <Button 
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
