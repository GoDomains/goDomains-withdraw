import Router from './routes';
import React from 'react';
import ThemeConfig from './theme';
import { GlobalAppStateProvider } from 'state';
import { Web3ReactProvider } from '@web3-react/core';
import { getWeb3Library } from './helpers/web3';
import { SnackbarProvider } from 'notistack';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

function App() {
  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  return (
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <ThemeConfig>
        <SnackbarProvider
          ref={notistackRef}
          action={(key) => (
            <IconButton onClick={onClickDismiss(key)}>
              <CancelIcon />
            </IconButton>
          )}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <GlobalAppStateProvider>
            <Router />
          </GlobalAppStateProvider>
        </SnackbarProvider>
      </ThemeConfig>
    </Web3ReactProvider>
  );
}

export default App;
