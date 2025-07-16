const { io } = require('socket.io-client');

console.log('Testing Socket.IO connection...');

const serverUrl = 'https://5000-trynerr-awsqcli-6imp1j3ael7.ws-us120.gitpod.io';
console.log('Connecting to:', serverUrl);

const socket = io(serverUrl, {
  transports: ['polling', 'websocket'],
  timeout: 10000,
  forceNew: true
});

socket.on('connect', () => {
  console.log('✅ Successfully connected to Socket.IO server');
  console.log('Connection ID:', socket.id);
  console.log('Transport:', socket.io.engine.transport.name);
  
  // Test a simple event
  socket.emit('test-event', { message: 'Hello from test script' });
  
  setTimeout(() => {
    socket.disconnect();
    console.log('Test completed successfully');
    process.exit(0);
  }, 2000);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection failed:', error.message);
  console.error('Error details:', error);
  process.exit(1);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

// Timeout after 15 seconds
setTimeout(() => {
  console.error('❌ Connection timeout');
  process.exit(1);
}, 15000);
