import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import './epgChannel.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import EpgWrapper from './EpgWrapper';

ReactDOM.render(
  <React.StrictMode>
    <EpgWrapper />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function

reportWebVitals();
