import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Avatar } from 'primereact/avatar';

const GameSetting = () => {
  const navigate = useNavigate();

  const [player1Name, setPlayer1Name] = useState('David');
  const [player2Name, setPlayer2Name] = useState('Maria');
  const [player1Photo, setPlayer1Photo] = useState(null);
  const [player2Photo, setPlayer2Photo] = useState(null);
  const [numberOfGames, setNumberOfGames] = useState(2);
  const [whoStarts, setWhoStarts] = useState('Alternative Turn');

  // Dialog visibility states
  const [showP1Dialog, setShowP1Dialog] = useState(false);
  const [showP2Dialog, setShowP2Dialog] = useState(false);
  const [showGamesDialog, setShowGamesDialog] = useState(false);
  const [showStarterDialog, setShowStarterDialog] = useState(false);

  // Temporary dialog edit states
  const [tempP1Name, setTempP1Name] = useState(player1Name);
  const [tempP2Name, setTempP2Name] = useState(player2Name);
  const [tempGames, setTempGames] = useState(numberOfGames);
  const [tempStarter, setTempStarter] = useState(whoStarts);

  const handlePhotoUpload = (e, setPhoto) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleStartGame = () => {
    navigate('/Connectfourgame', {
      state: {
        player1Name,
        player1Photo,
        player2Name,
        player2Photo,
        totalgames: numberOfGames,
        whostart: whoStarts,
      },
    });
  };

  return (
    <div className="modern-setup-card">
      {/* Header */}
      <div className="setup-header">
        <button
          className="setup-back-btn"
          onClick={() => navigate('/')}
          title="Back to menu"
        >
          <i className="pi pi-arrow-left"></i>
        </button>
        <div className="setup-title-box">
          <span className="setup-pill-badge">CONFIG ARENA</span>
          <h2 className="setup-main-title">Two Players Match</h2>
        </div>
      </div>

      {/* Settings Grid / Stack */}
      <div className="setup-items-stack">
        {/* Player 1 Card */}
        <div className="setup-row-card">
          {/* Avatar Click: Photo upload ONLY (stopPropagation prevents name edit modal) */}
          <div
            className="setup-avatar-disc p1-disc"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('p1-photo-input').click();
            }}
            title="Click to change avatar photo"
          >
            <Avatar
              image={player1Photo || undefined}
              icon={!player1Photo ? 'pi pi-user' : undefined}
              className="setup-inner-avatar"
            />
            <span className="disc-chip-dot p1-dot"></span>
          </div>

          {/* Name & Label Click: Edit Name */}
          <div
            className="setup-row-details"
            onClick={() => {
              setTempP1Name(player1Name);
              setShowP1Dialog(true);
            }}
            title="Click to edit name"
          >
            <span className="setup-row-tag">PLAYER 1 &bull; RED</span>
            <span className="setup-row-value">{player1Name}</span>
          </div>

          {/* Pencil Icon Click: Edit Name */}
          <div
            className="setup-action-icon"
            onClick={() => {
              setTempP1Name(player1Name);
              setShowP1Dialog(true);
            }}
            title="Edit name"
          >
            <i className="pi pi-pencil"></i>
          </div>

          <input
            id="p1-photo-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handlePhotoUpload(e, setPlayer1Photo)}
          />
        </div>

        {/* Player 2 Card */}
        <div className="setup-row-card">
          {/* Avatar Click: Photo upload ONLY */}
          <div
            className="setup-avatar-disc p2-disc"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('p2-photo-input').click();
            }}
            title="Click to change avatar photo"
          >
            <Avatar
              image={player2Photo || undefined}
              icon={!player2Photo ? 'pi pi-android' : undefined}
              className="setup-inner-avatar"
            />
            <span className="disc-chip-dot p2-dot"></span>
          </div>

          {/* Name & Label Click: Edit Name */}
          <div
            className="setup-row-details"
            onClick={() => {
              setTempP2Name(player2Name);
              setShowP2Dialog(true);
            }}
            title="Click to edit name"
          >
            <span className="setup-row-tag">PLAYER 2 &bull; YELLOW</span>
            <span className="setup-row-value">{player2Name}</span>
          </div>

          {/* Pencil Icon Click: Edit Name */}
          <div
            className="setup-action-icon"
            onClick={() => {
              setTempP2Name(player2Name);
              setShowP2Dialog(true);
            }}
            title="Edit name"
          >
            <i className="pi pi-pencil"></i>
          </div>

          <input
            id="p2-photo-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handlePhotoUpload(e, setPlayer2Photo)}
          />
        </div>

        {/* Tournament Length */}
        <div
          className="setup-row-card"
          onClick={() => {
            setTempGames(numberOfGames);
            setShowGamesDialog(true);
          }}
        >
          <div className="setup-avatar-disc trophy-disc">
            <i className="pi pi-trophy"></i>
          </div>
          <div className="setup-row-details">
            <span className="setup-row-tag">TOURNAMENT LENGTH</span>
            <span className="setup-row-value">{numberOfGames} Games</span>
          </div>
          <div className="setup-action-icon">
            <i className="pi pi-chevron-right"></i>
          </div>
        </div>

        {/* Who Starts */}
        <div
          className="setup-row-card"
          onClick={() => {
            setTempStarter(whoStarts);
            setShowStarterDialog(true);
          }}
        >
          <div className="setup-avatar-disc play-disc">
            <i className="pi pi-play"></i>
          </div>
          <div className="setup-row-details">
            <span className="setup-row-tag">FIRST MOVE RULE</span>
            <span className="setup-row-value">{whoStarts}</span>
          </div>
          <div className="setup-action-icon">
            <i className="pi pi-chevron-right"></i>
          </div>
        </div>
      </div>

      {/* Launch Button */}
      <button className="setup-launch-btn" onClick={handleStartGame}>
        <span>Start Game</span>
        <i className="pi pi-arrow-right"></i>
      </button>

      {/* Player 1 Name Dialog */}
      <Dialog
        header="Change Player 1 Name"
        visible={showP1Dialog}
        className="game-dialog"
        onHide={() => setShowP1Dialog(false)}
      >
        <input
          type="text"
          value={tempP1Name}
          onChange={(e) => setTempP1Name(e.target.value)}
          className="dialog-input"
          placeholder="Enter player 1 name"
          autoFocus
        />
        <div className="dialog-actions">
          <Button
            label="Cancel"
            className="p-button-text"
            onClick={() => setShowP1Dialog(false)}
          />
          <Button
            label="Save"
            onClick={() => {
              if (tempP1Name.trim()) setPlayer1Name(tempP1Name.trim());
              setShowP1Dialog(false);
            }}
          />
        </div>
      </Dialog>

      {/* Player 2 Name Dialog */}
      <Dialog
        header="Change Player 2 Name"
        visible={showP2Dialog}
        className="game-dialog"
        onHide={() => setShowP2Dialog(false)}
      >
        <input
          type="text"
          value={tempP2Name}
          onChange={(e) => setTempP2Name(e.target.value)}
          className="dialog-input"
          placeholder="Enter player 2 name"
          autoFocus
        />
        <div className="dialog-actions">
          <Button
            label="Cancel"
            className="p-button-text"
            onClick={() => setShowP2Dialog(false)}
          />
          <Button
            label="Save"
            onClick={() => {
              if (tempP2Name.trim()) setPlayer2Name(tempP2Name.trim());
              setShowP2Dialog(false);
            }}
          />
        </div>
      </Dialog>

      {/* Games Dialog */}
      <Dialog
        header="Select Number of Games"
        visible={showGamesDialog}
        className="game-dialog"
        onHide={() => setShowGamesDialog(false)}
      >
        {[2, 3, 5, 10].map((num) => (
          <div
            key={num}
            className="radio-row"
            onClick={() => setTempGames(num)}
          >
            <RadioButton
              value={num}
              checked={tempGames === num}
              onChange={(e) => setTempGames(e.value)}
            />
            <span className="radio-label">{num} Games</span>
          </div>
        ))}
        <div className="dialog-actions">
          <Button
            label="Cancel"
            className="p-button-text"
            onClick={() => setShowGamesDialog(false)}
          />
          <Button
            label="Confirm"
            onClick={() => {
              setNumberOfGames(tempGames);
              setShowGamesDialog(false);
            }}
          />
        </div>
      </Dialog>

      {/* Starter Dialog */}
      <Dialog
        header="Who Starts First?"
        visible={showStarterDialog}
        className="game-dialog"
        onHide={() => setShowStarterDialog(false)}
      >
        {['Player 01', 'Player 02', 'Winner1st', 'Alternative Turn'].map(
          (option) => (
            <div
              key={option}
              className="radio-row"
              onClick={() => setTempStarter(option)}
            >
              <RadioButton
                value={option}
                checked={tempStarter === option}
                onChange={(e) => setTempStarter(e.value)}
              />
              <span className="radio-label">{option}</span>
            </div>
          ),
        )}
        <div className="dialog-actions">
          <Button
            label="Cancel"
            className="p-button-text"
            onClick={() => setShowStarterDialog(false)}
          />
          <Button
            label="Confirm"
            onClick={() => {
              setWhoStarts(tempStarter);
              setShowStarterDialog(false);
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default GameSetting;
