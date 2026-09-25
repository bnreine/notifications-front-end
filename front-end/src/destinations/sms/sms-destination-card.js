import { Card, CardContent, Stack } from '@mui/material';
import smsSvg from '../../../assets/icons/sms.svg';
import TitleSubtitleStack from '../title-subtitle-stack';
import FieldValueStack from '../field-value-stack';
import IconComponent from '../icon-component';
import DestinationCardDeleteButton from '../destination-card-delete-button';

const SmsDestinationCard = ({
  destination,
  accessToken,
  onDestinationChange,
}) => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
        <Stack spacing={2} direction="row">
          <IconComponent iconSvg={smsSvg} alt={'sms'} />
          <Stack spacing={2}>
            <TitleSubtitleStack
              title={'SMS'}
              subTitle={'Receive notifications on SMS'}
            />

            <Stack
              direction="row"
              spacing={4}
              sx={{ justifyContent: 'space-between' }}
            >
              <FieldValueStack
                field={'Phone Number'}
                value={destination.metadata.phoneNumber}
              />
              <FieldValueStack
                field={'Consent Status'}
                value={destination.consentStatus}
              />
                {destination.verifyStatus ? <FieldValueStack
                field={'Verify Status'}
                value={destination.verifyStatus}
              /> : null}
            </Stack>
          </Stack>
        </Stack>
        <Stack sx={{ justifyContent: 'center' }}>
          <DestinationCardDeleteButton
            destination={destination}
            accessToken={accessToken}
            onDestinationChange={onDestinationChange}
          />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default SmsDestinationCard;
