import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from './client';
import React from 'react';
// @ts-ignore
import styles from "./Home.module.scss";

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
        <div className={styles.Home}>
            <h1 className={styles.title}>BACTERIA</h1>
            <menu>
                <button onClick={() => {client.emit('createGame');}} disabled={!isConnected}>Create game</button>
                <button onClick={() => {navigate('/game');}}>Offline game</button>
                <button onClick={() => {navigate('/game/200213003');}}>Example game</button>
            </menu>
        </div>
    );
}
