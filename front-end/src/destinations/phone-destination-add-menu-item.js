import { useState, forwardRef } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import PhoneDestinationDialog from './phone-destination-dialog';

const PhoneDestinationAddMenuItem = forwardRef(
  (
    {
      channelType,
      label,
      IconComponent,
      title,
      verifyPhoneTitle,
      consent,
      notice,
      phoneNumberRule,
      accessToken,
      onCreated,
      onCloseMenu,
      ...menuItemProps
    },
    ref
  ) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
      <>
        <MenuItem
          ref={ref}
          {...menuItemProps}
          onClick={(event) => {
            onCloseMenu();
            setDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <IconComponent />
          </ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
        <PhoneDestinationDialog
          open={dialogOpen}
          channelType={channelType}
          addPhonePageTitle={title}
          verifyPhoneTitle={verifyPhoneTitle}
          consent={consent}
          notice={notice}
          phoneNumberRule={phoneNumberRule}
          onClose={() => setDialogOpen(false)}
          onCreated={onCreated}
        />
      </>
    );
  }
);

PhoneDestinationAddMenuItem.displayName = 'PhoneDestinationAddMenuItem';

export default PhoneDestinationAddMenuItem;
