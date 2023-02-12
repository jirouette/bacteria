import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { OfflineGame } from './OfflineGame';
import { OnlineGame } from './OnlineGame';
// @ts-ignore
import styles from "./App.module.scss";

export default function App() {
  return (
    <div className={styles.App}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:tiles?/:player?" element={<OfflineGame />} />
          <Route path="/:gameId?" element={<OnlineGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
