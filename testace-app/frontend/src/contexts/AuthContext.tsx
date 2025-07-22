import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, grade: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
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

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
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
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        grade: '5',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
        streaks: {
          current: 3,
          best: 5
        },
        profile: {
          firstName: 'Test',
          lastName: 'User',
          avatar: undefined
        },
        stats: {
          totalQuestions: 150,
          correctAnswers: 120,
          wrongAnswers: 30,
          averageScore: 80
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
