import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Timer,
  Person,
  Settings,
  Logout,
  Notifications,
  TrendingUp,
  EmojiEvents,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/', 
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Your learning overview'
    },
    { 
      text: 'Practice', 
      icon: <School />, 
      path: '/practice', 
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Practice questions'
    },
    { 
      text: 'Timed Test', 
      icon: <Timer />, 
      path: '/timed-test', 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      description: 'Challenge yourself'
    },
    { 
      text: 'Profile', 
      icon: <Person />, 
      path: '/profile', 
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      description: 'Your achievements'
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      path: '/settings', 
      gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      description: 'Customize experience'
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
        }} />
        <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h5" fontWeight={800} className="gradient-text" sx={{ color: 'white !important' }}>
          TestAce
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Level up your learning! 🚀
        </Typography>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48,
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              fontWeight: 700,
              fontSize: '1.2rem'
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              {user?.name || 'Student'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
              <Typography variant="caption" color="text.secondary">
                Grade {user?.grade || '9'} • Level 5
              </Typography>
            </Box>
          </Box>
          <Badge badgeContent={3} color="error">
            <Notifications sx={{ color: '#6366f1' }} />
          </Badge>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <Tooltip key={item.text} title={item.description} placement="right">
              <ListItem
                button
                onClick={() => handleNavigation(item.path)}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  mx: 1,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    background: item.gradient,
                    color: 'white',
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: item.gradient,
                      transform: 'translateX(8px) translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'white',
                      fontWeight: 700,
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 700 : 600,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* Logout Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: '#ef4444',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              transform: 'translateX(4px)',
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <ListItemIcon sx={{ color: '#ef4444', minWidth: 44 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#6366f1',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box>
              <Typography 
                variant="h6" 
                noWrap 
                component="div"
                sx={{ 
                  color: '#1e293b',
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                {menuItems.find(item => item.path === location.pathname)?.text || 'TestAce'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748b',
                  display: 'block',
                  lineHeight: 1
                }}
              >
                {menuItems.find(item => item.path === location.pathname)?.description || 'Welcome back!'}
              </Typography>
            </Box>
          </Box>

          {/* Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              sx={{
                color: '#6366f1',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                }
              }}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
              onClick={() => navigate('/profile')}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              borderRight: '1px solid rgba(226, 232, 240, 0.8)',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              borderRight: '1px solid rgba(226, 232, 240, 0.8)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '80px', // Height of AppBar + padding
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          minHeight: 'calc(100vh - 80px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            borderRadius: '0 0 50px 50px',
            zIndex: -1,
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
