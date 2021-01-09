import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Web3Provider } from './context/Web3';
import { SootProvider } from './context/Soot';
import { App } from './components/App';
import { IpfsProvider } from './context/IPFS';
import { EventsProvider } from './context/Event';
import { ToastProvider } from './context/Toast';
import Container from '@material-ui/core/Container';
import { ContextAwareApp } from './components/ContextAwarApp';

ReactDOM.render(
  <React.StrictMode>
    <Container maxWidth="sm" style={{ backgroundColor: 'white', height: '100vh', paddingLeft: 0, paddingRight: 0 }}>
      <ToastProvider>
        <Web3Provider>
          <SootProvider>
            <IpfsProvider>
              <EventsProvider>
                <ContextAwareApp>
                  <App />
                </ContextAwareApp>
              </EventsProvider>
            </IpfsProvider>
          </SootProvider>
        </Web3Provider>
      </ToastProvider>
    </Container>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
