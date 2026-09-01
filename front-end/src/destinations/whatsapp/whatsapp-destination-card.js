import { Card, CardContent, Stack } from '@mui/material';
import whatsappSvg from '../../../assets/icons/WhatsApp.svg';
import TitleSubtitleStack from '../title-subtitle-stack';
import FieldValueStack from '../field-value-stack';
import IconComponent from '../icon-component';

const WhatsappDestinationCard = ({ destination }) => {
  return (
    <Card>
      <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
        <Stack spacing={2} direction="row">
          <IconComponent iconSvg={whatsappSvg} alt={'whatsapp'} />
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
