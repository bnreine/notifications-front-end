import { Drawer, Button } from '@mui/material';
import { Link } from 'react-router';

const LeftNav = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 230,
        '& .MuiDrawer-paper': {
          width: 230,
        },
      }}
    >
      <Link to={'/configurations'}>
        <Button>Configurations</Button>
      </Link>
      <Link to={'/destinations'}>
        <Button>Destinations</Button>
      </Link>
    </Drawer>
  );
};

export default LeftNav;
