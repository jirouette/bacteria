import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { OnlineGame } from './OnlineGame';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:gameId?" element={<OnlineGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
