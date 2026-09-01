import { Card, CardContent, Stack, Box } from '@mui/material';
import whatsappSvg from '../../../assets/icons/WhatsApp.svg';
import TitleSubtitleStack from '../title-subtitle-stack';
import FieldValueStack from '../field-value-stack';

const WhatsappDestinationCard = ({ destination }) => {
  return (
    <Card>
      <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
        <Stack spacing={2} direction="row">
          <Box
            component="img"
            src={whatsappSvg}
            alt="slack"
            sx={{
              width: 24,
              height: 24,
            }}
          />
          <Stack spacing={2}>
            <TitleSubtitleStack
              title={'WhatsApp'}
              subTitle={'Receive notifications on WhatsApp'}
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
};

export default WhatsappDestinationCard;
