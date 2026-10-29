import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

import Homescreen from './Homescreen';
import GameSetting from './Gamesetting';
import ConnectFourGame from './Connectfourgame';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Homescreen />} />
            <Route path="/Gamesetting" element={<GameSetting />} />
            <Route path="/Connectfourgame" element={<ConnectFourGame />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <span>
            Crafted with ❤️ by{' '}
            <a
              href="https://github.com/snehith8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Snehith Amirishetty
            </a>
          </span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
