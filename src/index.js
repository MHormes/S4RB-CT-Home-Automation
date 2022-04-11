import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainContainer from './components/MainContainer.js';
import Facecommands from './components/Facecommands';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Facecommands/>
    <MainContainer />
       </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);