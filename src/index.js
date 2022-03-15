import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainContainer from './components/MainContainer.js';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainContainer />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);