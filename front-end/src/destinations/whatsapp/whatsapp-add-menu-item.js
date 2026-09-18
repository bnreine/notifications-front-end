import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router';
import { Link } from '@mui/material';
import PhoneDestinationAddMenuItem from '../phone-destination-add-menu-item';
import IconComponent from '../icon-component';
import whatsAppSvg from '../../../assets/icons/WhatsApp.svg';

const WhatsAppIcon = () => (
  <IconComponent iconSvg={whatsAppSvg} alt={'whatsapp'} />
);

const WHATSAPP_CONSENT = (
  <>
    I consent to Notifications using this phone number in this app to send
    WhatsApp messages about my reminders and stock alerts (typically once per
    day at 8:00 AM EST). Reply STOP to unsubscribe. See our{' '}
    <Link component={RouterLink} to="/privacy" target="_blank">
      Privacy Policy
    </Link>{' '}
    and{' '}
    <Link component={RouterLink} to="/terms" target="_blank">
      Terms of Service
    </Link>
    .
  </>
);

const WhatsAppAddMenuItem = forwardRef((props, ref) => (
  <PhoneDestinationAddMenuItem
    {...props}
    ref={ref}
    channelType="whatsapp"
    label="WhatsApp"
    IconComponent={WhatsAppIcon}
    title="Add WhatsApp destination"
    verifyPhoneTitle="Verify WhatsApp number"
    consent={WHATSAPP_CONSENT}
  />
));

WhatsAppAddMenuItem.displayName = 'WhatsAppAddMenuItem';

export default WhatsAppAddMenuItem;
