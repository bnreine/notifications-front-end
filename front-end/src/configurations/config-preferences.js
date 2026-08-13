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
import halson from 'halson';
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

const EMPTY_PREFERENCE_IDS = {
  whatsapp: null,
  sms: null,
  slack: null,
};

const jsonHeaders = (accessToken) => ({
  Authorization: accessToken,
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

const preferenceIdsFromResponse = (data) => {
  const preferenceIds = { ...EMPTY_PREFERENCE_IDS };

  halson(data)
    .getEmbeds('configurationPreferences')
    .forEach((preference) => {
      if (preference?.channel in preferenceIds && preference.Id) {
        preferenceIds[preference.channel] = preference.Id;
      }
    });

  return preferenceIds;
};

const fetchPreferences = async (
  { accessToken, configurationId },
  { signal }
) => {
  const url = PREFERENCES_URL_TEMPLATE.expand({ configurationId });
  const response = await fetch(url, {
    signal,
    headers: jsonHeaders(accessToken),
  });

  if (!response.ok) {
    throw new Error(`Failed to load preferences (${response.status})`);
  }

  return preferenceIdsFromResponse(await response.json());
};

const createPreference = async (
  [channel],
  { accessToken, configurationId },
  { signal }
) => {
  const url = PREFERENCES_URL_TEMPLATE.expand({ configurationId });
  const response = await fetch(url, {
    method: 'POST',
    signal,
    headers: jsonHeaders(accessToken),
    body: JSON.stringify({ channel }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to save ${channel} preference (${response.status})`
    );
  }

  return response.json();
};

const deletePreference = async (
  [preferenceId],
  { accessToken, configurationId },
  { signal }
) => {
  if (!preferenceId) {
    return;
  }

  const url = PREFERENCE_URL_TEMPLATE.expand({
    configurationId,
    preferenceId,
  });
  const response = await fetch(url, {
    method: 'DELETE',
    signal,
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to remove preference (${response.status})`);
  }
};

const ChannelCheckbox = ({
  channel,
  preferenceId,
  configurationId,
  accessToken,
  onPreferenceChange,
}) => {
  const { showError } = useErrorSnackbar();
  const checked = Boolean(preferenceId);

  const { run: runCreate, isPending: isCreating } = useAsync({
    deferFn: createPreference,
    accessToken,
    configurationId,
    onResolve: (preference) => {
      onPreferenceChange(preference.channel, preference.Id);
    },
    onReject: (error) => {
      showError(error.message || 'Failed to save preference');
    },
  });

  const { run: runDelete, isPending: isDeleting } = useAsync({
    deferFn: deletePreference,
    accessToken,
    configurationId,
    onResolve: () => {
      onPreferenceChange(channel.id, null);
    },
    onReject: (error) => {
      showError(error.message || 'Failed to update preference');
    },
  });

  const loading = isCreating || isDeleting;

  const handleChange = (event) => {
    if (event.target.checked) {
      if (isCreating) {
        return;
      }

      runCreate(channel.id);
      return;
    }

    if (isDeleting) {
      return;
    }

    runDelete(preferenceId);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          disabled={loading}
        />
      }
      label={
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>{channel.label}</Typography>
          {loading ? <CircularProgress size={14} /> : null}
        </Stack>
      }
    />
  );
};

const ConfigPreferences = () => {
  const navigate = useNavigate();
  const { configurationId } = useParams();
  const { accessToken } = useSessionContext();
  const { showError } = useErrorSnackbar();
  const [preferenceIds, setPreferenceIds] = useState(null);

  const { isPending: isLoading } = useAsync({
    promiseFn: fetchPreferences,
    accessToken,
    configurationId,
    watch: configurationId,
    onResolve: setPreferenceIds,
    onReject: (error) => {
      showError(error.message || 'Failed to load preferences');
    },
  });

  const handlePreferenceChange = (channel, preferenceId) => {
    setPreferenceIds((current) => ({
      ...current,
      [channel]: preferenceId,
    }));
  };

  const goToConfigurations = () => navigate('/configurations');

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
          onClick={goToConfigurations}
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

      {isLoading || !preferenceIds ? (
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
                <ChannelCheckbox
                  key={channel.id}
                  channel={channel}
                  preferenceId={preferenceIds[channel.id]}
                  configurationId={configurationId}
                  accessToken={accessToken}
                  onPreferenceChange={handlePreferenceChange}
                />
              ))}
            </FormGroup>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="contained" onClick={goToConfigurations}>
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
