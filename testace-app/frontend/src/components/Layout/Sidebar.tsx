import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  School,
  Timer,
  EmojiEvents,
  Analytics,
  Leaderboard,
  Create,
  Person,
  Settings,
  Help,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    text: 'Practice',
    icon: <School />,
    path: '/practice',
  },
  {
    text: 'Timed Test',
    icon: <Timer />,
    path: '/timed-test',
  },
  {
    text: 'Daily Challenge',
    icon: <EmojiEvents />,
    path: '/daily-challenge',
    badge: 'New',
  },
  {
    text: 'Analytics',
    icon: <Analytics />,
    path: '/analytics',
  },
  {
    text: 'Leaderboard',
    icon: <Leaderboard />,
    path: '/leaderboard',
  },
  {
    text: 'Writing Critique',
    icon: <Create />,
    path: '/writing',
  },
];

const bottomMenuItems = [
  {
    text: 'Profile',
    icon: <Person />,
    path: '/profile',
  },
  {
    text: 'Settings',
    icon: <Settings />,
    path: '/settings',
  },
  {
    text: 'Help',
    icon: <Help />,
    path: '/help',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      
      {/* User Info */}
      <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {user?.profile?.firstName || 'User'} {user?.profile?.lastName || ''}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Level {Math.floor((user?.stats?.totalQuestions || 0) / 100) + 1}
        </Typography>
      </Box>

      <Divider />

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  color="secondary"
                  sx={{ ml: 1 }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bottom Navigation */}
      <List>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
        <Typography variant="caption" color="text.secondary">
          TestAce v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
