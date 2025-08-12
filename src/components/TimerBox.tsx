import { useTime } from '@/hooks/useTime';
import { Theme } from '@/types/theme';
import { useState, useEffect } from 'react';

interface TimerBoxProps {
  theme: Theme;
}

export const TimerBox = ({ theme }: TimerBoxProps) => {
  const { hours, minutes, seconds, period } = useTime();
  const [prevTime, setPrevTime] = useState({ hours, minutes, seconds });
  const [flippingDigits, setFlippingDigits] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newFlipping = new Set<string>();
    
    if (prevTime.hours !== hours) newFlipping.add('hours');
    if (prevTime.minutes !== minutes) newFlipping.add('minutes');
    if (prevTime.seconds !== seconds) newFlipping.add('seconds');
    
    if (newFlipping.size > 0) {
      setFlippingDigits(newFlipping);
      
      setTimeout(() => {
        setFlippingDigits(new Set());
        setPrevTime({ hours, minutes, seconds });
      }, 300);
    }
  }, [hours, minutes, seconds, prevTime]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'anime':
        return {
          container: 'glass-anime neon-anime pulse-glow-anime',
          text: 'text-anime-text font-anime',
          digit: 'text-6xl md:text-8xl lg:text-9xl font-bold',
          separator: 'text-anime-accent',
          period: 'text-anime-secondary text-lg md:text-xl'
        };
      case 'minimal':
        return {
          container: 'glass-minimal',
          text: 'text-minimal-text',
          digit: 'text-6xl md:text-8xl lg:text-9xl font-light',
          separator: 'text-minimal-accent',
          period: 'text-minimal-text text-lg md:text-xl'
        };
      case 'cyber':
        return {
          container: 'glass-cyber neon-cyber pulse-glow-cyber',
          text: 'text-cyber-text font-cyber',
          digit: 'text-6xl md:text-8xl lg:text-9xl font-bold',
          separator: 'text-cyber-accent',
          period: 'text-cyber-secondary text-lg md:text-xl'
        };
      default:
        return {
          container: '',
          text: '',
          digit: '',
          separator: '',
          period: ''
        };
    }
  };

  const classes = getThemeClasses();

  const renderDigit = (value: string, type: string) => {
    const isFlipping = flippingDigits.has(type);
    
    return (
      <span 
        className={`${classes.digit} inline-block ${isFlipping ? 'digit-flip' : ''} smooth-transition`}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className={`
        ${classes.container} 
        ${classes.text}
        rounded-3xl p-8 md:p-12 lg:p-16
        text-center backdrop-blur-glass
        transform hover:scale-105 smooth-transition
        float-animation
      `}>
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          {renderDigit(hours, 'hours')}
          <span className={`${classes.digit} ${classes.separator}`}>:</span>
          {renderDigit(minutes, 'minutes')}
          <span className={`${classes.digit} ${classes.separator}`}>:</span>
          {renderDigit(seconds, 'seconds')}
        </div>
        
        <div className={`${classes.period} mt-4 opacity-80`}>
          {period}
        </div>
        
        {/* Date Display */}
        <div className={`${classes.text} mt-6 text-sm md:text-base opacity-70`}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};