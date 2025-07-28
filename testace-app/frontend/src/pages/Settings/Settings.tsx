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
  Badge
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
  NotificationsActive,
  NotificationsOff,
  VolumeOff
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings, SettingsData } from '../../contexts/SettingsContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSetting, updateSettings, resetSettings, saveSettings } = useSettings();
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const availableSubjects = ['Math', 'English', 'Science', 'Social Studies', 'Thinking Skills', 'Mathematical Reasoning'];
  const colorSchemes = ['blue', 'green', 'purple', 'orange', 'red', 'teal'];

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    updateSetting(key, value);
  };

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = settings.preferredSubjects;
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject];
    
    updateSetting('preferredSubjects', newSubjects);
  };

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    try {
      await saveSettings();
      setSaveStatus('saved');
      setSnackbarMessage('Settings saved successfully!');
      setSnackbarOpen(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setSnackbarMessage('Error saving settings. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleResetSettings = () => {
    resetSettings();
    setShowResetDialog(false);
    setSnackbarMessage('Settings reset to defaults');
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <SettingsIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Settings
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Account Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={<Person />}
                title="Account Settings"
                subheader="Manage your account information"
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Display Name"
                    value={settings.displayName}
                    onChange={(e) => handleSettingChange('displayName', e.target.value)}
                    fullWidth
                  />
                  
                  <TextField
                    label="Email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    fullWidth
                    type="email"
                  />
                  
                  <FormControl fullWidth>
                    <InputLabel>Grade Level</InputLabel>
                    <Select
                      value={settings.grade}
                      label="Grade Level"
                      onChange={(e) => handleSettingChange('grade', e.target.value)}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                        <MenuItem key={grade} value={grade.toString()}>
                          Grade {grade}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Preferred Subjects
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {availableSubjects.map(subject => (
                        <Chip
                          key={subject}
                          label={subject}
                          onClick={() => handleSubjectToggle(subject)}
                          color={settings.preferredSubjects.includes(subject) ? 'primary' : 'default'}
                          variant={settings.preferredSubjects.includes(subject) ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Learning Preferences */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={<School />}
                title="Learning Preferences"
                subheader="Customize your learning experience"
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Default Difficulty</InputLabel>
                    <Select
                      value={settings.defaultDifficulty}
                      label="Default Difficulty"
                      onChange={(e) => handleSettingChange('defaultDifficulty', e.target.value)}
                    >
                      <MenuItem value="easy">Easy</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="hard">Hard</MenuItem>
                      <MenuItem value="adaptive">Adaptive</MenuItem>
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Questions per Session: {settings.questionsPerSession}
                    </Typography>
                    <Slider
                      value={settings.questionsPerSession}
                      onChange={(_, value) => handleSettingChange('questionsPerSession', value)}
                      min={5}
                      max={50}
                      step={5}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>

                  <FormControl component="fieldset">
                    <FormLabel component="legend">Practice Mode</FormLabel>
                    <RadioGroup
                      value={settings.practiceMode}
                      onChange={(e) => handleSettingChange('practiceMode', e.target.value)}
                    >
                      <FormControlLabel value="mixed" control={<Radio />} label="Mixed Topics" />
                      <FormControlLabel value="focused" control={<Radio />} label="Focused Practice" />
                      <FormControlLabel value="weak-areas" control={<Radio />} label="Weak Areas Only" />
                    </RadioGroup>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoAdvance}
                        onChange={(e) => handleSettingChange('autoAdvance', e.target.checked)}
                      />
                    }
                    label="Auto-advance to next question"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showExplanations}
                        onChange={(e) => handleSettingChange('showExplanations', e.target.checked)}
                      />
                    }
                    label="Show explanations after answers"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showHints}
                        onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                      />
                    }
                    label="Enable hints for difficult questions"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={
                  <Badge color="secondary" variant="dot" invisible={!settings.emailNotifications && !settings.pushNotifications}>
                    <Notifications />
                  </Badge>
                }
                title="Notifications"
                subheader="Manage your notification preferences"
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        icon={<NotificationsOff />}
                        checkedIcon={<NotificationsActive />}
                      />
                    }
                    label="Email Notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label="Push Notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dailyReminders}
                        onChange={(e) => handleSettingChange('dailyReminders', e.target.checked)}
                      />
                    }
                    label="Daily Practice Reminders"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.weeklyProgress}
                        onChange={(e) => handleSettingChange('weeklyProgress', e.target.checked)}
                      />
                    }
                    label="Weekly Progress Reports"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.achievementAlerts}
                        onChange={(e) => handleSettingChange('achievementAlerts', e.target.checked)}
                      />
                    }
                    label="Achievement Alerts"
                  />

                  <TextField
                    label="Daily Reminder Time"
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={!settings.dailyReminders}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Appearance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={<Palette />}
                title="Appearance"
                subheader="Customize the look and feel"
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={settings.theme}
                      label="Theme"
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                    >
                      <MenuItem value="light">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Brightness7 fontSize="small" />
                          Light
                        </Box>
                      </MenuItem>
                      <MenuItem value="dark">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Brightness4 fontSize="small" />
                          Dark
                        </Box>
                      </MenuItem>
                      <MenuItem value="auto">Auto (System)</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Font Size</InputLabel>
                    <Select
                      value={settings.fontSize}
                      label="Font Size"
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    >
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                      <MenuItem value="extra-large">Extra Large</MenuItem>
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Color Scheme
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {colorSchemes.map(color => (
                        <Chip
                          key={color}
                          label={color.charAt(0).toUpperCase() + color.slice(1)}
                          onClick={() => handleSettingChange('colorScheme', color)}
                          color={settings.colorScheme === color ? 'primary' : 'default'}
                          variant={settings.colorScheme === color ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Box>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.animations}
                        onChange={(e) => handleSettingChange('animations', e.target.checked)}
                      />
                    }
                    label="Enable animations and transitions"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Audio Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={settings.soundEffects || settings.backgroundMusic ? <VolumeUp /> : <VolumeOff />}
                title="Audio Settings"
                subheader="Configure sound and music"
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.soundEffects}
                        onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                      />
                    }
                    label="Sound Effects"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.backgroundMusic}
                        onChange={(e) => handleSettingChange('backgroundMusic', e.target.checked)}
                      />
                    }
                    label="Background Music"
                  />

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Volume: {settings.volume}%
                    </Typography>
                    <Slider
                      value={settings.volume}
                      onChange={(_, value) => handleSettingChange('volume', value)}
                      min={0}
                      max={100}
                      step={10}
                      marks
                      valueLabelDisplay="auto"
                      disabled={!settings.soundEffects && !settings.backgroundMusic}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Accessibility */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={<Accessibility />}
                title="Accessibility"
                subheader="Make TestAce work better for you"
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.highContrast}
                        onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      />
                    }
                    label="High Contrast Mode"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.screenReader}
                        onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
                      />
                    }
                    label="Screen Reader Support"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.keyboardNavigation}
                        onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                      />
                    }
                    label="Enhanced Keyboard Navigation"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.reducedMotion}
                        onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                      />
                    }
                    label="Reduce Motion and Animations"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Advanced Settings */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Advanced Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardHeader
                        avatar={<Security />}
                        title="Privacy & Security"
                        titleTypographyProps={{ variant: 'subtitle1' }}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControl fullWidth>
                            <InputLabel>Profile Visibility</InputLabel>
                            <Select
                              value={settings.profileVisibility}
                              label="Profile Visibility"
                              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                            >
                              <MenuItem value="public">Public</MenuItem>
                              <MenuItem value="friends">Friends Only</MenuItem>
                              <MenuItem value="private">Private</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.dataSharing}
                                onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                              />
                            }
                            label="Allow data sharing for improvements"
                          />

                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.analyticsOptIn}
                                onChange={(e) => handleSettingChange('analyticsOptIn', e.target.checked)}
                              />
                            }
                            label="Analytics and usage data"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardHeader
                        avatar={<Storage />}
                        title="Performance"
                        titleTypographyProps={{ variant: 'subtitle1' }}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.autoSave}
                                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                              />
                            }
                            label="Auto-save progress"
                          />

                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.offlineMode}
                                onChange={(e) => handleSettingChange('offlineMode', e.target.checked)}
                              />
                            }
                            label="Enable offline mode"
                          />

                          <FormControl fullWidth>
                            <InputLabel>Data Usage</InputLabel>
                            <Select
                              value={settings.dataUsage}
                              label="Data Usage"
                              onChange={(e) => handleSettingChange('dataUsage', e.target.value)}
                            >
                              <MenuItem value="low">Low (Text only)</MenuItem>
                              <MenuItem value="standard">Standard</MenuItem>
                              <MenuItem value="high">High (All features)</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardHeader
                        avatar={<Language />}
                        title="Language & Region"
                        titleTypographyProps={{ variant: 'subtitle1' }}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControl fullWidth>
                            <InputLabel>Language</InputLabel>
                            <Select
                              value="en"
                              label="Language"
                              disabled
                            >
                              <MenuItem value="en">English</MenuItem>
                              <MenuItem value="es">Spanish (Coming Soon)</MenuItem>
                              <MenuItem value="fr">French (Coming Soon)</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl fullWidth>
                            <InputLabel>Time Zone</InputLabel>
                            <Select
                              value="auto"
                              label="Time Zone"
                              disabled
                            >
                              <MenuItem value="auto">Auto-detect</MenuItem>
                            </Select>
                          </FormControl>

                          <Alert severity="info" sx={{ mt: 1 }}>
                            More languages coming soon!
                          </Alert>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveSettings}
                    disabled={saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Restore />}
                    onClick={() => setShowResetDialog(true)}
                  >
                    Reset to Defaults
                  </Button>
                </Box>

                {saveStatus === 'saved' && (
                  <Chip
                    label="Settings saved successfully!"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Reset Confirmation Dialog */}
        <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
          <DialogTitle>Reset Settings</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
            <Button onClick={handleResetSettings} color="error" variant="contained">
              Reset All Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Box>
    </Container>
  );
};

export default Settings;
