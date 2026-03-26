import 'bootstrap/dist/css/bootstrap.css'
import React, {Component} from 'react';

import {createRoot} from 'react-dom/client';
import Navbar from './components/Navbar';

class About extends Component {

  render() {

    return (
      <>
        <Navbar/>
        <div className='container'>
          <h1>About</h1>
          <hr/>
          Coming soon...
        </div>
      </>
    );

  }

}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<About/>);
