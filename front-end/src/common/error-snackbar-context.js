import { Alert, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useState } from 'react';
// import { LEFT_NAV_WIDTH } from '../left-nav/left-nav-width.js';

const LEFT_NAV_WIDTH = 48;

const errorSnackbarContext = createContext({ showError: () => {} });

const useErrorSnackbar = () => useContext(errorSnackbarContext);

const ErrorSnackbarProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const showError = useCallback((errorMessage) => {
    setMessage(errorMessage);
    setOpen(true);
  }, []);

  const handleClose = useCallback((_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }, []);

  return (
    <errorSnackbarContext.Provider value={{ showError }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          left: `${LEFT_NAV_WIDTH + 16}px !important`,
          bottom: 24,
        }}
      >
        <Alert severity="error" variant="filled" onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </errorSnackbarContext.Provider>
  );
};

export { ErrorSnackbarProvider, useErrorSnackbar };
