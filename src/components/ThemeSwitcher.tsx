import { useState } from 'react';
import { Theme, THEMES } from '@/types/theme';
import { Button } from '@/components/ui/button';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSwitcher = ({ currentTheme, onThemeChange }: ThemeSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme);
    setIsOpen(false);
    
    // Add glitch effect
    const switcher = document.querySelector('.theme-switcher');
    if (switcher) {
      switcher.classList.add('glitch');
      setTimeout(() => {
        switcher.classList.remove('glitch');
      }, 300);
    }
  };

  const getThemeButtonClass = (theme: Theme) => {
    const baseClass = "w-full justify-start space-x-3 text-left h-14 rounded-xl smooth-transition";
    
    switch (theme) {
      case 'anime':
        return `${baseClass} bg-gradient-to-r from-anime-primary/20 to-anime-secondary/20 hover:from-anime-primary/40 hover:to-anime-secondary/40 border border-anime-primary/30 text-anime-text`;
      case 'minimal':
        return `${baseClass} bg-minimal-surface hover:bg-minimal-border border border-minimal-border text-minimal-text`;
      case 'cyber':
        return `${baseClass} bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 hover:from-cyber-primary/40 hover:to-cyber-secondary/40 border border-cyber-primary/30 text-cyber-text`;
      default:
        return baseClass;
    }
  };

  const getSwitcherButtonClass = () => {
    switch (currentTheme) {
      case 'anime':
        return 'glass-anime neon-anime text-anime-text hover:scale-110';
      case 'minimal':
        return 'glass-minimal text-minimal-text hover:scale-110';
      case 'cyber':
        return 'glass-cyber neon-cyber text-cyber-text hover:scale-110';
      default:
        return '';
    }
  };

  const getPanelClass = () => {
    switch (currentTheme) {
      case 'anime':
        return 'glass-anime border border-anime-primary/30';
      case 'minimal':
        return 'glass-minimal border border-minimal-border';
      case 'cyber':
        return 'glass-cyber border border-cyber-primary/30';
      default:
        return '';
    }
  };

  return (
    <div className="theme-switcher fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      {/* Main Theme Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${getSwitcherButtonClass()}
          w-16 h-16 rounded-full p-0 backdrop-blur-glass
          smooth-transition shadow-lg
        `}
      >
        <span className="text-2xl">
          {THEMES[currentTheme].icon}
        </span>
      </Button>

      {/* Theme Panel */}
      {isOpen && (
        <div className={`
          ${getPanelClass()}
          absolute right-0 top-20 w-72 p-4 rounded-2xl backdrop-blur-glass
          animate-slide-in-right shadow-2xl
        `}>
          <h3 className={`
            text-lg font-semibold mb-4 text-center
            ${currentTheme === 'anime' ? 'text-anime-text' : ''}
            ${currentTheme === 'minimal' ? 'text-minimal-text' : ''}
            ${currentTheme === 'cyber' ? 'text-cyber-text' : ''}
          `}>
            Choose Theme
          </h3>
          
          <div className="space-y-3">
            {Object.entries(THEMES).map(([key, config]) => (
              <Button
                key={key}
                onClick={() => handleThemeSelect(key as Theme)}
                className={getThemeButtonClass(key as Theme)}
                disabled={currentTheme === key}
              >
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <div className="font-semibold">{config.name}</div>
                  <div className="text-xs opacity-70">{config.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};