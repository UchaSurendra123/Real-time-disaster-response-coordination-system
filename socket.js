import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:8000', {
  path: '/ws/incidents/',
});

export default socket;
