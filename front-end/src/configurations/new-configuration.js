import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAsync } from 'react-async';
import { useSessionContext } from '../session-context.js';
import { useErrorSnackbar } from '../common/error-snackbar-context.js';
import EditConfigPanel from './edit-config-panel';
import editConfigHooks from './edit-config-hooks';

const CONFIGURATIONS_URL =
  'https://api.notifications.benjaminreinecke.click/configurations';

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

  const { run, isPending } = useAsync({
    deferFn: createConfiguration,
    accessToken,
    onResolve: (configuration) => {
      navigate(`/configurations/${configuration.Id}/preferences`, {
        replace: true,
      });
    },
    onReject: (error) => {
      showError(error.message || 'Failed to create configuration');
    },
  });

  const configPanelProps = editConfigHooks({ run });
  const { handleSubmit } = configPanelProps;

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
            Create a reminder or countdown.
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
          <EditConfigPanel {...configPanelProps} />

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
