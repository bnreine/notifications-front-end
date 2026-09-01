import { Box, Card, CardContent, Stack } from '@mui/material';
import smsSvg from '../../../assets/icons/sms.svg';
import TitleSubtitleStack from '../title-subtitle-stack';
import FieldValueStack from '../field-value-stack';
import IconComponent from '../icon-component';

const SmsDestinationCard = ({ destination }) => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
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
              value={destination.status}
            />
          </Stack>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default SmsDestinationCard;
