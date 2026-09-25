import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { useAsync } from 'react-async';
import { useErrorSnackbar } from '../common/error-snackbar-context';
import { useSessionContext } from '../session-context';
import halson from 'halson';

import { OTPInput, REGEXP_ONLY_DIGITS } from 'input-otp';

export function VerificationCodeInput({ value, onChange }) {
  return (
    <Box>
      <Typography sx={{ mb: 1 }}>Secure code</Typography>

      <OTPInput
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={value}
        onChange={onChange}
        containerClassName="otp-container"
        render={({ slots }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {slots.map((slot, index) => (
              <Box
                key={index}
                sx={{
                  width: 48,
                  height: 52,
                  border: '1px solid',
                  borderColor: slot.isActive ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 500,
                }}
              >
                {slot.char}
              </Box>
            ))}
          </Box>
        )}
      />
    </Box>
  );
}

const createVerificationAttempt = async (
  [body],
  { accessToken, destinationResource },
  { signal }
) => {
  const response = await fetch(
    halson(destinationResource).getLink('verificationAttempt').href,
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
    throw new Error(
      `Failed to create verification attempt (${response.status})`
    );
  }

  const data = await response.json();
  return data;
};

const PhoneVerificationAndResendCodeDialog = ({
  phoneNumber,
  setPhoneNumber,
  verifyPhoneTitle,
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
  destinationResource,
  setDestinationResource,
}) => {
  const { showError } = useErrorSnackbar();
  const { accessToken } = useSessionContext();
  const [code, setCode] = useState('');

  const { run, isPending } = useAsync({
    deferFn: createVerificationAttempt,
    accessToken,
    destinationResource,
    onResolve: () => {
      onClose();
      onCreated();
    },
    onReject: (error) => {
      showError(error.message || 'Failed to verify code');
    },
  });

  const handleDone = () => {
    run({
      code,
    });
  };

  return (
    <>
      <DialogTitle>{verifyPhoneTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
              We sent a verification code to
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {phoneNumber}
            </Typography>
          </Stack>

          <VerificationCodeInput value={code} onChange={setCode} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleDone}
          variant="contained"
          disabled={isPending || code.length !== 6}
          startIcon={
            isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {isPending ? 'Verifying...' : 'Verify'}
        </Button>
      </DialogActions>
    </>
  );
};

export default PhoneVerificationAndResendCodeDialog;
