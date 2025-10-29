import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount (like testace-app)
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

  const login = async (email, password) => {
    try {
      // Mock authentication like testace-app - no API calls
      const mockUser = {
        id: '1',
        email,
        name: 'Test User',
        grade: '9',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          averageScore: 0
        }
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { token: 'mock-token', user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password, name, grade) => {
    try {
      // Mock registration like testace-app
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        grade,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          averageScore: 0
        }
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { token: 'mock-token', user: mockUser };
    } catch (error) {
      console.error('Registration error:', error);
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
