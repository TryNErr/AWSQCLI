import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private connectionAttempts = 0;
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds

  connect() {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    
    try {
      console.log('Attempting to connect to socket server:', serverUrl);
      
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully:', this.socket?.id);
        this.connectionAttempts = 0;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.handleConnectionError();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      return this.socket;
    } catch (error) {
      console.error('Socket initialization error:', error);
      this.handleConnectionError();
      return null;
    }
  }

  private handleConnectionError() {
    this.connectionAttempts++;
    
    if (this.connectionAttempts <= this.maxRetries) {
      console.log(`Retrying connection (${this.connectionAttempts}/${this.maxRetries}) in ${this.retryDelay}ms`);
      setTimeout(() => this.connect(), this.retryDelay);
    } else {
      console.error(`Failed to connect after ${this.maxRetries} attempts. Socket functionality will be limited.`);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected');
    }
  }

  emit(event: string, data: any) {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected, attempting to reconnect...');
      this.connect();
      // Queue the event to be sent after connection
      setTimeout(() => {
        if (this.socket?.connected) {
          this.socket.emit(event, data);
        } else {
          console.error('Failed to emit event, socket still not connected');
        }
      }, 1000);
      return;
    }
    
    this.socket.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      this.connect();
    }
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
