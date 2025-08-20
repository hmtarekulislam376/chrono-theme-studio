import { useTheme } from '@/hooks/useTheme';
import { BackgroundSlider } from '@/components/BackgroundSlider';
import { TimerBox } from '@/components/TimerBox';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { MusicPlayer } from '@/components/MusicPlayer';

const Index = () => {
  const { currentTheme, switchTheme } = useTheme();

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Dynamic Background */}
      <BackgroundSlider theme={currentTheme} />
      
      {/* Timer Display */}
      <TimerBox theme={currentTheme} />
      
      {/* Theme Switcher */}
      <ThemeSwitcher 
        currentTheme={currentTheme} 
        onThemeChange={switchTheme} 
      />
      
      {/* Music Player */}
      <MusicPlayer theme={currentTheme} />
    </div>
  );
};

export default Index;
