import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinPracticeRoom: (subject?: string, difficulty?: string) => void;
  leavePracticeRoom: (subject?: string, difficulty?: string) => void;
  startLivePractice: (options: LivePracticeOptions) => void;
  submitLiveAnswer: (data: LiveAnswerData) => void;
  joinDailyChallenge: () => void;
}

interface LivePracticeOptions {
  subject?: string;
  difficulty?: string;
  questionCount?: number;
}

interface LiveAnswerData {
  sessionId: string;
  questionId: string;
  answer: string | number;
  timeSpent: number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
        console.log('Connecting to Socket.IO server:', serverUrl);
        
        const newSocket = io(serverUrl, {
          auth: {
            token
          },
          transports: ['polling', 'websocket'], // Prioritize polling for Gitpod
          timeout: 20000, // 20 second timeout
          forceNew: true, // Force new connection
          upgrade: true, // Allow upgrade to websocket if available
          rememberUpgrade: false // Don't remember the upgrade for next time
        });

        newSocket.on('connect', () => {
          console.log('Connected to server');
          setConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from server');
          setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket.IO connection error:', error);
          setConnected(false);
          // Don't show toast for every connection error to avoid spam
          if (error.message && !error.message.includes('timeout')) {
            toast.error('Connection error. Some features may not work.');
          }
        });

        // Live practice events
        newSocket.on('session-started', (data) => {
          console.log('Live practice session started:', data);
          // Handle session start in components
        });

        newSocket.on('answer-result', (data) => {
          console.log('Answer result:', data);
          // Handle answer result in components
        });

        newSocket.on('next-question', (data) => {
          console.log('Next question:', data);
          // Handle next question in components
        });

        newSocket.on('session-completed', (data) => {
          console.log('Session completed:', data);
          toast.success(`Session completed! Score: ${data.score}%`);
        });

        // Daily challenge events
        newSocket.on('daily-challenge-started', (data) => {
          console.log('Daily challenge started:', data);
          toast.success('Daily challenge started!');
        });

        newSocket.on('daily-challenge-status', (data) => {
          console.log('Daily challenge status:', data);
          if (data.message) {
            toast.success(data.message);
          }
        });

        // Leaderboard events
        newSocket.on('leaderboard-update', (data) => {
          console.log('Leaderboard update:', data);
          // Handle leaderboard updates in components
        });

        // Error handling
        newSocket.on('error', (data) => {
          console.error('Socket error:', data);
          toast.error(data.message || 'An error occurred');
        });

        // Social features
        newSocket.on('user-joined-practice', (data) => {
          console.log('User joined practice:', data);
          // Could show notification that someone joined
        });

        newSocket.on('user-left-practice', (data) => {
          console.log('User left practice:', data);
        });

        newSocket.on('challenge-participant-joined', (data) => {
          console.log('Challenge participant joined:', data);
          // Could show live participant count
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    }
  }, [user]);

  const joinPracticeRoom = (subject?: string, difficulty?: string) => {
    if (socket) {
      socket.emit('join-practice-room', { subject, difficulty });
    }
  };

  const leavePracticeRoom = (subject?: string, difficulty?: string) => {
    if (socket) {
      socket.emit('leave-practice-room', { subject, difficulty });
    }
  };

  const startLivePractice = (options: LivePracticeOptions) => {
    if (socket) {
      socket.emit('start-live-practice', options);
    }
  };

  const submitLiveAnswer = (data: LiveAnswerData) => {
    if (socket) {
      socket.emit('submit-live-answer', data);
    }
  };

  const joinDailyChallenge = () => {
    if (socket) {
      socket.emit('join-daily-challenge');
    }
  };

  const value: SocketContextType = {
    socket,
    connected,
    joinPracticeRoom,
    leavePracticeRoom,
    startLivePractice,
    submitLiveAnswer,
    joinDailyChallenge,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
