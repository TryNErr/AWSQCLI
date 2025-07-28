import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Practice from './pages/Practice/Practice';
import Question from './pages/Practice/Question';
import QuestionHistory from './pages/Practice/QuestionHistory';
import TimedTest from './pages/TimedTest/TimedTest';
import TimedTestResults from './pages/TimedTest/TimedTestResults';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        {/* Protected routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/practice" element={
          <PrivateRoute>
            <Layout>
              <Practice />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/practice/question/:id" element={
          <PrivateRoute>
            <Layout>
              <Question />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/practice/history" element={
          <PrivateRoute>
            <Layout>
              <QuestionHistory />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/timed-test" element={
          <PrivateRoute>
            <Layout>
              <TimedTest />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/timed-test/results" element={
          <PrivateRoute>
            <Layout>
              <TimedTestResults />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <Layout>
              <Settings />
            </Layout>
          </PrivateRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
