import { forwardRef, useEffect } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useAsync } from 'react-async';
import IconComponent from '../icon-component';
import slackSvg from '../../../assets/icons/slack.svg';
import { useErrorSnackbar } from '../../common/error-snackbar-context';
import { openSlackOAuthPopup, startSlackOAuth } from './start-slack-oauth';

const SlackAddMenuItem = forwardRef(
  ({ accessToken, onCreated, onCloseMenu, ...menuItemProps }, ref) => {
    const { showError } = useErrorSnackbar();

    const { run: runSlackOAuth, isPending: isStartingSlack } = useAsync({
      deferFn: startSlackOAuth,
      accessToken,
      onReject: (error) => {
        showError(error.message || 'Failed to connect Slack');
      },
    });

    const handleClick = (event) => {
      onCloseMenu();

      if (isStartingSlack) {
        return;
      }

      const popup = openSlackOAuthPopup();

      if (!popup) {
        showError('Allow popups to connect Slack');
        return;
      }

      runSlackOAuth(popup);
    };

    useEffect(() => {
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data?.type === 'slack-oauth-success') {
          onCreated();
        }

        if (event.data?.type === 'slack-oauth-error') {
          showError('Could not connect Slack. Please try again.');
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, []);

    return (
      <MenuItem
        ref={ref}
        {...menuItemProps}
        onClick={handleClick}
        disabled={isStartingSlack}
      >
        <ListItemIcon>
          <IconComponent iconSvg={slackSvg} alt={'slack'} />
        </ListItemIcon>
        <ListItemText>Slack</ListItemText>
      </MenuItem>
    );
  }
);

SlackAddMenuItem.displayName = 'SlackAddMenuItem';

export default SlackAddMenuItem;
