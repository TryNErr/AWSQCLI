import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  Notifications, 
  Security, 
  Palette, 
  VolumeUp, 
  Delete,
  Save
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      dailyReminders: true,
      streakAlerts: true,
      achievementNotifications: true,
      emailUpdates: false
    },
    preferences: {
      darkMode: false,
      soundEffects: true,
      autoSave: true,
      showHints: true
    },
    privacy: {
      profileVisible: true,
      shareProgress: false,
      allowAnalytics: true
    }
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const saveSettings = () => {
    // Save settings to backend
    console.log('Saving settings:', settings);
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }
    // Handle password change
    console.log('Changing password...');
    setShowChangePassword(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log('Deleting account...');
    setShowDeleteDialog(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        {/* Notifications */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Notifications sx={{ mr: 1 }} />
              <Typography variant="h6">
                Notifications
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.dailyReminders}
                  onChange={(e) => handleSettingChange('notifications', 'dailyReminders', e.target.checked)}
                />
              }
              label="Daily practice reminders"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.streakAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'streakAlerts', e.target.checked)}
                />
              }
              label="Streak maintenance alerts"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.achievementNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'achievementNotifications', e.target.checked)}
                />
              }
              label="Achievement notifications"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.emailUpdates}
                  onChange={(e) => handleSettingChange('notifications', 'emailUpdates', e.target.checked)}
                />
              }
              label="Email updates and newsletters"
            />
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Palette sx={{ mr: 1 }} />
              <Typography variant="h6">
                Preferences
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.preferences.darkMode}
                  onChange={(e) => handleSettingChange('preferences', 'darkMode', e.target.checked)}
                />
              }
              label="Dark mode"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.preferences.soundEffects}
                  onChange={(e) => handleSettingChange('preferences', 'soundEffects', e.target.checked)}
                />
              }
              label="Sound effects"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.preferences.autoSave}
                  onChange={(e) => handleSettingChange('preferences', 'autoSave', e.target.checked)}
                />
              }
              label="Auto-save progress"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.preferences.showHints}
                  onChange={(e) => handleSettingChange('preferences', 'showHints', e.target.checked)}
                />
              }
              label="Show hints during practice"
            />
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ mr: 1 }} />
              <Typography variant="h6">
                Privacy & Security
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.privacy.profileVisible}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                />
              }
              label="Make profile visible to other users"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.privacy.shareProgress}
                  onChange={(e) => handleSettingChange('privacy', 'shareProgress', e.target.checked)}
                />
              }
              label="Share progress on leaderboard"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.privacy.allowAnalytics}
                  onChange={(e) => handleSettingChange('privacy', 'allowAnalytics', e.target.checked)}
                />
              }
              label="Allow analytics for app improvement"
            />

            <Divider sx={{ my: 2 }} />
            
            <Button
              variant="outlined"
              onClick={() => setShowChangePassword(true)}
              sx={{ mr: 2, mb: 1 }}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="contained"
            onClick={saveSettings}
            startIcon={<Save />}
          >
            Save Settings
          </Button>
        </Box>

        {/* Danger Zone */}
        <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              These actions cannot be undone. Please proceed with caution.
            </Alert>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onClose={() => setShowChangePassword(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={passwordData.current}
            onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={passwordData.new}
            onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChangePassword(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete your account? Type "DELETE" to confirm.
          </Typography>
          <TextField
            fullWidth
            placeholder="Type DELETE to confirm"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
