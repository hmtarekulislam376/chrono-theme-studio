// Import the background images
import animeBg1 from '@/assets/anime-bg-1.jpg';
import animeBg2 from '@/assets/anime-bg-2.jpg';
import cyberBg1 from '@/assets/cyber-bg-1.jpg';
import cyberBg2 from '@/assets/cyber-bg-2.jpg';

export type Theme = 'anime' | 'minimal' | 'cyber';

export interface ThemeConfig {
  name: string;
  backgrounds: string[];
  description: string;
  icon: string;
}

export const THEMES: Record<Theme, ThemeConfig> = {
  anime: {
    name: 'Anime Vibe',
    backgrounds: [animeBg1, animeBg2],
    description: 'Dreamy anime aesthetics with soft pastels',
    icon: '🌸'
  },
  minimal: {
    name: 'Minimalist Dark',
    backgrounds: [],
    description: 'Clean and focused dark theme',
    icon: '⚫'
  },
  cyber: {
    name: 'Cyber Neon',
    backgrounds: [cyberBg1, cyberBg2],
    description: 'Futuristic cyberpunk with neon glows',
    icon: '🌆'
  }
};