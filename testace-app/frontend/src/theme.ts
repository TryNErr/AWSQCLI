import { createTheme } from '@mui/material/styles';

// Modern, vibrant theme for young audiences - Professional yet funky
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Modern indigo - trendy and professional
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b', // Vibrant amber - energetic and fun
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Modern emerald green
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b', // Consistent with secondary
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Modern red
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3b82f6', // Bright blue
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Subtle off-white
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Dark slate for better readability
      secondary: '#64748b', // Medium slate
    },
    // Custom colors for the vibrant design
    mode: 'light',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      lineHeight: 1.1,
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1e293b',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.25,
      color: '#1e293b',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#1e293b',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e293b',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e293b',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#475569',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 16, // More rounded for modern look
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '0.875rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.4)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
            boxShadow: '0 6px 20px 0 rgba(245, 158, 11, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#e2e8f0',
          color: '#475569',
          '&:hover': {
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-4px)',
            borderColor: 'rgba(99, 102, 241, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(226, 232, 240, 0.8)',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#ffffff',
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          color: '#ffffff',
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
        },
        colorError: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
        },
        colorInfo: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#ffffff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
            },
            '& fieldset': {
              borderColor: '#e2e8f0',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#f8fafc',
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
          '&.Mui-focused': {
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.2)',
          color: '#065f46',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          color: '#991b1b',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.2)',
          color: '#92400e',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.2)',
          color: '#1e40af',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
          backgroundColor: '#e2e8f0',
        },
        bar: {
          borderRadius: 10,
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#6366f1',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderRight: '1px solid rgba(226, 232, 240, 0.8)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderLeft: '4px solid #6366f1',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
            borderRadius: 12,
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#6366f1',
          minWidth: 40,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 600,
          color: '#1e293b',
        },
      },
    },
  },
});

// Add custom CSS variables for additional styling
const customStyles = `
  :root {
    --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    --gradient-secondary: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    --gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
    --gradient-rainbow: linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #ec4899 50%, #f59e0b 75%, #10b981 100%);
    --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
    --shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .gradient-text {
    background: var(--gradient-rainbow);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .glow-effect {
    box-shadow: var(--shadow-glow);
  }
  
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
  }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default theme;
