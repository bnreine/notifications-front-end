import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAsync } from 'react-async';
import { parseTemplate } from 'url-template';
import { useSessionContext } from '../session-context.js';
import { useErrorSnackbar } from '../common/error-snackbar-context.js';

const PREFERENCES_URL_TEMPLATE = parseTemplate(
  'https://api2.notifications.benjaminreinecke.click/configurations/{configurationId}/preferences'
);

const PREFERENCE_URL_TEMPLATE = parseTemplate(
  'https://api2.notifications.benjaminreinecke.click/configurations/{configurationId}/preferences/{preferenceId}'
);

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'sms', label: 'SMS' },
  { id: 'slack', label: 'Slack' },
];

const EMPTY_CHANNEL_STATE = {
  whatsapp: false,
  sms: false,
  slack: false,
};

const EMPTY_PREFERENCE_IDS = {
  whatsapp: null,
  sms: null,
  slack: null,
};

const getPreferences = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  return (
    data?._embedded?.preferences ??
    data?._embedded?.configurationPreferences ??
    data?.preferences ??
    []
  );
};

const getPreferenceId = (preference) =>
  preference?.Id ?? preference?.id ?? null;

const mapPreferences = (preferences) => {
  const checked = { ...EMPTY_CHANNEL_STATE };
  const preferenceIds = { ...EMPTY_PREFERENCE_IDS };

  preferences.forEach((preference) => {
    const channel = preference?.channel;
    const preferenceId = getPreferenceId(preference);

    if (!CHANNELS.some(({ id }) => id === channel) || !preferenceId) {
      return;
    }

    checked[channel] = true;
    preferenceIds[channel] = preferenceId;
  });

  return { checked, preferenceIds };
};

const fetchPreferences = async (
  { accessToken, configurationId },
  { signal }
) => {
  const url = PREFERENCES_URL_TEMPLATE.expand({ configurationId });

  const response = await fetch(url, {
    signal,
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load preferences (${response.status})`);
  }

  return response.json();
};

const createPreference = async ({ accessToken, configurationId, channel }) => {
  const url = PREFERENCES_URL_TEMPLATE.expand({ configurationId });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to save ${channel} preference (${response.status})`
    );
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const deletePreference = async ({
  accessToken,
  configurationId,
  preferenceId,
}) => {
  const url = PREFERENCE_URL_TEMPLATE.expand({
    configurationId,
    preferenceId,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to remove preference (${response.status})`);
  }
};

const ConfigPreferences = () => {
  const navigate = useNavigate();
  const { configurationId } = useParams();
  const { accessToken } = useSessionContext();
  const { showError } = useErrorSnackbar();

  const [checked, setChecked] = useState(EMPTY_CHANNEL_STATE);
  const [preferenceIds, setPreferenceIds] = useState(EMPTY_PREFERENCE_IDS);
  const [pending, setPending] = useState(EMPTY_CHANNEL_STATE);
  const [isFormReady, setIsFormReady] = useState(false);

  const { isPending: isLoading } = useAsync({
    promiseFn: fetchPreferences,
    accessToken,
    configurationId,
    watch: configurationId,
    onResolve: (data) => {
      const mapped = mapPreferences(getPreferences(data));
      setChecked(mapped.checked);
      setPreferenceIds(mapped.preferenceIds);
      setIsFormReady(true);
    },
    onReject: (error) => {
      showError(error.message || 'Failed to load preferences');
      setIsFormReady(false);
    },
  });

  const handleChannelChange = async (channel, isChecked) => {
    if (pending[channel]) {
      return;
    }

    setPending((current) => ({ ...current, [channel]: true }));

    try {
      if (isChecked) {
        const preference = await createPreference({
          accessToken,
          configurationId,
          channel,
        });
        let preferenceId = getPreferenceId(preference);

        if (!preferenceId) {
          const data = await fetchPreferences(
            { accessToken, configurationId },
            {}
          );
          const mapped = mapPreferences(getPreferences(data));
          setChecked(mapped.checked);
          setPreferenceIds(mapped.preferenceIds);
          return;
        }

        setPreferenceIds((current) => ({
          ...current,
          [channel]: preferenceId,
        }));
        setChecked((current) => ({ ...current, [channel]: true }));
        return;
      }

      const preferenceId = preferenceIds[channel];
      if (preferenceId) {
        await deletePreference({
          accessToken,
          configurationId,
          preferenceId,
        });
      }

      setPreferenceIds((current) => ({ ...current, [channel]: null }));
      setChecked((current) => ({ ...current, [channel]: false }));
    } catch (error) {
      showError(error.message || 'Failed to update preference');
    } finally {
      setPending((current) => ({ ...current, [channel]: false }));
    }
  };

  return (
    <Stack
      spacing={3}
      sx={{
        height: '100%',
        p: { xs: 2, sm: 3, md: 4 },
        boxSizing: 'border-box',
        bgcolor: 'grey.50',
      }}
    >
      <Stack spacing={1}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/configurations')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to configurations
        </Button>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Delivery preferences
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Choose where this notification should be sent.
          </Typography>
        </Box>
      </Stack>

      {isLoading || !isFormReady ? (
        <Stack sx={{ alignItems: 'center', py: 8 }}>
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <Paper
          elevation={0}
          sx={{
            maxWidth: 560,
            p: { xs: 2.5, sm: 3 },
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <FormGroup>
              {CHANNELS.map((channel) => (
                <FormControlLabel
                  key={channel.id}
                  control={
                    <Checkbox
                      checked={checked[channel.id]}
                      onChange={(event) =>
                        handleChannelChange(channel.id, event.target.checked)
                      }
                      disabled={pending[channel.id]}
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{channel.label}</Typography>
                      {pending[channel.id] ? (
                        <CircularProgress size={14} />
                      ) : null}
                    </Stack>
                  }
                />
              ))}
            </FormGroup>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={() => navigate('/configurations')}
              >
                Done
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default ConfigPreferences;
