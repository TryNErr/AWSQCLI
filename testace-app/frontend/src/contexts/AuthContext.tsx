import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getOverallProgress } from '../services/userProgressService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, grade: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshUserStats: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserStats = () => {
    if (user) {
      const overallProgress = getOverallProgress();
      const updatedUser = {
        ...user,
        stats: {
          totalQuestions: overallProgress.totalQuestions,
          correctAnswers: overallProgress.correctAnswers,
          wrongAnswers: overallProgress.totalQuestions - overallProgress.correctAnswers,
          averageScore: overallProgress.totalQuestions > 0 
            ? Math.round((overallProgress.correctAnswers / overallProgress.totalQuestions) * 100)
            : 0
        }
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Refresh stats with latest progress data
        setTimeout(refreshUserStats, 100);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (email: string, password: string, name: string, grade: string) => {
    try {
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9), // Generate random ID
        email,
        name,
        grade,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
        streaks: {
          current: 0,
          best: 0
        },
        profile: {
          firstName: name.split(' ')[0],
          lastName: name.split(' ')[1] || '',
          avatar: undefined
        },
        stats: {
          totalQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          averageScore: 0
        }
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Get real progress data
      const overallProgress = getOverallProgress();
      
      // For demo purposes, create a mock user with real stats
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        grade: '9',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
        streaks: {
          current: 3,
          best: 7
        },
        profile: {
          firstName: 'Test',
          lastName: 'User',
          avatar: undefined
        },
        stats: {
          totalQuestions: overallProgress.totalQuestions,
          correctAnswers: overallProgress.correctAnswers,
          wrongAnswers: overallProgress.totalQuestions - overallProgress.correctAnswers,
          averageScore: overallProgress.totalQuestions > 0 
            ? Math.round((overallProgress.correctAnswers / overallProgress.totalQuestions) * 100)
            : 0
        }
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    refreshUserStats
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
