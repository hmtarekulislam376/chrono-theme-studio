import { useState, useRef, useEffect } from 'react';
import { Theme } from '@/types/theme';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';

interface MusicPlayerProps {
  theme: Theme;
}

export const MusicPlayer = ({ theme }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // YouTube video ID extracted from https://youtu.be/bP9gMpl1gyQ?si=nvNzj7RFmjF-ltPF
  const videoId = 'bP9gMpl1gyQ';

  const getThemeClasses = () => {
    switch (theme) {
      case 'anime':
        return {
          container: 'glass-anime neon-anime',
          button: 'bg-anime-primary/20 hover:bg-anime-primary/40 text-anime-text border-anime-primary/30',
          text: 'text-anime-text',
          accent: 'text-anime-accent'
        };
      case 'minimal':
        return {
          container: 'glass-minimal',
          button: 'bg-minimal-surface hover:bg-minimal-border text-minimal-text border-minimal-border',
          text: 'text-minimal-text',
          accent: 'text-minimal-accent'
        };
      case 'cyber':
        return {
          container: 'glass-cyber neon-cyber',
          button: 'bg-cyber-primary/20 hover:bg-cyber-primary/40 text-cyber-text border-cyber-primary/30',
          text: 'text-cyber-text',
          accent: 'text-cyber-accent'
        };
      default:
        return {
          container: '',
          button: '',
          text: 'text-white',
          accent: 'text-gray-300'
        };
    }
  };

  const classes = getThemeClasses();

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (iframeRef.current) {
      // Post message to YouTube iframe to control playback
      const action = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"${action}","args":""}`,
        '*'
      );
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current) {
      const action = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"${action}","args":""}`,
        '*'
      );
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"setVolume","args":"${newVolume}"}`,
        '*'
      );
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Minimized Player */}
      {isMinimized && (
        <div className={`
          ${classes.container} 
          rounded-full p-4 backdrop-blur-glass
          transform hover:scale-110 smooth-transition
          shadow-lg border border-white/10
        `}>
          <Button
            onClick={() => setIsMinimized(false)}
            className={`${classes.button} w-12 h-12 rounded-full p-0 border`}
          >
            <span className="text-xl">🎵</span>
          </Button>
        </div>
      )}

      {/* Expanded Player */}
      {!isMinimized && (
        <div className={`
          ${classes.container}
          rounded-2xl p-4 backdrop-blur-glass
          shadow-2xl border border-white/10
          animate-slide-in-left w-80
        `}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${classes.text} font-semibold text-sm`}>
              Music Player
            </h3>
            <Button
              onClick={() => setIsMinimized(true)}
              className={`${classes.button} w-8 h-8 rounded-lg p-0 border`}
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
          </div>

          {/* YouTube Player (Hidden) */}
          <div className="hidden">
            <iframe
              ref={iframeRef}
              width="320"
              height="180"
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=${videoId}`}
              title="YouTube Music Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Track Info */}
          <div className={`${classes.text} text-xs mb-3 opacity-80`}>
            Now Playing: Lofi Hip Hop Music
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-3">
            <Button
              onClick={togglePlay}
              className={`${classes.button} w-10 h-10 rounded-lg p-0 border`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <div className="flex items-center space-x-2 flex-1 mx-3">
              <Button
                onClick={toggleMute}
                className={`${classes.button} w-8 h-8 rounded-lg p-0 border`}
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </Button>
              
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer bg-white/20`}
                style={{
                  background: `linear-gradient(to right, currentColor 0%, currentColor ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              
              <span className={`${classes.accent} text-xs w-8`}>
                {volume}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-current opacity-60 rounded-full smooth-transition`}
              style={{ width: isPlaying ? '100%' : '0%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};