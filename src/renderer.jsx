import 'bootstrap/dist/css/bootstrap.css'
import React, {Component} from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

import {createRoot} from 'react-dom/client';
import Navbar from './components/Navbar';
import Card from './components/Card';

import vesuvio from './images/1.jpg';
import campiFlegrei from './images/2.jpg';
import tufoGrigio from './images/3.jpg';
import caserta from './images/4.jpg';
import hirpinia from './images/5.jpg';
import sannio from './images/6.jpg';
import salerno from './images/7.jpg';

import Home from './components/Home';
import Gallery from './components/Gallery';
import ToDo from './components/ToDo';
import MineralClasses from './components/MineralClasses';
import CrystalSystems from './components/CrystalSystems';
import CrystalSystem from './components/CrystalSystem';
import MineralListView from './components/views/MineralListView';
import MineralView from './components/views/MineralView';
import MineralSave from './components/views/MineralSave';

class App extends Component {

  state = {
    cards: [
      {id: 1, name: "Vesuvio", description: "Minerali del Vesuvio", image: vesuvio, quantity: 0},
      {id: 2, name: "Campi Flegrei", description: "Minerali dei Campi Flegrei", image: campiFlegrei, quantity: 0},
      {id: 3, name: "Tufo grigio", description: "Minerali del tufo grigio", image: tufoGrigio, quantity: 0},
      {id: 4, name: "Caserta", description: "Minerali di Caserta", image: caserta, quantity: 0},
      {id: 5, name: "Hirpinia", description: "Minerali dell'Hirpinia", image: hirpinia, quantity: 0},
      {id: 6, name: "Sannio", description: "Minerali del Sannio", image: sannio, quantity: 0},
      {id: 7, name: "Salerno", description: "Minerali di Salerno", image: salerno, quantity: 0},
    ]
  }

  render() {

    /*
    return (
      <>
        <Navbar/>
        <div className='container'>
          <h1>Minerali del Vesuvio</h1>
          <Link to="/gallery">Vai alla Galleria</Link>
          <hr/>
          <div className='row'>
            {this.state.cards.map(card => (
              <Card 
                key={card.id}
                onDelete={this.handleDelete}
                onIncrement={this.handleIncrement}
                card={card}
              />
            ))}
          </div>
        </div>
      </>
    );
    */

    return(

      <HashRouter>
        <Navbar/>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/gallery" style={styles.navLink}>Galleria</Link>
          <Link to="/todo" style={styles.navLink}>To-Do</Link>
          <Link to="/mineralClasses" style={styles.navLink}>Mineral Classes</Link>
          <Link to="/crystalSystems" style={styles.navLink}>Crystal Systems</Link>
          <Link to="/minerals" style={styles.navLink}>Minerali</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/todo" element={<ToDo />} />
          <Route path="/mineralClasses" element={<MineralClasses />} />
          <Route path="/crystalSystems" element={<CrystalSystems />} />
          <Route path="/crystalSystem/:id" element={<CrystalSystem />} />
          <Route path="/minerals" element={<MineralListView />} />
          <Route path="/mineral/:id" element={<MineralView />} />
          <Route path="/mineralSave/:id" element={<MineralSave />} />
        </Routes>
      </HashRouter>
      
    );

  }

  handleDelete = cardId => {
    const cards = this.state.cards.filter(card => card.id !== cardId);
    this.setState({cards: cards});
  }

  handleIncrement = card => {
    const cards = [...this.state.cards];
    const id = cards.indexOf(card);
    cards[id] = {...card};
    cards[id].quantity++;
    this.setState({cards});

  }

  handleOpenWindow () {
    console.log("aprendo la finestra...");
    window.electronAPI.openWindow();
  };
  
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);







// Semplici stili JS per l'esempio
const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif' },
  nav: { background: '#20232a', padding: '10px', display: 'flex', gap: '15px' },
  navLink: { color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' },
  button: { 
    display: 'inline-block', 
    marginTop: '10px', 
    padding: '8px 16px', 
    backgroundColor: '#007acc', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '4px' 
  }

};