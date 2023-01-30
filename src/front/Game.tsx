import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from './client';
import { Board } from "./Board";

export function Game() {
    const { gameId } = useParams<{ gameId: string }>();
    const [isConnected, setConnectedStatus] = useState(client.connected);

    const onConnectionEvent = () => {
        setConnectedStatus(client.connected);
    };

    const onConnect = () => {
        client.emit('joinGame', gameId);
    }

    useEffect(() => {
        if (isConnected) {
            onConnect();
        } else {
            client.once('connect', onConnect);
        }
        client.on('connect', onConnectionEvent);
        client.on('disconnect', onConnectionEvent);

        return () => {
            client.off('connect', onConnectionEvent);
            client.off('disconnect', onConnectionEvent);
        }
    }, []);

    return (
        <div>Game! {gameId} <Board /></div>
    );
}
