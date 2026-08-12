import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import { useSessionContext } from '../session-context.js';
import { useErrorSnackbar } from '../common/error-snackbar-context.js';

const CONFIGURATIONS_URL =
  'https://api.notifications.benjaminreinecke.click/configurations';

const columns = [
  {
    field: 'configId',
    headerName: 'Config ID',
    flex: 1.5,
    minWidth: 280,
  },
  {
    field: 'configType',
    headerName: 'Type',
    flex: 0.6,
    minWidth: 140,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
      />
    ),
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    flex: 1,
    minWidth: 200,
    type: 'dateTime',
    valueGetter: (value) => (value ? new Date(value) : null),
    valueFormatter: (value) =>
      value
        ? value.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })
        : '',
  },
];

const mapConfiguration = (configuration) => ({
  id: configuration.Id,
  configId: configuration.Id,
  configType: configuration.config?.type ?? '',
  updatedAt: configuration.updatedAt,
});

const Configurations = () => {
  const navigate = useNavigate();
  const { accessToken } = useSessionContext();
  const { showError } = useErrorSnackbar();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchConfigurations = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setLoading(true);

    try {
      const offset = paginationModel.page * paginationModel.pageSize;
      const url = new URL(CONFIGURATIONS_URL);
      url.searchParams.set('limit', String(paginationModel.pageSize));
      url.searchParams.set('offset', String(offset));

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: accessToken,
          Accept: 'application/json',
            'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load configurations (${response.status})`);
      }

      const data = await response.json();
      const configurations = data._embedded?.configurations ?? [];

      setRows(configurations.map(mapConfiguration));
      setHasNextPage(Boolean(data.hasMore));
    } catch (error) {
      console.error(error);
      showError(
        error instanceof Error
          ? error.message
          : 'Failed to load configurations'
      );
      setRows([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  }, [accessToken, paginationModel, showError]);

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  const paginationMeta = useMemo(
    () => ({ hasNextPage }),
    [hasNextPage]
  );

  const rowCount = hasNextPage
    ? -1
    : paginationModel.page * paginationModel.pageSize + rows.length;

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
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Configurations
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your reminder and stock alert configurations.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/configurations/new')}
          sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
        >
          New configuration
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          minHeight: 420,
          display: 'flex',
          flexDirection: 'column',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          rowCount={rowCount}
          paginationMeta={paginationMeta}
          disableRowSelectionOnClick
          onRowClick={(params) =>
            navigate(`/configurations/${params.row.configId}`)
          }
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'grey.50',
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
          }}
        />
      </Paper>
    </Stack>
  );
};

export default Configurations;
