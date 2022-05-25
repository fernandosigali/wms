import io from 'socket.io-client';

const wsPort = 3001;

export const socket = io.connect(`http://10.167.1.223:${wsPort}`, {
    withCredentials: true,
    transports : ['websocket'] 
});
