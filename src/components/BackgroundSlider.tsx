import { useState, useEffect } from 'react';
import { Theme, THEMES } from '@/types/theme';

interface BackgroundSliderProps {
  theme: Theme;
}

export const BackgroundSlider = ({ theme }: BackgroundSliderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const backgrounds = THEMES[theme].backgrounds;

  useEffect(() => {
    if (backgrounds.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgrounds.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  if (theme === 'minimal') {
    return <div className="fixed inset-0 bg-minimal-bg" />;
  }

  if (backgrounds.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Images */}
      {backgrounds.map((bg, index) => (
        <div
          key={bg}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex && !isTransitioning
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ))}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Theme-specific Effects */}
      {theme === 'anime' && <AnimeParticles />}
      {theme === 'cyber' && <CyberGrid />}
    </div>
  );
};

const AnimeParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle-anime"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
};

const CyberGrid = () => {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};