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
import slackSvg from '../../assets/icons/slack.svg';
import channelTypeRegistry from '../destinations/channel-type-registry';

const PREFERENCES_URL_TEMPLATE = parseTemplate(
  'https://api2.notifications.benjaminreinecke.click/configurations/{configurationId}/preferences'
);

const jsonHeaders = (accessToken) => ({
  Authorization: accessToken,
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

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

  const responseJson = await response.json();
  return halson(responseJson).getEmbeds('configurationPreferences');
};

const updatePreference = async (
  [newEnabled],
  { accessToken, preference },
  { signal }
) => {
  const url = halson(preference).getLink('self').href;
  const response = await fetch(url, {
    method: 'PUT',
    signal,
    headers: jsonHeaders(accessToken),
    body: JSON.stringify({ enabled: newEnabled }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to save ${channel} preference (${response.status})`
    );
  }

  return response.json();
};

const PreferenceCheckbox = ({
  accessToken,
  onPreferenceChange,
  preference,
}) => {
  const { showError } = useErrorSnackbar();

  const { run: runUpdate, isPending: isUpdating } = useAsync({
    deferFn: updatePreference,
    accessToken,
    preference,
    onResolve: onPreferenceChange,
    onReject: (error) => {
      showError(error.message || 'Failed to update preference');
    },
  });

  const handleChange = (event) => {
    const newEnabled = event.target.checked;

    if (isUpdating) {
      return;
    }

    runUpdate(newEnabled);
    return;
  };

  const TypeIconComponent = (
    channelTypeRegistry[preference.channelType] || channelTypeRegistry.default
  ).IconComponent;

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={preference.enabled}
          onChange={handleChange}
          disabled={isUpdating}
        />
      }
      label={
        <Stack direction="row" spacing={1} alignItems="center">
          <TypeIconComponent />
          <Typography>{preference.name}</Typography>
          {isUpdating ? <CircularProgress size={14} /> : null}
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
  const [inMemoryPreferenceUpdates, setInMemoryPreferenceUpdates] = useState(
    {}
  );

  const { isPending: isLoading, data: preferences = [] } = useAsync({
    promiseFn: fetchPreferences,
    accessToken,
    configurationId,
    watch: configurationId,
    onReject: (error) => {
      showError(error.message || 'Failed to load preferences');
    },
  });

  const handlePreferenceChange = (updatedPreference) => {
    setInMemoryPreferenceUpdates((current) => ({
      ...current,
      [updatedPreference.id]: updatedPreference,
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

      {isLoading ? (
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
              {preferences.map((preference) => {
                return (
                  <PreferenceCheckbox
                    key={preference.id}
                    accessToken={accessToken}
                    onPreferenceChange={handlePreferenceChange}
                    preference={
                      inMemoryPreferenceUpdates[preference.id] || preference
                    }
                  />
                );
              })}
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
