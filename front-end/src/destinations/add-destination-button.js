import { useState } from 'react';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import channelTypeRegistry from './channel-type-registry';
import PhoneDestinationDialog from './phone-destination-dialog';

const CHANNEL_OPTIONS = [
  { channelType: 'slack', label: 'Slack' },
  { channelType: 'whatsapp', label: 'WhatsApp' },
  { channelType: 'sms', label: 'SMS' },
];

const AddDestinationButton = ({ accessToken, onCreated }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [phoneChannelType, setPhoneChannelType] = useState(null);

  const handleSelectChannel = (channelType) => {
    setMenuAnchor(null);

    if (channelType === 'slack') {
      console.log('slack handler');
      return;
    }

    setPhoneChannelType(channelType);
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
        onClose={() => setMenuAnchor(null)}
      >
        {CHANNEL_OPTIONS.map(({ channelType, label }) => {
          const IconComponent = channelTypeRegistry[channelType].IconComponent;

          return (
            <MenuItem
              key={channelType}
              onClick={() => handleSelectChannel(channelType)}
            >
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
      {phoneChannelType ? (
        <PhoneDestinationDialog
          open
          channelType={phoneChannelType}
          accessToken={accessToken}
          onClose={() => setPhoneChannelType(null)}
          onCreated={onCreated}
        />
      ) : null}
    </>
  );
};

export default AddDestinationButton;
