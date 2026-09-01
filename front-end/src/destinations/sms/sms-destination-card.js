import { Box, Card, CardContent, Stack } from '@mui/material';
import smsSvg from '../../../assets/icons/sms.svg';
import TitleSubtitleStack from '../title-subtitle-stack';
import FieldValueStack from '../field-value-stack';

const SmsDestinationCard = ({ destination }) => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack spacing={2} direction="row">
        <Box
          component="img"
          src={smsSvg}
          alt="sms"
          sx={{
            width: 24,
            height: 24,
          }}
        />
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
