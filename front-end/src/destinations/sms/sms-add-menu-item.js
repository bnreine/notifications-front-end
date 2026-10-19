import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router';
import { Link } from '@mui/material';
import PhoneDestinationAddMenuItem from '../phone-destination-add-menu-item';
import IconComponent from '../icon-component';
import smsSvg from '../../../assets/icons/sms.svg';

const SmsIcon = () => <IconComponent iconSvg={smsSvg} alt={'sms'} />;

const SMS_CONSENT = (
  <>
    I consent to Notifications using this phone number to send me SMS messages
    about my reminders and countdowns at approximately 8:00 AM Eastern Time.
    Message frequency varies based on my notification settings. Message and data
    rates may apply. Reply STOP to unsubscribe or HELP for help. See our{' '}
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

const SMS_NOTICE =
  'SMS is currently only available for Brazilian phone numbers (+55).';

// +55, 2-digit area code, then an 8 or 9 digit number
const SMS_PHONE_NUMBER_RULE = {
  pattern: /^\+55[1-9]\d{9,10}$/,
  example: '+5511987654321',
  helperText: 'Brazilian numbers only, e.g. +5511987654321',
  errorMessage:
    'SMS only supports Brazilian numbers. Enter a number like +5511987654321',
};

const SmsAddMenuItem = forwardRef((props, ref) => (
  <PhoneDestinationAddMenuItem
    {...props}
    ref={ref}
    channelType="sms"
    label="SMS"
    IconComponent={SmsIcon}
    title="Add SMS destination"
    verifyPhoneTitle="Verify SMS number"
    consent={SMS_CONSENT}
    notice={SMS_NOTICE}
    phoneNumberRule={SMS_PHONE_NUMBER_RULE}
  />
));

SmsAddMenuItem.displayName = 'SmsAddMenuItem';

export default SmsAddMenuItem;
