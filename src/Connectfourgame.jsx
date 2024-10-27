import React, { useState } from "react";
import './App.css';
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar } from 'primereact/avatar';
const ROWS = 6;
const COLS = 7;
var player1score=0;
var player2score=0;
var gamesplayed=0;
var roundlooser=null;
var roundwinner=null;

const ConnectFourGame = () => {
  const location=useLocation();
  const navigate = useNavigate();
  const { player1Name ,player1Photo,  player2Name ,player2Photo,  totalgames , whostart } = location.state;
  const initialPlayer = whostart === player1Name || whostart === player2Name ? whostart : player1Name;
  const [grid, setGrid] = useState(Array(ROWS).fill(Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(initialPlayer);  // Player 1: red, Player 2: yellow
  const [winner, setWinner] = useState(null);
  const [history,setHistory]=useState([]);
  const [undoDisabled, setUndoDisabled] = useState(true);
  const [roundResults, setRoundResults] = useState([]); 
  
  const resetTournament = () => {
    player1score = 0;
    player2score = 0;
    gamesplayed = 0;
    roundlooser = null;
    setGrid(Array(ROWS).fill(Array(COLS).fill(null)));
    setCurrentPlayer(initialPlayer); // Reset to initial player
    setWinner(null);
    setHistory([]);
    setRoundResults([]);
    setUndoDisabled(true);
  };
  // Handle player click
  const handleClick = (row,col) => {
    if (winner || grid[row][col] !== null) return ; 
      
    // If game is already won, no more moves allowed
    setHistory([...history,{grid,currentPlayer}]);
                // update the specific grid cell that clicked
    const newGrid = grid.map((r,rowIndex) => 
      rowIndex === row ? r.map((cell,colIndex) =>
      colIndex === col ? currentPlayer : cell 
    ) : r
    );
  
    setGrid(newGrid);
     // Check for win
    if (checkForWin(newGrid, row, col) ) { 
      if (currentPlayer === player1Name) {
         player1score=player1score+1;
         roundwinner=player1Name;
         roundlooser=player2Name;
      } else {
         player2score=player2score+1;
         roundwinner=player2Name;
         roundlooser=player1Name;
      }
       setRoundResults([...roundResults, `Round ${gamesplayed + 1}: ${currentPlayer} wins!`]);
       setWinner(currentPlayer);
       setTimeout(() => {
        resetGame(gamesplayed + 1);
      }, 500); 
    } 
    else if (newGrid.every(row => row.every(cell => cell != null))){
      setRoundResults((prevResults) => [
        ...prevResults,
        `Round ${gamesplayed + 1}: It's a Draw!`,
      ]);
      resetGame(gamesplayed + 1);
      setUndoDisabled(false);
    }
    else {
      setCurrentPlayer(currentPlayer === player1Name ? player2Name : player1Name);
      setUndoDisabled(false); 
    }
  };
  const checkForWin = (grid, row, col) => {
    return (
      checkDirection(grid, row, col, 1, 0) ||  // Horizontal
      checkDirection(grid, row, col, 0, 1) ||  // Vertical
      checkDirection(grid, row, col, 1, 1) ||  // Diagonal /
      checkDirection(grid, row, col, 1, -1)    // Diagonal \
    );
  };

  // Check a direction (e.g., horizontal) for 4 connected dots
  const checkDirection = (grid, row, col, rowStep, colStep) => {
    let count = 0;
    let player = grid[row][col];

    for (let step = -3; step <= 3; step++) {
      let newRow = row + step * rowStep;
      let newCol = col + step * colStep;
      if (
        newRow >= 0 &&
        newRow < ROWS &&
        newCol >= 0 &&
        newCol < COLS &&
        grid[newRow][newCol] === player
      ) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  // Reset the game
  const resetGame = (updatedgamesplayeded) => {
    if (updatedgamesplayeded === totalgames) {
      declareTournamentWinner();
    } else {
      setGrid(Array(ROWS).fill(Array(COLS).fill(null)));
      setWinner(null);
      setUndoDisabled(true);
      setHistory([]);
      gamesplayed = updatedgamesplayeded;
      if(updatedgamesplayeded < totalgames){
        switch (whostart){
          case player1Name: 
             setCurrentPlayer(player1Name); 
             break;
          case player2Name: 
             setCurrentPlayer(player2Name);
              break;
          case "Winner1st": 
              setCurrentPlayer(roundwinner);
              break;
          case "Looser1st": 
             setCurrentPlayer(roundlooser);
             break;
          default : setCurrentPlayer(currentPlayer);
        }
      }
    }
  };
  
  const declareTournamentWinner = () => {
    let finalResult;
    if (player1score > player2score) {
      finalResult = `Tournament Winner: ${player1Name} with ${player1score} wins!`;
    } else if (player2score > player1score) {
      finalResult = `Tournament Winner: ${player2Name} with ${player2score} wins!`;
    } else {
      finalResult = "Tournament Result: It's a tie!";
    }
    setRoundResults((prevResults) => [...prevResults, finalResult]);
  };
  // Undo last move
  const undoMove = () => { 
    if(history.length === 0) return;
    const previousStare=history[history.length-1];
    setGrid(previousStare.grid)
    setCurrentPlayer(previousStare.currentPlayer);
    setHistory(history.slice(0,-1));
  };

  return (
    <div className="container">
      <div className="game-board">
        <h1>Connect Four Game</h1>
       <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
               <div
               key={colIndex}
               className={`cell ${cell === null ? 'empty' : cell === player1Name ? 'player1' : 'player2'}`}
               onClick={() => handleClick(rowIndex, colIndex)}
             >
               {cell === player1Name && (
                 <Avatar image={player1Photo} icon={!player1Photo && 'pi pi-user-minus'} className="avatar player1-default" />
               )}
               {cell === player2Name && (
                 <Avatar image={player2Photo} icon={!player2Photo && 'pi pi-android'} className="avatar player2-default" />
               )}
             </div>
            ))}
          </div>
        ))}
        </div>
      </div>
      <div className="score-card">
        <h2>Score Table</h2>
        <p>Round: {gamesplayed + 1}</p>

        {roundResults.map((result, index) => (
          <p key={index} style={{ color: "red" }}>{result}</p>
        ))}
      <div className="player-box-1">
        <Avatar 
        image={player1Photo || ''} 
        icon={!player1Photo && 'pi pi-user-minus'} 
        className={`avatar ${currentPlayer === player1Name ? 'highlight' : ''}`}
         />
        <h3>{player1Name}</h3>
        <p>Score: {player1score}</p>
      </div>
      <div className="player-box-2">
        <Avatar 
        image={player2Photo || ''} 
        icon={!player2Photo && 'pi pi-android'} 
        className={`avatar ${currentPlayer === player2Name ? 'highlight' : ''}`}  
        />
        <h3>{player2Name}</h3>
        <p>Score: {player2score}</p>
      </div>
       <button onClick={()=>{
        resetTournament();
        navigate("/")
        }}>End Tournament</button>
       <br />
       <button onClick={undoMove} disabled={undoDisabled || history.length === 0 || winner !=null} >Undo Move</button>
        </div>
      </div>
  );
};

export default ConnectFourGame;