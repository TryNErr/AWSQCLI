import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import socketService from '../services/socketService';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinPracticeRoom: (subject?: string, difficulty?: string) => void;
  leavePracticeRoom: (subject?: string, difficulty?: string) => void;
  startLivePractice: (options: LivePracticeOptions) => void;
  submitLiveAnswer: (data: LiveAnswerData) => void;
  joinDailyChallenge: () => void;
  reconnect: () => void;
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

  const setupSocketListeners = (socket: Socket) => {
    socket.on('connect', () => {
      console.log('Connected to server with socket ID:', socket.id);
      setConnected(true);
      toast.success('Connected to server', { id: 'socket-connected' });
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        setTimeout(() => {
          reconnect();
        }, 2000);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setConnected(false);
      // Don't show toast for every connection error to avoid spam
      toast.error('Connection error. Some features may not work.', { id: 'socket-error' });
    });

    // Live practice events
    socket.on('session-started', (data) => {
      console.log('Live practice session started:', data);
      // Handle session start in components
    });

    socket.on('answer-result', (data) => {
      console.log('Answer result:', data);
      // Handle answer result in components
    });

    socket.on('next-question', (data) => {
      console.log('Next question:', data);
      // Handle next question in components
    });

    socket.on('session-completed', (data) => {
      console.log('Session completed:', data);
      toast.success(`Session completed! Score: ${data.score}%`);
    });

    // Daily challenge events
    socket.on('daily-challenge-started', (data) => {
      console.log('Daily challenge started:', data);
      toast.success('Daily challenge started!');
    });

    socket.on('daily-challenge-status', (data) => {
      console.log('Daily challenge status:', data);
      if (data.message) {
        toast.success(data.message);
      }
    });

    // Leaderboard events
    socket.on('leaderboard-update', (data) => {
      console.log('Leaderboard update:', data);
      // Handle leaderboard updates in components
    });

    // Error handling
    socket.on('error', (data) => {
      console.error('Socket error:', data);
      toast.error(data.message || 'An error occurred');
    });

    // Connected confirmation from server
    socket.on('connected', (data) => {
      console.log('Server confirmed connection:', data);
      toast.success(`Connected as ${data.socketId}`, { id: 'socket-confirmed' });
    });
  };

  const initializeSocket = () => {
    if (user) {
      try {
        console.log('Initializing socket connection...');
        const newSocket = socketService.connect();
        
        if (newSocket) {
          setSocket(newSocket);
          setupSocketListeners(newSocket);
        }
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        toast.error('Failed to connect to server. Some features may not work.');
      }
    }
  };

  const reconnect = () => {
    console.log('Attempting to reconnect socket...');
    socketService.disconnect();
    setTimeout(() => {
      initializeSocket();
    }, 1000);
  };

  useEffect(() => {
    if (user) {
      initializeSocket();
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const joinPracticeRoom = (subject?: string, difficulty?: string) => {
    if (socket && socket.connected) {
      socket.emit('join-practice-room', { subject, difficulty });
    } else {
      console.warn('Socket not connected, cannot join practice room');
      reconnect();
    }
  };

  const leavePracticeRoom = (subject?: string, difficulty?: string) => {
    if (socket && socket.connected) {
      socket.emit('leave-practice-room', { subject, difficulty });
    }
  };

  const startLivePractice = (options: LivePracticeOptions) => {
    if (socket && socket.connected) {
      socket.emit('start-live-practice', options);
    } else {
      console.warn('Socket not connected, cannot start live practice');
      toast.error('Connection issue. Please try again.');
      reconnect();
    }
  };

  const submitLiveAnswer = (data: LiveAnswerData) => {
    if (socket && socket.connected) {
      socket.emit('submit-live-answer', data);
    } else {
      console.warn('Socket not connected, cannot submit answer');
      reconnect();
    }
  };

  const joinDailyChallenge = () => {
    if (socket && socket.connected) {
      socket.emit('join-daily-challenge');
    } else {
      console.warn('Socket not connected, cannot join daily challenge');
      reconnect();
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
    reconnect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
