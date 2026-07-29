import { Alert } from '@mui/material';

const AuthErrorAlert = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ borderRadius: 2 }}>
      {error}
    </Alert>
  );
};

export default AuthErrorAlert;
