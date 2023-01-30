import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from './client';
import React from 'react';

export function Home() {
    const [isConnected, setConnectedStatus] = useState(client.connected);
    const navigate = useNavigate();

    
    const onGameCreated = (gameId: string) => {
        navigate(`${gameId}`);
    };

    const onConnectionEvent = () => {
        setConnectedStatus(client.connected);
    };


    useEffect(() => {
        client.on('gameCreated', onGameCreated);
        client.on('connect', onConnectionEvent);
        client.on('disconnect', onConnectionEvent);

        return () => {
            client.off('gameCreated', onGameCreated);
            client.off('connect', onConnectionEvent);
            client.off('disconnect', onConnectionEvent);
        }
    }, []);

    return (
        <div>
            <h1>Bacteria</h1>
            <button onClick={() => {client.emit('createGame');}} disabled={!isConnected}>Create game</button>
        </div>
    );
}
