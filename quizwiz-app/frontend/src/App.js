import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import TestSetSelection from './components/TestSetSelection';
import TestTaking from './components/TestTaking';
import TestResults from './components/TestResults';
import GlobalStyles from './styles/GlobalStyles';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const TestFlow = () => {
  const [currentView, setCurrentView] = useState('selection'); // 'selection', 'taking', 'results'
  const [selectedTestSet, setSelectedTestSet] = useState(null);
  const [testResults, setTestResults] = useState(null);

  const handleStartTest = (testSet) => {
    setSelectedTestSet(testSet);
    setCurrentView('taking');
  };

  const handleTestComplete = (results) => {
    setTestResults(results);
    setCurrentView('results');
  };

  const handleRetakeTest = () => {
    setCurrentView('taking');
  };

  const handleBackToSelection = () => {
    setSelectedTestSet(null);
    setTestResults(null);
    setCurrentView('selection');
  };

  switch (currentView) {
    case 'taking':
      return (
        <TestTaking
          testSet={selectedTestSet}
          onComplete={handleTestComplete}
          onBack={handleBackToSelection}
        />
      );
    case 'results':
      return (
        <TestResults
          results={testResults}
          onRetakeTest={handleRetakeTest}
          onBackToSelection={handleBackToSelection}
        />
      );
    default:
      return (
        <TestSetSelection
          onStartTest={handleStartTest}
        />
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <GlobalStyles />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/test" element={
              <ProtectedRoute>
                <TestFlow />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
