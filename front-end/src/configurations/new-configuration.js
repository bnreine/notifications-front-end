import { useState } from 'react';
import { useNavigate } from 'react-router';
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
import { useAsync } from 'react-async';
import { useSessionContext } from '../session-context.js';
import { useErrorSnackbar } from '../common/error-snackbar-context.js';

const CONFIGURATIONS_URL =
  'https://api.notifications.benjaminreinecke.click/configurations';

const CONFIG_TYPES = {
  reminder: 'reminder',
  stockQuoteAlert: 'stockQuoteAlert',
};

const createConfiguration = async ([body], { accessToken }, { signal }) => {
  const response = await fetch(CONFIGURATIONS_URL, {
    method: 'POST',
    signal,
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to create configuration (${response.status})`);
  }

  return response.json();
};

const NewConfiguration = () => {
  const navigate = useNavigate();
  const { accessToken } = useSessionContext();
  const { showError } = useErrorSnackbar();

  const [configType, setConfigType] = useState(CONFIG_TYPES.reminder);
  const [message, setMessage] = useState('');
  const [stock, setStock] = useState('');
  const [enabled, setEnabled] = useState(true);

  const { run, isPending } = useAsync({
    deferFn: createConfiguration,
    accessToken,
    onResolve: (configuration) => {
      navigate(`/configurations/${configuration.Id}`, { replace: true });
    },
    onReject: (error) => {
      showError(error.message || 'Failed to create configuration');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const config =
      configType === CONFIG_TYPES.reminder
        ? { type: CONFIG_TYPES.reminder, message: message }
        : { type: CONFIG_TYPES.stockQuoteAlert, stock: stock };

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
            New configuration
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Create a reminder or stock quote alert.
          </Typography>
        </Box>
      </Stack>

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
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              {isPending ? 'Creating...' : 'Create configuration'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default NewConfiguration;
