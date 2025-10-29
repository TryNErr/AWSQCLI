import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const ForgotContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient);
  padding: 20px;
`;

const ForgotCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
`;

const Logo = styled.h1`
  font-size: 32px;
  font-weight: 800;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: var(--gray);
  margin-bottom: 32px;
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  
  &.error {
    background: #fef2f2;
    color: var(--error);
  }
  
  &.success {
    background: #f0fdf4;
    color: var(--success);
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Password reset instructions sent to your email');
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send reset email');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotContainer>
      <ForgotCard>
        <Logo>QuizWiz</Logo>
        <Subtitle>Reset your password</Subtitle>
        
        {message && (
          <Message className={messageType}>
            {message}
          </Message>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '16px' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
        
        <div className="text-center">
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      </ForgotCard>
    </ForgotContainer>
  );
};

export default ForgotPassword;
