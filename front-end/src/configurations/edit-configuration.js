import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TuneIcon from '@mui/icons-material/Tune';
import { useAsync } from 'react-async';
import { parseTemplate } from 'url-template';
import { useSessionContext } from '../session-context.js';
import { useErrorSnackbar } from '../common/error-snackbar-context.js';

const CONFIGURATION_URL_TEMPLATE = parseTemplate(
  'https://api.notifications.benjaminreinecke.click/configurations/{configurationId}'
);

const CONFIG_TYPES = {
  reminder: 'reminder',
  stockQuoteAlert: 'stockQuoteAlert',
};

const fetchConfiguration = async (
  { accessToken, configurationId },
  { signal }
) => {
  const url = CONFIGURATION_URL_TEMPLATE.expand({ configurationId });

  const response = await fetch(url, {
    signal,
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load configuration (${response.status})`);
  }

  return response.json();
};

const updateConfiguration = async (
  [body],
  { accessToken, configurationId },
  { signal }
) => {
  const url = CONFIGURATION_URL_TEMPLATE.expand({ configurationId });

  const response = await fetch(url, {
    method: 'PUT',
    signal,
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to update configuration (${response.status})`);
  }

  return response.json();
};

const EditConfiguration = () => {
  const navigate = useNavigate();
  const { configurationId } = useParams();
  const { accessToken } = useSessionContext();
  const { showError } = useErrorSnackbar();

  const [configType, setConfigType] = useState(CONFIG_TYPES.reminder);
  const [message, setMessage] = useState('');
  const [stock, setStock] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isFormReady, setIsFormReady] = useState(false);

  const { isPending: isLoading } = useAsync({
    promiseFn: fetchConfiguration,
    accessToken,
    configurationId,
    watch: configurationId,
    onResolve: (configuration) => {
      const type = configuration.config?.type ?? CONFIG_TYPES.reminder;
      setConfigType(type);
      setMessage(configuration.config?.message ?? '');
      setStock(configuration.config?.stock ?? '');
      setEnabled(Boolean(configuration.enabled));
      setIsFormReady(true);
    },
    onReject: (error) => {
      showError(error.message || 'Failed to load configuration');
      setIsFormReady(false);
    },
  });

  const { run, isPending: isSaving } = useAsync({
    deferFn: updateConfiguration,
    accessToken,
    configurationId,
    onResolve: () => {
      navigate(`/configurations/${configurationId}/preferences`);
    },
    onReject: (error) => {
      showError(error.message || 'Failed to update configuration');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const config =
      configType === CONFIG_TYPES.reminder
        ? { type: CONFIG_TYPES.reminder, message }
        : { type: CONFIG_TYPES.stockQuoteAlert, stock };

    run({ enabled, config });
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
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
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
              Edit configuration
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Update this reminder or stock quote alert.
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          startIcon={<TuneIcon />}
          onClick={() =>
            navigate(`/configurations/${configurationId}/preferences`)
          }
          sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
        >
          Preferences
        </Button>
      </Stack>

      {isLoading || !isFormReady ? (
        <Stack sx={{ alignItems: 'center', py: 8 }}>
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 560,
            p: { xs: 2.5, sm: 3 },
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Stack spacing={3}>
            <FormControl>
              <FormLabel id="config-type-label">Configuration type</FormLabel>
              <RadioGroup
                aria-labelledby="config-type-label"
                value={configType}
                onChange={(event) => setConfigType(event.target.value)}
              >
                <FormControlLabel
                  value={CONFIG_TYPES.reminder}
                  control={<Radio />}
                  label="Reminder"
                />
                <FormControlLabel
                  value={CONFIG_TYPES.stockQuoteAlert}
                  control={<Radio />}
                  label="Stock quote alert"
                />
              </RadioGroup>
            </FormControl>

            {configType === CONFIG_TYPES.reminder ? (
              <TextField
                label="Message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Remember to clean the kitchen"
                required
                fullWidth
                multiline
                minRows={2}
              />
            ) : (
              <TextField
                label="Stock"
                value={stock}
                onChange={(event) => setStock(event.target.value.toUpperCase())}
                placeholder="AAPL"
                required
                fullWidth
                slotProps={{
                  htmlInput: { maxLength: 10 },
                }}
              />
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  onChange={(event) => setEnabled(event.target.checked)}
                />
              }
              label={enabled ? 'Enabled' : 'Disabled'}
            />

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                type="button"
                onClick={() => navigate('/configurations')}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                startIcon={
                  isSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default EditConfiguration;
