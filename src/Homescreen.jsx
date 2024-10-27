import React from 'react';
import { Link } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css'; // Choose a theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; 
import { Button } from 'primereact/button';

const Homescreen =()=> {
  return (
    <div className='connect-four'>
      <h1><center>CONNECT FOUR!</center></h1>
      <center><p>Play with other players around the world.</p></center>
      <img 
        src="/4C.jpeg" // Replace with your image path
        alt="Connect Four Game" 
        style={{ width: '400px', height: 'auto', display: 'block', margin: '0 auto' }} // Adjust styles as needed
      />   
      <div className='buttons-grid'>
        <Button label="Three Players" icon="pi pi-user" className="coming-soon-btn">
            <span className="button-content">
               <span className="coming-soon">Coming Soon</span>
            </span>
        </Button>
        <Link to="/Gamesetting" className="grid-link">
          <Button label="Two Players" icon="pi pi-user-plus" className="button-content">
            <span className="button-content">
            </span>
          </Button>
        </Link>
        <Button label="Custom Game" icon="pi pi-cog" className="coming-soon-btn">
          <span className="button-content">
            <span className="coming-soon">Coming Soon</span>
          </span>
        </Button>
        <Button label="Training Game" icon="pi pi-book" className="coming-soon-btn">
          <span className="button-content">
            <span className="coming-soon">Coming Soon</span>
          </span>
        </Button>
     </div>
    </div>
  )
};

export default Homescreen;
