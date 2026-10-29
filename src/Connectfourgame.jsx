import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { sound } from './utils/Sound';
import { launchConfetti } from './utils/confetti';

const ROWS = 6;
const COLS = 7;
const TURN_DURATION = 15;
const STORAGE_KEY = 'c4_active_match_v1';

const createEmptyGrid = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const ConnectFourGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  // Check localStorage for active saved match
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

  const isAiMode = Boolean(state.isAiMode ?? savedState?.isAiMode ?? false);
  const player1Name =
    state.player1Name || savedState?.player1Name || 'Player 1';
  const player2Name =
    state.player2Name ||
    savedState?.player2Name ||
    (isAiMode ? 'Cyber AI' : 'Player 2');
  const player1Photo = state.player1Photo || savedState?.player1Photo || null;
  const player2Photo = state.player2Photo || savedState?.player2Photo || null;
  const totalgames = Number(state.totalgames || savedState?.totalgames || 2);
  const whostart = state.whostart || savedState?.whostart || 'Alternative Turn';

  const [grid, setGrid] = useState(savedState?.grid || createEmptyGrid());
  const [currentPlayer, setCurrentPlayer] = useState(
    savedState?.currentPlayer || player1Name,
  );
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [history, setHistory] = useState(savedState?.history || []);
  const [roundResults, setRoundResults] = useState(
    savedState?.roundResults || [],
  );
  const [player1Score, setPlayer1Score] = useState(
    savedState?.player1Score || 0,
  );
  const [player2Score, setPlayer2Score] = useState(
    savedState?.player2Score || 0,
  );
  const [gamesPlayed, setGamesPlayed] = useState(savedState?.gamesPlayed || 0);
  const [tournamentCompleted, setTournamentCompleted] = useState(
    savedState?.tournamentCompleted || false,
  );
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Sync to localStorage on state change
  useEffect(() => {
    if (tournamentCompleted) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const payload = {
      isAiMode,
      player1Name,
      player2Name,
      player1Photo,
      player2Photo,
      totalgames,
      whostart,
      grid,
      currentPlayer,
      history,
      roundResults,
      player1Score,
      player2Score,
      gamesPlayed,
      tournamentCompleted,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    isAiMode,
    player1Name,
    player2Name,
    player1Photo,
    player2Photo,
    totalgames,
    whostart,
    grid,
    currentPlayer,
    history,
    roundResults,
    player1Score,
    player2Score,
    gamesPlayed,
    tournamentCompleted,
  ]);

  const toggleSound = () => {
    sound.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const checkDirection = (board, row, col, rowStep, colStep) => {
    const player = board[row][col];
    if (!player) return null;

    let cells = [{ row, col }];

    let r = row + rowStep;
    let c = col + colStep;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      cells.push({ row: r, col: c });
      r += rowStep;
      c += colStep;
    }

    r = row - rowStep;
    c = col - colStep;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      cells.push({ row: r, col: c });
      r -= rowStep;
      c -= colStep;
    }

    if (cells.length >= 4) {
      return cells.slice(0, 4);
    }
    return null;
  };

  const getWinningStreak = useCallback((board, row, col) => {
    return (
      checkDirection(board, row, col, 0, 1) ||
      checkDirection(board, row, col, 1, 0) ||
      checkDirection(board, row, col, 1, 1) ||
      checkDirection(board, row, col, 1, -1)
    );
  }, []);

  const advanceRound = useCallback(
    (completedRounds, p1Score, p2Score, lastWinner) => {
      setGamesPlayed(completedRounds);

      if (completedRounds >= totalgames) {
        setTournamentCompleted(true);
        localStorage.removeItem(STORAGE_KEY);
        launchConfetti();
        let outcome;
        if (p1Score > p2Score)
          outcome = `🏆 Tournament Champion: ${player1Name}!`;
        else if (p2Score > p1Score)
          outcome = `🏆 Tournament Champion: ${player2Name}!`;
        else outcome = "🤝 Tournament Result: It's a Tie!";
        setRoundResults((prev) => [...prev, outcome]);
        return;
      }

      setGrid(createEmptyGrid());
      setWinner(null);
      setWinningCells([]);
      setHistory([]);
      setTimeLeft(TURN_DURATION);

      if (whostart === 'Winner1st' && lastWinner) {
        setCurrentPlayer(lastWinner);
      } else if (whostart === 'Player 02') {
        setCurrentPlayer(player2Name);
      } else {
        setCurrentPlayer(completedRounds % 2 === 0 ? player1Name : player2Name);
      }
    },
    [totalgames, player1Name, player2Name, whostart],
  );

  const executeMove = useCallback(
    (rowIndex, colIndex, player) => {
      sound.playDrop();
      setHistory((prev) => [
        ...prev,
        { grid: grid.map((r) => [...r]), currentPlayer: player },
      ]);

      const nextGrid = grid.map((r, rIdx) =>
        rIdx === rowIndex
          ? r.map((c, cIdx) => (cIdx === colIndex ? player : c))
          : [...r],
      );

      setGrid(nextGrid);
      const winCoords = getWinningStreak(nextGrid, rowIndex, colIndex);

      if (winCoords) {
        setWinner(player);
        setWinningCells(winCoords);
        sound.playWin();
        launchConfetti();

        const isP1 = player === player1Name;
        const nextP1 = isP1 ? player1Score + 1 : player1Score;
        const nextP2 = !isP1 ? player2Score + 1 : player2Score;

        setPlayer1Score(nextP1);
        setPlayer2Score(nextP2);

        const log = `Round ${gamesPlayed + 1}: ${player} won!`;
        setRoundResults((prev) => [...prev, log]);

        setTimeout(
          () => advanceRound(gamesPlayed + 1, nextP1, nextP2, player),
          1700,
        );
      } else if (nextGrid.every((row) => row.every((c) => c !== null))) {
        const log = `Round ${gamesPlayed + 1}: It's a draw!`;
        setRoundResults((prev) => [...prev, log]);
        setTimeout(
          () => advanceRound(gamesPlayed + 1, player1Score, player2Score, null),
          1200,
        );
      } else {
        setTimeLeft(TURN_DURATION);
        setCurrentPlayer(player === player1Name ? player2Name : player1Name);
      }
    },
    [
      grid,
      player1Name,
      player2Name,
      player1Score,
      player2Score,
      gamesPlayed,
      advanceRound,
      getWinningStreak,
    ],
  );

  // AI Decision Logic
  useEffect(() => {
    if (
      !isAiMode ||
      currentPlayer !== player2Name ||
      winner ||
      tournamentCompleted
    )
      return;

    const getAvailableCells = () => {
      const options = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (!grid[r][c]) options.push({ r, c });
        }
      }
      return options;
    };

    const emptySlots = getAvailableCells();
    if (emptySlots.length === 0) return;

    const aiTimer = setTimeout(() => {
      for (const slot of emptySlots) {
        const testGrid = grid.map((r, rIdx) =>
          rIdx === slot.r
            ? r.map((c, cIdx) => (cIdx === slot.c ? player2Name : c))
            : [...r],
        );
        if (getWinningStreak(testGrid, slot.r, slot.c)) {
          executeMove(slot.r, slot.c, player2Name);
          return;
        }
      }

      for (const slot of emptySlots) {
        const testGrid = grid.map((r, rIdx) =>
          rIdx === slot.r
            ? r.map((c, cIdx) => (cIdx === slot.c ? player1Name : c))
            : [...r],
        );
        if (getWinningStreak(testGrid, slot.r, slot.c)) {
          executeMove(slot.r, slot.c, player2Name);
          return;
        }
      }

      emptySlots.sort((a, b) => Math.abs(a.c - 3) - Math.abs(b.c - 3));
      const chosen = emptySlots[0];
      executeMove(chosen.r, chosen.c, player2Name);
    }, 650);

    return () => clearTimeout(aiTimer);
  }, [
    isAiMode,
    currentPlayer,
    player2Name,
    player1Name,
    grid,
    winner,
    tournamentCompleted,
    executeMove,
    getWinningStreak,
  ]);

  // Turn Countdown Timer
  useEffect(() => {
    if (winner || tournamentCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          sound.playError();
          setCurrentPlayer((curr) =>
            curr === player1Name ? player2Name : player1Name,
          );
          return TURN_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, winner, tournamentCompleted, player1Name, player2Name]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (grid[rowIndex][colIndex] || winner || tournamentCompleted) {
      sound.playError();
      return;
    }
    if (isAiMode && currentPlayer === player2Name) return;

    executeMove(rowIndex, colIndex, currentPlayer);
  };

  const handleUndo = () => {
    if (history.length === 0 || winner) return;
    sound.playUndo();
    const stepBack = isAiMode && history.length >= 2 ? 2 : 1;
    const targetState = history[history.length - stepBack];
    setGrid(targetState.grid);
    setCurrentPlayer(targetState.currentPlayer);
    setTimeLeft(TURN_DURATION);
    setHistory((prev) => prev.slice(0, -stepBack));
  };

  const handleResetTournament = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGrid(createEmptyGrid());
    setPlayer1Score(0);
    setPlayer2Score(0);
    setGamesPlayed(0);
    setWinner(null);
    setWinningCells([]);
    setHistory([]);
    setRoundResults([]);
    setCurrentPlayer(player1Name);
    setTimeLeft(TURN_DURATION);
    setTournamentCompleted(false);
  };

  const handleEndMatch = () => {
    localStorage.removeItem(STORAGE_KEY);
    handleResetTournament();
    navigate('/');
  };

  const isWinningCell = (r, c) => {
    return winningCells.some((cell) => cell.row === r && cell.col === c);
  };

  return (
    <div className="game-layout-container">
      {/* Board */}
      <div className="board-wrapper">
        <div className="board-header-row">
          <div className="board-title-group">
            <h2 className="game-title">Connect Four</h2>
            {isAiMode && <span className="ai-mode-pill">VS AI</span>}
            {!winner && !tournamentCompleted && (
              <div
                className={`turn-timer-pill ${timeLeft <= 5 ? 'timer-urgent' : ''}`}
              >
                <i className="pi pi-clock"></i>
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>
          <button
            className="sound-toggle-btn"
            onClick={toggleSound}
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            <i className={isMuted ? 'pi pi-volume-off' : 'pi pi-volume-up'}></i>
          </button>
        </div>

        <div className="board">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="board-row">
              {row.map((cell, cIdx) => {
                const isHovered =
                  hoveredCell?.r === rIdx &&
                  hoveredCell?.c === cIdx &&
                  !cell &&
                  !winner;
                return (
                  <div
                    key={cIdx}
                    className={`board-cell ${isWinningCell(rIdx, cIdx) ? 'winning-hole' : ''}`}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {cell ? (
                      <div
                        className={`cell-token ${
                          cell === player1Name ? 'player1' : 'player2'
                        } ${isWinningCell(rIdx, cIdx) ? 'winning-token' : ''}`}
                      >
                        {cell === player1Name && player1Photo && (
                          <Avatar
                            image={player1Photo}
                            className="cell-avatar"
                          />
                        )}
                        {cell === player2Name && player2Photo && (
                          <Avatar
                            image={player2Photo}
                            className="cell-avatar"
                          />
                        )}
                      </div>
                    ) : (
                      isHovered && (
                        <div
                          className={`ghost-token ${
                            currentPlayer === player1Name
                              ? 'ghost-p1'
                              : 'ghost-p2'
                          }`}
                        />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Score & Controls */}
      <div className="sidebar-wrapper hud-panel">
        <div className="hud-header">
          <div className="hud-badge">
            <span className="live-dot"></span>{' '}
            {isAiMode ? 'AI CHALLENGE' : 'LIVE MATCH'}
          </div>
          <h3 className="scoreboard-title">Game Arena</h3>
          <p className="round-status">
            Round {Math.min(gamesPlayed + 1, totalgames)} of {totalgames}
          </p>
        </div>

        <div className="players-matchup">
          <div
            className={`player-card-hud p1 ${
              currentPlayer === player1Name && !tournamentCompleted
                ? 'turn-active'
                : ''
            }`}
          >
            <div className="hud-avatar-wrapper">
              <Avatar
                image={player1Photo || undefined}
                icon={!player1Photo ? 'pi pi-user' : undefined}
                className="hud-avatar"
              />
              <span className="token-indicator red-chip"></span>
            </div>
            <div className="hud-player-info">
              <span className="hud-player-name">{player1Name}</span>
              <span className="hud-chip-label">PLAYER 1</span>
            </div>
            <div className="hud-score-counter">
              <span className="score-num">{player1Score}</span>
              <span className="score-label">WINS</span>
            </div>
            {currentPlayer === player1Name && !tournamentCompleted && (
              <span className="turn-tag">YOUR TURN</span>
            )}
          </div>

          <div className="vs-divider">
            <span>VS</span>
          </div>

          <div
            className={`player-card-hud p2 ${
              currentPlayer === player2Name && !tournamentCompleted
                ? 'turn-active'
                : ''
            }`}
          >
            <div className="hud-avatar-wrapper">
              <Avatar
                image={player2Photo || undefined}
                icon={
                  !player2Photo
                    ? isAiMode
                      ? 'pi pi-android'
                      : 'pi pi-user'
                    : undefined
                }
                className="hud-avatar"
              />
              <span className="token-indicator yellow-chip"></span>
            </div>
            <div className="hud-player-info">
              <span className="hud-player-name">{player2Name}</span>
              <span className="hud-chip-label">
                {isAiMode ? 'BOT' : 'PLAYER 2'}
              </span>
            </div>
            <div className="hud-score-counter">
              <span className="score-num">{player2Score}</span>
              <span className="score-label">WINS</span>
            </div>
            {currentPlayer === player2Name && !tournamentCompleted && (
              <span className="turn-tag">
                {isAiMode ? 'THINKING...' : 'YOUR TURN'}
              </span>
            )}
          </div>
        </div>

        {roundResults.length > 0 && (
          <div className="results-log-hud">
            {roundResults.map((msg, idx) => (
              <div key={idx} className="result-item-hud">
                <i className="pi pi-bolt"></i>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        )}

        <div className="hud-actions">
          {!tournamentCompleted ? (
            <>
              <button
                className="btn-hud btn-undo"
                onClick={handleUndo}
                disabled={history.length === 0 || winner !== null}
              >
                <i className="pi pi-undo"></i> Undo Move
              </button>
              <button className="btn-hud btn-danger" onClick={handleEndMatch}>
                <i className="pi pi-power-off"></i> End Match
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-hud btn-play-again"
                onClick={handleResetTournament}
              >
                <i className="pi pi-refresh"></i> Play Next Match
              </button>
              <button
                className="btn-hud btn-undo"
                onClick={() => navigate('/')}
              >
                <i className="pi pi-home"></i> Home Menu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectFourGame;

