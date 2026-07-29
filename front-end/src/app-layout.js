import { CircularProgress, Stack } from '@mui/material';
import { Outlet } from 'react-router';
// import { useIndexContext } from './index-context.jsx';
// import LeftNav from './left-nav/left-nav.jsx';

const AppLayout = () => {
  // const { isIndexLoading } = useIndexContext();

  // if (isIndexLoading) {
  //     return (
  //         <Stack
  //             sx={{
  //                 width: '100%',
  //                 height: '100vh',
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //             }}
  //         >
  //             <CircularProgress size={28} />
  //         </Stack>
  //     );
  // }

  return (
    <Stack
      direction="row"
      sx={{
        height: '100vh',
      }}
    >
      {/*<LeftNav />*/}
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
