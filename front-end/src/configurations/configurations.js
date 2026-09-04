import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMount } from 'react-use';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { useAsync } from 'react-async';
import { parseTemplate } from 'url-template';
import halson from 'halson';
import { useSessionContext } from '../session-context.js';
import { useErrorSnackbar } from '../common/error-snackbar-context.js';

const CONFIGURATIONS_URL_TEMPLATE = parseTemplate(
  'https://api.notifications.benjaminreinecke.click/configurations{?offset,limit,sort*}'
);

const DEFAULT_SORT_MODEL = [{ field: 'updatedAt', sort: 'desc' }];

const columns = [
  {
    field: 'Id',
    headerName: 'Config ID',
    flex: 1.5,
    minWidth: 280,
    sortable: false,
  },
  {
    cellClassName: 'configTypeColumnCells',
    field: 'type',
    headerName: 'Type',
    flex: 0.6,
    minWidth: 140,
    sortable: true,
    valueGetter: (value, row) => value ?? row.config?.type ?? '',
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
    cellClassName: 'configTypeColumnCells',
    field: 'enabled',
    headerName: 'Enabled',
    flex: 0.5,
    minWidth: 110,
    sortable: true,
    renderCell: (params) => (
      <Chip
        label={params.value ? 'Enabled' : 'Disabled'}
        size="small"
        color={params.value ? 'success' : 'default'}
        variant="outlined"
      />
    ),
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    flex: 1,
    minWidth: 200,
    type: 'dateTime',
    sortable: true,
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

const deleteConfiguration = async (
  [configuration],
  { accessToken },
  { signal }
) => {
  const url = halson(configuration).getLink('self').href;

  const response = await fetch(url, {
    method: 'DELETE',
    signal,
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete configuration (${response.status})`);
  }
};

const toApiSort = (sortModel) => {
  const sorts = sortModel.length ? sortModel : DEFAULT_SORT_MODEL;

  return sorts.map(({ field, sort }) =>
    JSON.stringify({
      field,
      direction: sort === 'asc' ? 'ASC' : 'DESC',
    })
  );
};

const fetchConfigurations = async (
  [{ accessToken, paginationModel, sortModel }],
  {},
  { signal }
) => {
  if (!accessToken) {
    return { rows: [], hasMore: false };
  }

  const url = CONFIGURATIONS_URL_TEMPLATE.expand({
    offset: paginationModel.page * paginationModel.pageSize,
    limit: paginationModel.pageSize,
    sort: toApiSort(sortModel),
  });

  const response = await fetch(url, {
    signal,
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load configurations (${response.status})`);
  }

  const data = halson(await response.json());
  const configurations = data.getEmbeds('configurations');

  return {
    rows: configurations,
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
  const [sortModel, setSortModel] = useState(DEFAULT_SORT_MODEL);
  const [configToDelete, setConfigToDelete] = useState(null);

  const { data, isPending, run } = useAsync({
    deferFn: fetchConfigurations,
    onReject: (error) => {
      showError(error.message || 'Failed to load configurations');
    },
  });

  useMount(() => {
    run({ accessToken, paginationModel, sortModel });
  });

  const rows = data?.rows ?? [];
  const hasNextPage = Boolean(data?.hasMore);

  const { run: runDelete, isPending: isDeleting } = useAsync({
    deferFn: deleteConfiguration,
    accessToken,
    onResolve: () => {
      const isLastRowOnLaterPage =
        rows.length === 1 && paginationModel.page > 0;

      setConfigToDelete(null);

      const nextPaginationModel = isLastRowOnLaterPage
        ? { ...paginationModel, page: paginationModel.page - 1 }
        : paginationModel;

      if (isLastRowOnLaterPage) {
        setPaginationModel(nextPaginationModel);
      }

      run({
        accessToken,
        paginationModel: nextPaginationModel,
        sortModel,
      });
    },
    onReject: (error) => {
      showError(error.message || 'Failed to delete configuration');
    },
  });

  const paginationMeta = useMemo(() => ({ hasNextPage }), [hasNextPage]);

  const gridColumns = useMemo(
    () => [
      ...columns,
      {
        field: 'actions',
        headerName: 'Actions',
        width: 90,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
        cellClassName: 'configActionsColumnCells',
        renderCell: (params) => (
          <IconButton
            aria-label="Delete configuration"
            size="small"
            color="error"
            onClick={(event) => {
              event.stopPropagation();
              setConfigToDelete(params.row);
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    []
  );

  const handleCloseDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setConfigToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!configToDelete || isDeleting) {
      return;
    }

    runDelete(configToDelete);
  };

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
          columns={gridColumns}
          getRowId={(row) => row.Id}
          loading={isPending}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => {
            setSortModel(
              newSortModel.length ? newSortModel : DEFAULT_SORT_MODEL
            );
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
          sortingOrder={['asc', 'desc']}
          pageSizeOptions={[5, 10, 25]}
          rowCount={rowCount}
          paginationMeta={paginationMeta}
          disableRowSelectionOnClick
          onRowClick={(params) => navigate(`/configurations/${params.row.Id}`)}
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
            '& .configTypeColumnCells, & .configActionsColumnCells': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />
      </Paper>

      <Dialog
        open={Boolean(configToDelete)}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete configuration?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete{' '}
            <Box
              component="span"
              title={configToDelete?.Id}
              sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
            >
              {configToDelete?.Id}
            </Box>
            {configToDelete?.config?.type ? (
              <>
                {' '}
                (
                <Box component="span" sx={{ textTransform: 'capitalize' }}>
                  {configToDelete.config.type}
                </Box>
                )
              </>
            ) : null}
            .
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={isDeleting}
            autoFocus
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Configurations;
