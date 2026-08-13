import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import { useAsync } from 'react-async';
import { parseTemplate } from 'url-template';
import { useSessionContext } from '../session-context.js';
import { useErrorSnackbar } from '../common/error-snackbar-context.js';

const CONFIGURATIONS_URL_TEMPLATE = parseTemplate(
  'https://api.notifications.benjaminreinecke.click/configurations{?offset,limit}'
);

const columns = [
  {
    field: 'configId',
    headerName: 'Config ID',
    flex: 1.5,
    minWidth: 280,
  },
  {
    cellClassName: 'configTypeColumnCells',
    field: 'configType',
    headerName: 'Type',
    flex: 0.6,
    minWidth: 140,
    renderCell: (params) => (
      <Tooltip
        title={
          <Box
            component="pre"
            sx={{ m: 0, fontFamily: 'monospace', fontSize: 12 }}
          >
            {JSON.stringify(params.row.config ?? {}, null, 2)}
          </Box>
        }
        placement="right"
      >
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      </Tooltip>
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
  config: configuration.config ?? {},
  updatedAt: configuration.updatedAt,
});

const fetchConfigurations = async (
  { accessToken, paginationModel },
  {  }
) => {
  if (!accessToken) {
    return { rows: [], hasMore: false };
  }

  const url = CONFIGURATIONS_URL_TEMPLATE.expand({
    offset: paginationModel.page * paginationModel.pageSize,
    limit: paginationModel.pageSize,
  });

  const response = await fetch(url, {
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

  return {
    rows: configurations.map(mapConfiguration),
    hasMore: Boolean(data.hasMore),
  };
};

const Configurations = () => {
  const navigate = useNavigate();
  const { accessToken } = useSessionContext();
  const { showError } = useErrorSnackbar();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isPending } = useAsync({
    promiseFn: fetchConfigurations,
    accessToken,
    paginationModel,
    watch: paginationModel,
    onReject: (error) => {
      showError(error.message || 'Failed to load configurations');
    },
  });

  const rows = data?.rows ?? [];
  const hasNextPage = Boolean(data?.hasMore);

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
          loading={isPending}
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
              '& .configTypeColumnCells': {
                display: 'flex',
                  alignItems: 'center',
              }

          }}
        />
      </Paper>
    </Stack>
  );
};

export default Configurations;
