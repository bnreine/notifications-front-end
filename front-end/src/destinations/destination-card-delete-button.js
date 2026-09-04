import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAsync } from 'react-async';
import halson from 'halson';
import { useErrorSnackbar } from '../common/error-snackbar-context';

const deleteDestination = async (
  [destination],
  { accessToken },
  { signal }
) => {
  const url = halson(destination).getLink('self').href;
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
    throw new Error(`Failed to delete destination (${response.status})`);
  }
};

const DestinationCardDeleteButton = ({
  destination,
  accessToken,
  onDestinationChange,
}) => {
  const { showError } = useErrorSnackbar();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const selfLink = destination ? halson(destination).getLink('self') : null;

  const { run: runDelete, isPending: isDeleting } = useAsync({
    deferFn: deleteDestination,
    accessToken,
    onResolve: () => {
      setConfirmOpen(false);
      onDestinationChange(destination.id, { deleted: true });
    },
    onReject: (error) => {
      showError(error.message || 'Failed to delete destination');
    },
  });

  if (!selfLink?.href) {
    return null;
  }

  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    setConfirmOpen(false);
  };

  const handleConfirm = () => {
    if (isDeleting) {
      return;
    }

    runDelete(destination);
  };

  return (
    <>
      <IconButton
        aria-label="Delete destination"
        size="small"
        color="error"
        onClick={() => setConfirmOpen(true)}
        disabled={isDeleting}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <Dialog open={confirmOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete destination?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete this destination.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isDeleting} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DestinationCardDeleteButton;
