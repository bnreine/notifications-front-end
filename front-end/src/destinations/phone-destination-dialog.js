import { useState } from 'react';
import { Dialog } from '@mui/material';
import PhoneNumberAndConsentDialog from './phone-number-and-consent-dialog';
import PhoneVerificationAndResendCodeDialog from './phone-verification-and-resend-code-dialog';

const dialogTypeMap = {
  0: PhoneNumberAndConsentDialog,
  1: PhoneVerificationAndResendCodeDialog,
};

const PhoneDestinationDialog = ({
  open,
  channelType,
  addPhonePageTitle,
  verifyPhoneTitle,
  consent,
  onClose,
  onCreated,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [consented, setConsented] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [page, setPage] = useState(0); // start with first page
  const [destinationResource, setDestinationResource] = useState(null);

  const resetPhoneNumberConsentForm = () => {
    setPhoneNumber('');
    setConsented(false);
    setPhoneError('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      resetPhoneNumberConsentForm();
      setPage(0);
      setDestinationResource(null);
    }, 150);
  };

  const DialogContentPage = dialogTypeMap[page] || (() => 'unknown page');

  const props = {
    phoneNumber,
    setPhoneNumber,
    addPhonePageTitle,
    verifyPhoneTitle,
    onClose: handleClose,
    onCreated,
    consent,
    channelType,
    setPage,
    consented,
    setConsented,
    phoneError,
    setPhoneError,
    resetPhoneNumberConsentForm,
    setDestinationResource,
    destinationResource,
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContentPage {...props} />
    </Dialog>
  );
};

export default PhoneDestinationDialog;
