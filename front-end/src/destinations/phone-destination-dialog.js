import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAsync } from 'react-async';
import { useErrorSnackbar } from '../common/error-snackbar-context';

const PHONE_NUMBER_PATTERN = /^\+[1-9]\d{6,14}$/;

const CHANNEL_COPY = {
  sms: {
    title: 'Add SMS destination',
    consent: (
      <>
        I consent to Notifications using this phone number in this app to send
        SMS messages about my reminders and stock alerts (typically once per day
        at 8:00 AM EST). Message and data rates may apply. Reply STOP to
        unsubscribe or HELP for help. See our{' '}
        <Link component={RouterLink} to="/privacy" target="_blank">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link component={RouterLink} to="/terms" target="_blank">
          Terms of Service
        </Link>
        .
      </>
    ),
  },
  whatsapp: {
    title: 'Add WhatsApp destination',
    consent: (
      <>
        I consent to Notifications using this phone number in this app to send
        WhatsApp messages about my reminders and stock alerts (typically once
        per day at 8:00 AM EST). Reply STOP to unsubscribe. See our{' '}
        <Link component={RouterLink} to="/privacy" target="_blank">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link component={RouterLink} to="/terms" target="_blank">
          Terms of Service
        </Link>
        .
      </>
    ),
  },
};

const createDestination = async ([body], { accessToken }, { signal }) => {
  const response = await fetch(
    'https://api2.notifications.benjaminreinecke.click/destinations',
    {
      method: 'POST',
      signal,
      headers: {
        Authorization: accessToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create destination (${response.status})`);
  }

  return response.json();
};

const PhoneDestinationDialog = ({
  open,
  channelType,
  accessToken,
  onClose,
  onCreated,
}) => {
  const { showError } = useErrorSnackbar();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [consented, setConsented] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const copy = CHANNEL_COPY[channelType] || CHANNEL_COPY.sms;

  const resetForm = () => {
    setPhoneNumber('');
    setConsented(false);
    setPhoneError('');
  };

  const { run, isPending } = useAsync({
    deferFn: createDestination,
    accessToken,
    onResolve: () => {
      resetForm();
      onClose();
      onCreated();
    },
    onReject: (error) => {
      showError(error.message || 'Failed to create destination');
    },
  });

  const handleClose = () => {
    if (isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleDone = () => {
    if (isPending) {
      return;
    }

    if (!PHONE_NUMBER_PATTERN.test(phoneNumber)) {
      setPhoneError(
        'Enter a phone number in valid international format eg. +55555555555(5)'
      );
      return;
    }

    run({
      metadata: { phoneNumber },
      channelType,
      status: consented ? 'active' : 'inactive',
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{copy.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Phone number"
            value={phoneNumber}
            onChange={(event) => {
              setPhoneNumber(event.target.value);
              if (phoneError) {
                setPhoneError('');
              }
            }}
            placeholder="+55555555555(5)"
            helperText={
              phoneError || 'Use international format, e.g. +55555555555(5)'
            }
            error={Boolean(phoneError)}
            required
            fullWidth
            autoFocus
            disabled={isPending}
          />
          <FormControlLabel
            sx={{ alignItems: 'flex-start', ml: 0 }}
            control={
              <Checkbox
                checked={consented}
                onChange={(event) => setConsented(event.target.checked)}
                disabled={isPending}
                sx={{ pt: 0 }}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                {copy.consent}
              </Typography>
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleDone}
          variant="contained"
          disabled={isPending}
          startIcon={
            isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {isPending ? 'Saving...' : 'Done'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhoneDestinationDialog;
