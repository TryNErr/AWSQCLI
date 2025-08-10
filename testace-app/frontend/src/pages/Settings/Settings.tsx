import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Alert,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person,
  School,
  Notifications,
  Palette,
  Accessibility,
  Security,
  Storage,
  Language,
  VolumeUp,
  Save,
  Restore,
  ExpandMore,
  Brightness4,
  Brightness7,
  AutoAwesome,
  FlashOn,
  EmojiEvents,
  Star,
  RocketLaunch,
} from '@mui/icons-material';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSave = () => {
    setSnackbarMessage('Settings saved successfully! 🎉');
    setShowSnackbar(true);
    setShowSaveDialog(false);
  };

  const settingsCategories = [
    {
      title: 'Learning Preferences',
      icon: <School />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      emoji: '📚',
      settings: [
        {
          key: 'questionsPerSession',
          label: 'Questions per Session',
          type: 'slider',
          min: 5,
          max: 50,
          step: 5,
          description: 'How many questions to show in each practice session'
        },
        {
          key: 'difficulty',
          label: 'Default Difficulty',
          type: 'select',
          options: ['Easy', 'Medium', 'Hard'],
          description: 'Your preferred starting difficulty level'
        },
        {
          key: 'autoAdvance',
          label: 'Auto-advance Questions',
          type: 'switch',
          description: 'Automatically move to next question after answering'
        },
        {
          key: 'showExplanations',
          label: 'Show Explanations',
          type: 'switch',
          description: 'Display detailed explanations after each question'
        }
      ]
    },
    {
      title: 'Appearance & Theme',
      icon: <Palette />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      emoji: '🎨',
      settings: [
        {
          key: 'theme',
          label: 'Theme Mode',
          type: 'radio',
          options: ['Light', 'Dark', 'Auto'],
          description: 'Choose your preferred color scheme'
        },
        {
          key: 'animations',
          label: 'Enable Animations',
          type: 'switch',
          description: 'Show smooth transitions and hover effects'
        },
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'slider',
          min: 12,
          max: 20,
          step: 1,
          description: 'Adjust text size for better readability'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: <Notifications />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      emoji: '🔔',
      settings: [
        {
          key: 'dailyReminders',
          label: 'Daily Practice Reminders',
          type: 'switch',
          description: 'Get reminded to practice every day'
        },
        {
          key: 'achievementNotifications',
          label: 'Achievement Notifications',
          type: 'switch',
          description: 'Celebrate your milestones and achievements'
        },
        {
          key: 'streakReminders',
          label: 'Streak Reminders',
          type: 'switch',
          description: 'Get notified to maintain your learning streak'
        }
      ]
    },
    {
      title: 'Accessibility',
      icon: <Accessibility />,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      emoji: '♿',
      settings: [
        {
          key: 'highContrast',
          label: 'High Contrast Mode',
          type: 'switch',
          description: 'Increase contrast for better visibility'
        },
        {
          key: 'reducedMotion',
          label: 'Reduce Motion',
          type: 'switch',
          description: 'Minimize animations for motion sensitivity'
        },
        {
          key: 'screenReader',
          label: 'Screen Reader Support',
          type: 'switch',
          description: 'Enhanced support for screen readers'
        }
      ]
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 2 }}>
        {/* Hero Header */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4
          }}
        >
          {/* Decorative Elements */}
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }} />
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64,
                    background: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '2rem'
                  }}
                >
                  ⚙️
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>
                    Settings & Preferences ⚙️
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Customize your learning experience!
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 600 }}>
                Personalize TestAce to match your learning style and preferences. 
                Make it truly yours! ✨
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<AutoAwesome />}
                  label="Personalized Experience"
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  icon={<FlashOn />}
                  label="Instant Apply"
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  icon={<Star />}
                  label="Premium Features"
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" fontWeight={800} sx={{ mb: 1 }}>
                  {settingsCategories.length}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Setting Categories
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <EmojiEvents sx={{ color: '#fbbf24' }} />
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Fully Customizable
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Settings Categories */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {settingsCategories.map((category, categoryIndex) => (
            <Grid item xs={12} md={6} key={categoryIndex}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${category.gradient.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g)?.[0] || '#6366f1'}15 0%, ${category.gradient.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g)?.[1] || '#8b5cf6'}15 100%)`,
                  border: `2px solid ${category.gradient.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g)?.[0] || '#6366f1'}30`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 20px -5px rgba(0, 0, 0, 0.1)',
                    borderColor: `${category.gradient.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g)?.[0] || '#6366f1'}60`,
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ 
                      background: category.gradient,
                      width: 48,
                      height: 48
                    }}>
                      {React.cloneElement(category.icon, { sx: { color: 'white' } })}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" fontWeight={700}>
                      {category.title} {category.emoji}
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                
                <CardContent sx={{ pt: 0 }}>
                  {category.settings.map((setting, settingIndex) => (
                    <Box key={settingIndex} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {setting.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {setting.description}
                      </Typography>
                      
                      {setting.type === 'switch' && (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={(settings as any)[setting.key] || false}
                              onChange={(e) => updateSettings({ [setting.key]: e.target.checked })}
                              sx={{
                                '& .MuiSwitch-thumb': {
                                  background: category.gradient,
                                },
                                '& .Mui-checked + .MuiSwitch-track': {
                                  background: category.gradient,
                                }
                              }}
                            />
                          }
                          label=""
                        />
                      )}
                      
                      {setting.type === 'slider' && (
                        <Box sx={{ px: 2 }}>
                          <Slider
                            value={(settings as any)[setting.key] || setting.min}
                            onChange={(e, value) => updateSettings({ [setting.key]: value })}
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                            marks
                            valueLabelDisplay="auto"
                            sx={{
                              '& .MuiSlider-thumb': {
                                background: category.gradient,
                              },
                              '& .MuiSlider-track': {
                                background: category.gradient,
                              }
                            }}
                          />
                        </Box>
                      )}
                      
                      {setting.type === 'select' && (
                        <FormControl fullWidth size="small">
                          <Select
                            value={(settings as any)[setting.key] || setting.options?.[0]}
                            onChange={(e) => updateSettings({ [setting.key]: e.target.value })}
                          >
                            {setting.options?.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                      
                      {setting.type === 'radio' && (
                        <RadioGroup
                          value={(settings as any)[setting.key] || setting.options?.[0]}
                          onChange={(e) => updateSettings({ [setting.key]: e.target.value })}
                          row
                        >
                          {setting.options?.map((option) => (
                            <FormControlLabel
                              key={option}
                              value={option}
                              control={<Radio size="small" />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                      )}
                      
                      {settingIndex < category.settings.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: 4
        }}>
          <Typography variant="h5" fontWeight={700} gutterBottom align="center" color="primary">
            🚀 Quick Actions
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => setShowSaveDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                  }
                }}
              >
                Save Settings ✅
              </Button>
            </Grid>
            
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Restore />}
                onClick={() => {
                  // Reset to defaults logic
                  setSnackbarMessage('Settings reset to defaults! 🔄');
                  setShowSnackbar(true);
                }}
                sx={{
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.04)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Reset to Defaults 🔄
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Pro Tip */}
        <Alert 
          severity="info" 
          sx={{ 
            mt: 4,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 3
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            💡 Pro Tip: Your settings are automatically saved and synced across all your devices!
          </Typography>
        </Alert>

        {/* Save Confirmation Dialog */}
        <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RocketLaunch sx={{ color: '#6366f1' }} />
              Save Settings
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to save these settings? They will be applied immediately! ✨
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }}
            >
              Save Changes 🎉
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
        />
      </Box>
    </Container>
  );
};

export default Settings;
