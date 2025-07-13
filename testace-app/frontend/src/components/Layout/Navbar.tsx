import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  LocalFireDepartment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <School sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div">
            TestAce
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Connection Status */}
          <Tooltip title={connected ? 'Connected' : 'Disconnected'}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: connected ? 'success.main' : 'error.main',
              }}
            />
          </Tooltip>

          {/* Current Streak */}
          {user && user.streaks && (
            <Tooltip title="Current Streak">
              <Chip
                icon={<LocalFireDepartment />}
                label={user.streaks.current || 0}
                size="small"
                color="warning"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              />
            </Tooltip>
          )}

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={0} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user?.profile?.avatar ? (
                <Avatar
                  src={user.profile.avatar}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.profile?.firstName?.[0] || 'U'}{user?.profile?.lastName?.[0] || ''}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          id="primary-search-account-menu"
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.profile?.firstName || 'User'} {user?.profile?.lastName || ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || 'No email'}
            </Typography>
          </Box>
          
          <MenuItem onClick={handleProfileClick}>
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          
          <MenuItem onClick={handleSettingsClick}>
            <Settings sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
