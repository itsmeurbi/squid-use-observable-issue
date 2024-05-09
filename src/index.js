import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SquidContextProvider } from '@squidcloud/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SquidContextProvider
    options={{
      appId: 'CHANGE_ME',
      region: 'CHANGE_ME',
      environmentId: 'dev'
    }}
  >
    <App />
  </SquidContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
