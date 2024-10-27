import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Avatar } from 'primereact/avatar';
import './App.css'; // Include your custom CSS here
import { useNavigate } from 'react-router-dom';
import 'primeicons/primeicons.css'; // Import PrimeIcons CSS

const GameSetting = () => {
  const [showPlayer1Dialog, setShowPlayer1Dialog] = useState(false);
  const [showPlayer2Dialog, setShowPlayer2Dialog] = useState(false);
  const [showGamesDialog, setShowGamesDialog] = useState(false);
  const [showStarterDialog, setShowStarterDialog] = useState(false);
  const navigate = useNavigate();
  const [player1Photo, setPlayer1Photo] = useState(null);
  const [player2Photo, setPlayer2Photo] = useState(null);
  const [player1Name, setPlayer1Name] = useState('David');
  const [player2Name, setPlayer2Name] = useState('Maria');
  const [numberOfGames, setNumberOfGames] = useState(2);
  const [whoStarts, setWhoStarts] = useState('Alternative Turn');
  const [tempNumberOfGames, setTempNumberOfGames] = useState(numberOfGames);
  const [tempWhoStarts, setTempWhoStarts] = useState(whoStarts);

  const handlePlayer1PhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayer1Photo(reader.result); // Store the image as a data URL
      };
      reader.readAsDataURL(file); // Convert file to base64-encoded URL
    }
  };

  const handlePlayer2PhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayer2Photo(reader.result); // Store the image as a data URL
      };
      reader.readAsDataURL(file); // Convert file to base64-encoded URL
    }
  };
  const startGame = () => {
    navigate('/Connectfourgame', { state: { player1Name , player1Photo, player2Name , player2Photo , totalgames: tempNumberOfGames , whostart: tempWhoStarts  } });
    alert('Game Started');
  };
  
  const handleSetGames = () => {
    setNumberOfGames(tempNumberOfGames);
    setShowGamesDialog(false); // Hide dialog after setting
  };
  
  const handleSetStarter = () => {
    setWhoStarts(tempWhoStarts); // Update the main state
    setShowStarterDialog(false); // Close the dialog
  };
  
  return (
    <div className="game-container">
      <h1 className="header">Two Players Game</h1>
      <div className="game-info-1 ">
        <div className="player-info">
        {player1Photo ? (
          // If an image is uploaded, show it
          <Avatar 
           image={player1Photo} 
           className="avatar"
           onClick={() => document.getElementById('upload-player1-photo').click()} 
           />
        ) : (
          // Otherwise, show the default icon
          <Avatar 
          icon="pi pi-user-minus" 
          className="avatar player1-default" 
          onClick={() => document.getElementById('upload-player1-photo').click()}
          />
        )}
        </div>

        <div className="player-details" onClick={() => setShowPlayer1Dialog(true)}>
            <h3>Player Name 1</h3>
            <p>{player1Name}</p>
        </div>
        <input
        type="file"
        accept="image/*"
        onChange={handlePlayer1PhotoUpload}
        style={{ display: 'none' }} // Hide the default file input
        id="upload-player1-photo"
       />
      </div>
      <div className="game-info-2 ">
      <div className="player-info">
        {player2Photo ? (
          // If an image is uploaded, show it
          <Avatar 
           image={player2Photo} 
           className="avatar"
           onClick={() => document.getElementById('upload-player2-photo').click()} 
           />
        ) : (
          // Otherwise, show the default icon
          <Avatar 
          icon="pi pi-android" 
          className="avatar player2-default" 
          onClick={() => document.getElementById('upload-player2-photo').click()}
          />
        )}
      </div>
          <div className="player-details" onClick={() => setShowPlayer2Dialog(true)}>
            <h3>Player Name 2</h3>
            <p>{player2Name}</p>
        </div>
        <input
        type="file"
        accept="image/*"
        onChange={handlePlayer2PhotoUpload}
        style={{ display: 'none' }} // Hide the default file input
        id="upload-player2-photo"
      />
      </div>
      <div className="game-info-3" onClick={() => setShowGamesDialog(true)} >
        <div className="player-info" >
          <Avatar 
          icon="pi pi-trophy icon" 
          style={{ fontSize: '1.0rem' }} 
          className="avatar trophy" 
          />
         </div>  
         <div className="player-details">
            <h3>Select No.of  Games</h3> 
            <p>{tempNumberOfGames} Games</p>
         </div>
      </div>

      <div className="game-info-4" onClick={() => setShowStarterDialog(true)}>
         <div className="player-info" >
          <Avatar icon="pi pi-play icon" style={{ fontSize: '1.0rem' }} className="avatar" />
         </div>
         <div className="player-details">
         <h3>Who Starts</h3>
         <p>{tempWhoStarts}</p>
        </div>
      </div>


      <Button label="Start Game" className="start-btn" onClick={startGame} />

      {/* Player 1 Dialog */}
      <Dialog
        header="Set Player 1 Name"
        visible={showPlayer1Dialog}
        onHide={() => setShowPlayer1Dialog(false)}
        style={{ backgroundColor: '#f0f0f0',width: '300px' }}
      >
        <input
          type="text"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
          className="p-inputtext"
        />
        <br />
        <Button label="Set Name" onClick={() => setShowPlayer1Dialog(false)} />
      </Dialog>

      {/* Player 2 Dialog */}
      <Dialog  
        header="Set Player 2 Name"
        visible={showPlayer2Dialog}
        onHide={() => setShowPlayer2Dialog(false)}
        style={{ backgroundColor: '#f0f0f0' , width: '300px' }}
      >
        <input
          type="text"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
          className="p-inputtext"
        /> <br />
        <Button label="Set Name" onClick={() => setShowPlayer2Dialog(false)} />
      </Dialog>

      {/* Number of Games Dialog */}
      <Dialog className='dilog'
        header="Select Number of Games"
        visible={showGamesDialog}
        onHide={() => setShowGamesDialog(false)}
        onShow={() => setTempNumberOfGames(numberOfGames)}
      >
        {[2, 3, 5, 10].map((game) => (         
          <div 
            key={game} 
            className="radio-item"
            onClick={() => setTempNumberOfGames(game)}
            >
            <RadioButton
              value={game}
              onChange={(e) => setTempNumberOfGames(e.value)}
              checked={tempNumberOfGames === game}
            />
            <label style={{ marginLeft: '10px' }}>{game} Games</label>
          </div>
        ))}
        <div className="button-container" >
          <Button label="Set" onClick={handleSetGames} />
          <Button label="Cancel" onClick={() => {
            setTempNumberOfGames(numberOfGames);
            setShowGamesDialog(false)
            }} className="cancel-button"/>
        </div>
      </Dialog>
      
      {/* Who Starts Dialog */}
      <Dialog className='dilog'
        header="Who Starts"
        visible={showStarterDialog}
        onHide={() => setShowStarterDialog(false)}
        onShow={() => setTempWhoStarts(whoStarts)}
        style={{ backgroundColor: '#f0f0f0' }}
      >
        {['Player 01', 'Player 02', 'Winner1st','Looser1st'].map((starter) => (
          <div 
            key={starter} 
            className="radio-item"
            onClick={()=> setTempWhoStarts(starter)}
            >
            <RadioButton
              value={starter}
              onChange={(e) =>  setTempWhoStarts(e.value)}
              checked={tempWhoStarts === starter}
            />
            <label>{starter}</label>
          </div>
        ))}
        <div className="button-container">
          <Button label="Set" onClick={handleSetStarter} />
          <Button label="Cancel" onClick={() =>{ 
            setTempWhoStarts(whoStarts)
            setShowStarterDialog(false)
          }} className="cancel-button"/>
        </div>
      </Dialog>
    </div>
  );
};

export default GameSetting;