import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Practice from './pages/Practice/Practice';
import Question from './pages/Practice/Question';
import QuestionHistory from './pages/Practice/QuestionHistory';
import TimedTest from './pages/TimedTest/TimedTest';
import TimedTestResults from './pages/TimedTest/TimedTestResults';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/practice" element={
          <Layout>
            <Practice />
          </Layout>
        } />
        <Route path="/practice/question/:id" element={
          <Layout>
            <Question />
          </Layout>
        } />
        <Route path="/practice/history" element={
          <Layout>
            <QuestionHistory />
          </Layout>
        } />
        <Route path="/timed-test" element={
          <Layout>
            <TimedTest />
          </Layout>
        } />
        <Route path="/timed-test/results" element={
          <Layout>
            <TimedTestResults />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <Profile />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <Settings />
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
