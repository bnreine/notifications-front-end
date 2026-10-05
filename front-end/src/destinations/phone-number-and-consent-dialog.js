import {
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAsync } from 'react-async';
import { useErrorSnackbar } from '../common/error-snackbar-context';
import { useSessionContext } from '../session-context';
import halson from 'halson';

const PHONE_NUMBER_PATTERN = /^\+[1-9]\d{6,14}$/;

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

  const data = await response.json();
  return data;
};

const PhoneNumberAndConsentDialog = ({
  phoneNumber,
  setPhoneNumber,
  addPhonePageTitle,
  onClose,
  onCreated,
  consent,
  channelType,
  setPage,
  consented,
  setConsented,
  phoneError,
  setPhoneError,
  resetPhoneNumberConsentForm,
  setDestinationResource,
}) => {
  const { showError } = useErrorSnackbar();
  const { accessToken } = useSessionContext();

  const { run, isPending } = useAsync({
    deferFn: createDestination,
    accessToken,
    onResolve: (data) => {
      if (halson(data).getLink('verificationChallenge')) {
        setPage(1);
        onCreated();
        setDestinationResource(data);
      } else {
        onClose();
        onCreated();
      }
    },
    onReject: (error) => {
      showError(error.message || 'Failed to create destination');
    },
  });

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
      phoneNumber,
      channelType,
      userConsented: consented,
    });
  };

  const addButtonText = consented
    ? 'Add and consent!'
    : 'Add and do not consent';

  const addLoadingButtonText = consented
    ? 'Adding with consent...'
    : 'Adding without consent...';

  return (
    <>
      <DialogTitle>{addPhonePageTitle}</DialogTitle>
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
                {consent}
              </Typography>
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
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
          {isPending ? addLoadingButtonText : addButtonText}
        </Button>
      </DialogActions>
    </>
  );
};

export default PhoneNumberAndConsentDialog;
