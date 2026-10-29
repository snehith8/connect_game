import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Homescreen = () => {
  const navigate = useNavigate();
  const [hasSavedMatch, setHasSavedMatch] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('c4_active_match_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.tournamentCompleted && parsed.grid) {
          setHasSavedMatch(true);
        }
      } catch (e) {
        setHasSavedMatch(false);
      }
    }
  }, []);

  const handleResumeGame = () => {
    navigate('/Connectfourgame');
  };

  const handleStartAIGame = () => {
    navigate('/Connectfourgame', {
      state: {
        player1Name: 'Player',
        player1Photo: null,
        player2Name: 'Cyber AI',
        player2Photo: null,
        totalgames: 3,
        whostart: 'Player',
        isAiMode: true,
      },
    });
  };

  return (
    <div className="homescreen-card">
      <div className="homescreen-header">
        <h1 className="homescreen-title">CONNECT FOUR!</h1>
        <p className="homescreen-subtitle">
          Play with friends or test your skills online
        </p>
      </div>

      {hasSavedMatch && (
        <div className="resume-match-banner" onClick={handleResumeGame}>
          <i className="pi pi-history"></i>
          <span>Resume Ongoing Match</span>
          <i className="pi pi-arrow-right"></i>
        </div>
      )}

      <div className="preview-container">
        <img
          src="/4C.jpeg"
          alt="Connect Four Game"
          className="homescreen-img"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      <div className="game-modes-grid">
        <Link to="/Gamesetting" className="mode-card play-card">
          <i className="pi pi-user-plus mode-icon"></i>
          <span className="mode-label">Two Players</span>
          <span className="mode-tag active-tag">Ready</span>
        </Link>

        <div
          className="mode-card play-card ai-card"
          onClick={handleStartAIGame}
        >
          <i className="pi pi-android mode-icon"></i>
          <span className="mode-label">Training Game</span>
          <span className="mode-tag active-tag">VS AI</span>
        </div>

        <div className="mode-card disabled-card">
          <i className="pi pi-users mode-icon"></i>
          <span className="mode-label">Three Players</span>
          <span className="mode-tag">Soon</span>
        </div>

        <div className="mode-card disabled-card">
          <i className="pi pi-cog mode-icon"></i>
          <span className="mode-label">Custom Game</span>
          <span className="mode-tag">Soon</span>
        </div>
      </div>
    </div>
  );
};

export default Homescreen;
