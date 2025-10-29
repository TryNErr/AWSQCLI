import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NavigationHeader from '../NavigationHeader';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 40px 0;
`;

const ProfileHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 8px;
`;

const UserDetails = styled.div`
  color: var(--gray);
  font-size: 16px;
`;

const TabsContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid var(--gray-lighter);
`;

const Tab = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: ${props => props.active ? 'var(--primary)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--gray)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : 'var(--gray-lighter)'};
  }
`;

const TabContent = styled.div`
  padding: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: var(--gray-lighter);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: var(--gray);
  font-weight: 500;
`;

const ChartContainer = styled.div`
  background: var(--gray-lighter);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
`;

const RecentQuizzes = styled.div`
  background: var(--gray-lighter);
  border-radius: 12px;
  padding: 24px;
`;

const QuizItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--gray-light);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    margin: 0 -16px;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedQuizResult, setSelectedQuizResult] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    grade: user?.grade || '9'
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [statsRes, quizzesRes, subjectsRes] = await Promise.all([
        axios.get('/api/user/stats'),
        axios.get('/api/user/recent-quizzes'),
        axios.get('/api/user/subject-stats')
      ]);
      
      setStats(statsRes.data);
      setRecentQuizzes(quizzesRes.data);
      setSubjectStats(subjectsRes.data);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/user/profile', formData);
      updateUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await axios.put('/api/user/change-password', {
        currentPassword,
        newPassword
      });
      alert('Password changed successfully');
      e.target.reset();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change password');
    }
  };

  const fetchQuizDetails = async (resultId) => {
    try {
      const response = await axios.get(`/api/test-sets/result/${resultId}`);
      setSelectedQuizResult(response.data);
    } catch (error) {
      console.error('Failed to fetch quiz details:', error);
    }
  };

  if (selectedQuizResult) {
    return (
      <>
        <NavigationHeader 
          title={`Quiz Results: ${selectedQuizResult.testSet.name}`}
          backTo="/profile" 
          backLabel="Profile"
        />
        <ProfileContainer>
        <div className="container">
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedQuizResult(null)}
                style={{ marginRight: '16px' }}
              >
                ← Back to Profile
              </button>
              <h2 style={{ margin: 0 }}>Quiz Results: {selectedQuizResult.testSet.name}</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{selectedQuizResult.score}%</div>
                <div style={{ color: 'var(--gray)' }}>Score</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{selectedQuizResult.correctAnswers}/{selectedQuizResult.totalQuestions}</div>
                <div style={{ color: 'var(--gray)' }}>Correct</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{Math.round(selectedQuizResult.timeSpent / 60)}m</div>
                <div style={{ color: 'var(--gray)' }}>Time</div>
              </div>
            </div>

            <h3 style={{ marginBottom: '16px' }}>Question Details</h3>
            {selectedQuizResult.questions.map((q, index) => (
              <div key={index} style={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '16px',
                borderLeft: `4px solid ${q.isCorrect ? '#10b981' : '#ef4444'}`
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                  Question {index + 1}: {q.question}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Your Answer:</strong> {q.userAnswer}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Correct Answer:</strong> {q.correctAnswer}
                </div>
                <div style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  display: 'inline-block',
                  background: q.isCorrect ? '#dcfce7' : '#fee2e2',
                  color: q.isCorrect ? '#166534' : '#991b1b',
                  fontSize: '14px'
                }}>
                  {q.isCorrect ? 'Correct' : 'Incorrect'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfileContainer>
      </>
    );
  }

  return (
    <ProfileContainer>
      <div className="container">
        <ProfileHeader>
          <Avatar>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserDetails>
              {user?.email} • Grade {user?.grade} • Member since {new Date(user?.createdAt).toLocaleDateString()}
            </UserDetails>
          </UserInfo>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>
        </ProfileHeader>

        <TabsContainer>
          <TabsHeader>
            <Tab 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Tab>
            <Tab 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Tab>
          </TabsHeader>

          <TabContent>
            {activeTab === 'overview' && (
              <>
                <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
                  Performance Overview
                </h3>
                
                <StatsGrid>
                  <StatCard>
                    <StatValue>{stats.totalQuizzes || 0}</StatValue>
                    <StatLabel>Total Quizzes</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.averageScore || 0}%</StatValue>
                    <StatLabel>Average Score</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.bestScore || 0}%</StatValue>
                    <StatLabel>Best Score</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.totalTimeSpent || 0}m</StatValue>
                    <StatLabel>Time Spent</StatLabel>
                  </StatCard>
                </StatsGrid>

                {subjectStats.length > 0 && (
                  <ChartContainer>
                    <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                      Performance by Subject
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={subjectStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="averageScore" fill="var(--primary)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}

                <RecentQuizzes>
                  <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                    Recent Quizzes
                  </h4>
                  {recentQuizzes.length > 0 ? (
                    recentQuizzes.map((quiz, index) => (
                      <QuizItem key={index} onClick={() => fetchQuizDetails(quiz._id)}>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--dark)' }}>
                            {quiz.subject} - Grade {quiz.grade}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--gray)' }}>
                            {new Date(quiz.completedAt).toLocaleDateString()} • {quiz.mode} mode
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                          {quiz.score}%
                        </div>
                      </QuizItem>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--gray)', padding: '20px' }}>
                      No quizzes completed yet. Start your first quiz!
                    </div>
                  )}
                </RecentQuizzes>
              </>
            )}

            {activeTab === 'settings' && (
              <>
                <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
                  Account Settings
                </h3>
                
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                    Profile Information
                  </h4>
                  
                  {editMode ? (
                    <form onSubmit={handleUpdateProfile}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Grade</label>
                        <select
                          className="form-input"
                          value={formData.grade}
                          onChange={(e) => setFormData({...formData, grade: e.target.value})}
                        >
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                            <option key={grade} value={grade}>Grade {grade}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <p><strong>Name:</strong> {user?.name}</p>
                      <p><strong>Email:</strong> {user?.email}</p>
                      <p><strong>Grade:</strong> {user?.grade}</p>
                      <button 
                        className="btn btn-primary mt-2"
                        onClick={() => setEditMode(true)}
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                    Change Password
                  </h4>
                  
                  <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      Change Password
                    </button>
                  </form>
                </div>
              </>
            )}
          </TabContent>
        </TabsContainer>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
