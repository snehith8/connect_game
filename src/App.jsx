import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Homescreen from './Homescreen';
import ConnectFourGame from './Connectfourgame';
import GameSetting from './Gamesetting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homescreen />} />
        <Route path='/Gamesetting' element={<GameSetting />} />
        <Route path='/Connectfourgame' element={<ConnectFourGame />} />
      </Routes>
    </Router>
  );
}

export default App;