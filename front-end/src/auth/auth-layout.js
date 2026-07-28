import { Card, Stack } from '@mui/material';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <Stack
      sx={{
        width: '100%',
        minHeight: '100vh',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        p: 4,
        overflow: 'hidden',
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <Outlet />
      </Card>
    </Stack>
  );
};

export default AuthLayout;
