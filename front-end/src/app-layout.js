import { Stack } from '@mui/material';
import { Outlet } from 'react-router';
import LeftNav from './left-nav';

const AppLayout = () => {
  return (
    <Stack
      direction="row"
      sx={{
        height: '100vh',
      }}
    >
      <LeftNav />
      <Stack
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        <Outlet />
      </Stack>
    </Stack>
  );
};

export default AppLayout;
