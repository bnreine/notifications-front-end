import { CircularProgress, Stack } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router';
import { ErrorSnackbarProvider } from './common/error-snackbar-context.js';
// import { IndexContextProvider } from '../index-provider.jsx';
import { useSessionContext } from './session-context.js';

const AuthGuard = () => {
  const { accessToken, isSessionLoading } = useSessionContext();
  const location = useLocation();

  if (isSessionLoading) {
    return (
      <Stack
        sx={{
          width: '100%',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={28} />
      </Stack>
    );
  }

  if (!accessToken) {
    return (
      <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
    );
  }

  return (
    <ErrorSnackbarProvider>
      {/*<IndexContextProvider>*/}
      <Outlet />
      {/*</IndexContextProvider>*/}
    </ErrorSnackbarProvider>
  );
};

export default AuthGuard;
