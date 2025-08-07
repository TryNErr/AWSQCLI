import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export interface SettingsData {
  // Account Settings
  displayName: string;
  email: string;
  grade: string;
  preferredSubjects: string[];
  
  // Learning Preferences
  // Timed Test Settings
  timedTestQuestionCount: number;
  timedTestTimeLimit: number; // in minutes
  timedTestAutoSubmit: boolean;
  defaultDifficulty: string;
  questionsPerSession: number;
  autoAdvance: boolean;
  showExplanations: boolean;
  showHints: boolean;
  practiceMode: string;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyReminders: boolean;
  weeklyProgress: boolean;
  achievementAlerts: boolean;
  reminderTime: string;
  
  // Appearance
  theme: string;
  fontSize: string;
  colorScheme: string;
  animations: boolean;
  
  // Accessibility
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  
  // Audio
  soundEffects: boolean;
  backgroundMusic: boolean;
  volume: number;
  
  // Privacy & Security
  profileVisibility: string;
  dataSharing: boolean;
  analyticsOptIn: boolean;
  
  // Performance
  autoSave: boolean;
  offlineMode: boolean;
  dataUsage: string;
}

interface SettingsContextType {
  settings: SettingsData;
  updateSetting: (key: keyof SettingsData, value: any) => void;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  resetSettings: () => void;
  saveSettings: () => Promise<void>;
  playSound: (soundType: string) => void;
}

const defaultSettings: SettingsData = {
  // Account Settings
  displayName: 'Test User',
  email: 'demo@testace.com',
  grade: '5',
  preferredSubjects: ['Math', 'English'],
  
  // Learning Preferences
  // Timed Test Settings
  timedTestQuestionCount: 30,
  timedTestTimeLimit: 30,
  timedTestAutoSubmit: true,
  defaultDifficulty: 'medium',
  questionsPerSession: 10,
  autoAdvance: false,
  showExplanations: true,
  showHints: true,
  practiceMode: 'mixed',
  
  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  dailyReminders: true,
  weeklyProgress: true,
  achievementAlerts: true,
  reminderTime: '18:00',
  
  // Appearance
  theme: 'light',
  fontSize: 'medium',
  colorScheme: 'blue',
  animations: true,
  
  // Accessibility
  highContrast: false,
  screenReader: false,
  keyboardNavigation: false,
  reducedMotion: false,
  
  // Audio
  soundEffects: true,
  backgroundMusic: false,
  volume: 70,
  
  // Privacy & Security
  profileVisibility: 'friends',
  dataSharing: true,
  analyticsOptIn: true,
  
  // Performance
  autoSave: true,
  offlineMode: false,
  dataUsage: 'standard'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Color scheme mappings
const colorSchemes = {
  blue: { primary: '#1976d2', secondary: '#dc004e' },
  green: { primary: '#388e3c', secondary: '#f57c00' },
  purple: { primary: '#7b1fa2', secondary: '#303f9f' },
  orange: { primary: '#f57c00', secondary: '#388e3c' },
  red: { primary: '#d32f2f', secondary: '#1976d2' },
  teal: { primary: '#00796b', secondary: '#7b1fa2' }
};

// Font size mappings
const fontSizes = {
  small: { fontSize: 12, h1: 1.8, h2: 1.6, h3: 1.4, h4: 1.2, h5: 1.1, h6: 1.0 },
  medium: { fontSize: 14, h1: 2.0, h2: 1.8, h3: 1.6, h4: 1.4, h5: 1.2, h6: 1.1 },
  large: { fontSize: 16, h1: 2.2, h2: 2.0, h3: 1.8, h4: 1.6, h5: 1.4, h6: 1.2 },
  'extra-large': { fontSize: 18, h1: 2.4, h2: 2.2, h3: 2.0, h4: 1.8, h5: 1.6, h6: 1.4 }
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('testace-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply high contrast
    if (settings.highContrast) {
      root.style.setProperty('--high-contrast', '1');
      document.body.classList.add('high-contrast');
    } else {
      root.style.setProperty('--high-contrast', '0');
      document.body.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // Apply animations setting
    if (!settings.animations) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }, [settings.highContrast, settings.reducedMotion, settings.animations]);

  // Create dynamic theme based on settings
  const createDynamicTheme = () => {
    const isDark = settings.theme === 'dark' || 
      (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const colors = colorSchemes[settings.colorScheme as keyof typeof colorSchemes] || colorSchemes.blue;
    const fontConfig = fontSizes[settings.fontSize as keyof typeof fontSizes] || fontSizes.medium;

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: colors.primary,
        },
        secondary: {
          main: colors.secondary,
        },
        ...(settings.highContrast && {
          background: {
            default: isDark ? '#000000' : '#ffffff',
            paper: isDark ? '#111111' : '#f5f5f5',
          },
          text: {
            primary: isDark ? '#ffffff' : '#000000',
            secondary: isDark ? '#cccccc' : '#333333',
          }
        })
      },
      typography: {
        fontSize: fontConfig.fontSize,
        h1: { fontSize: `${fontConfig.h1}rem` },
        h2: { fontSize: `${fontConfig.h2}rem` },
        h3: { fontSize: `${fontConfig.h3}rem` },
        h4: { fontSize: `${fontConfig.h4}rem` },
        h5: { fontSize: `${fontConfig.h5}rem` },
        h6: { fontSize: `${fontConfig.h6}rem` },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              ...(settings.reducedMotion && {
                '*, *::before, *::after': {
                  animationDuration: '0.01ms !important',
                  animationIterationCount: '1 !important',
                  transitionDuration: '0.01ms !important',
                }
              }),
              ...(!settings.animations && {
                '*, *::before, *::after': {
                  animationDuration: '0s !important',
                  transitionDuration: '0s !important',
                }
              })
            }
          }
        }
      }
    });
  };

  const updateSetting = (key: keyof SettingsData, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Auto-save if enabled
      if (prev.autoSave) {
        localStorage.setItem('testace-settings', JSON.stringify(newSettings));
      }
      
      return newSettings;
    });

    // Play sound effect if enabled
    if (settings.soundEffects) {
      playSound('setting-change');
    }
  };

  const updateSettings = (newSettings: Partial<SettingsData>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Auto-save if enabled
      if (prev.autoSave) {
        localStorage.setItem('testace-settings', JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('testace-settings', JSON.stringify(defaultSettings));
    
    if (settings.soundEffects) {
      playSound('reset');
    }
  };

  const saveSettings = async () => {
    try {
      localStorage.setItem('testace-settings', JSON.stringify(settings));
      
      if (settings.soundEffects) {
        playSound('save');
      }
      
      // Here you could also save to a backend API
      // await api.saveUserSettings(settings);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  };

  const playSound = (soundType: string) => {
    if (!settings.soundEffects) return;
    
    try {
      const audio = new Audio();
      const volume = settings.volume / 100;
      
      switch (soundType) {
        case 'setting-change':
          // Create a simple beep sound
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(context.destination);
          
          oscillator.frequency.setValueAtTime(800, context.currentTime);
          gainNode.gain.setValueAtTime(volume * 0.1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
          
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.1);
          break;
          
        case 'save':
          // Success sound
          const saveContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const saveOsc = saveContext.createOscillator();
          const saveGain = saveContext.createGain();
          
          saveOsc.connect(saveGain);
          saveGain.connect(saveContext.destination);
          
          saveOsc.frequency.setValueAtTime(600, saveContext.currentTime);
          saveOsc.frequency.setValueAtTime(800, saveContext.currentTime + 0.1);
          saveGain.gain.setValueAtTime(volume * 0.1, saveContext.currentTime);
          saveGain.gain.exponentialRampToValueAtTime(0.01, saveContext.currentTime + 0.2);
          
          saveOsc.start(saveContext.currentTime);
          saveOsc.stop(saveContext.currentTime + 0.2);
          break;
          
        case 'reset':
          // Reset sound
          const resetContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const resetOsc = resetContext.createOscillator();
          const resetGain = resetContext.createGain();
          
          resetOsc.connect(resetGain);
          resetGain.connect(resetContext.destination);
          
          resetOsc.frequency.setValueAtTime(400, resetContext.currentTime);
          resetGain.gain.setValueAtTime(volume * 0.1, resetContext.currentTime);
          resetGain.gain.exponentialRampToValueAtTime(0.01, resetContext.currentTime + 0.3);
          
          resetOsc.start(resetContext.currentTime);
          resetOsc.stop(resetContext.currentTime + 0.3);
          break;
      }
    } catch (error) {
      // Silently fail if audio context is not available
      console.debug('Audio not available:', error);
    }
  };

  const theme = createDynamicTheme();

  const contextValue: SettingsContextType = {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    saveSettings,
    playSound
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      <ThemeProvider theme={theme} key={`${settings.theme}-${settings.colorScheme}-${settings.fontSize}-${settings.highContrast}`}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
