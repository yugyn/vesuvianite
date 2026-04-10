import './i18n';
import './styles/main.scss';
import { Component } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

import {createRoot} from 'react-dom/client';

import Home from './components/Home';

import TrashListView from './components/views/TrashListView';
import TrashView from './components/views/TrashView';

import Gallery from './components/Gallery';
import ToDo from './components/ToDo';
import MineralClasses from './components/MineralClasses';
import CrystalSystems from './components/CrystalSystems';
import CrystalSystem from './components/CrystalSystem';
import MineralListView from './components/views/MineralListView';
import MineralView from './components/views/MineralView';
import MineralFormView from './components/views/MineralFormView';

import SellerListView from './components/views/SellerListView';
import SellerView from './components/views/SellerView';
import SellerFormView from './components/views/SellerFormView';
import ContainerListView from './components/views/ContainerListView';
import ContainerView from './components/views/ContainerView';
import ContainerFormView from './components/views/ContainerFormView';

import Layout from './components/Layout';

class App extends Component {

  render() {

    return(

      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/trashes" element={<TrashListView />} />
            <Route path="/trash/:element" element={<TrashView />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/todo" element={<ToDo />} />
            <Route path="/mineralClasses" element={<MineralClasses />} />
            <Route path="/crystalSystems" element={<CrystalSystems />} />
            <Route path="/crystalSystem/:id" element={<CrystalSystem />} />
            <Route path="/minerals" element={<MineralListView />} />
            <Route path="/mineral/:id" element={<MineralView />} />
            <Route path="/mineralForm/:id" element={<MineralFormView />} />
            <Route path="/sellers" element={<SellerListView />} />
            <Route path="/seller/:id" element={<SellerView />} />
            <Route path="/sellerForm/:id" element={<SellerFormView />} />
            <Route path="/containers" element={<ContainerListView />} />
            <Route path="/container/:id" element={<ContainerView />} />
            <Route path="/containerForm/:id" element={<ContainerFormView />} />
          </Route>          
        </Routes>
      </HashRouter>
      
    );

  }

}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);

