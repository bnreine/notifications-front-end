import { useState } from 'react';
import { Button, Menu } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import channelTypeRegistry from './channel-type-registry';

const ADDABLE_CHANNEL_TYPES = ['slack', 'whatsapp', 'sms'];

const AddDestinationButton = ({ accessToken, onCreated }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        aria-label="Add destination"
        aria-haspopup="true"
        aria-expanded={Boolean(menuAnchor)}
      >
        Add
      </Button>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        keepMounted
      >
        {ADDABLE_CHANNEL_TYPES.map((channelType) => {
          const AddMenuItem = channelTypeRegistry[channelType].AddMenuItem;

          return (
            <AddMenuItem
              key={channelType}
              accessToken={accessToken}
              onCreated={onCreated}
              onCloseMenu={handleCloseMenu}
            />
          );
        })}
      </Menu>
    </>
  );
};

export default AddDestinationButton;
