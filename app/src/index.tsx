import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
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

const StyledContainer = styled(Container)`
  background-color: white;
  height: 100vh;
  padding-left: 0;
  padding-right: 0;
`;

ReactDOM.render(
  <React.StrictMode>
    <StyledContainer maxWidth="sm">
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
    </StyledContainer>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
