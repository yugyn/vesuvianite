import './i18n';
import './styles/main.scss';
import React, {Component} from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

import {createRoot} from 'react-dom/client';
import Navbar from './components/Navbar';

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

  render() {

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

}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);







const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif' },
  nav: { background: '#20232a', padding: '10px', display: 'flex', gap: '15px' },
  navLink: { color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' },

};