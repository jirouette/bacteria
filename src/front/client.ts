import io from 'socket.io-client';

export const client = io({path: '/io'});