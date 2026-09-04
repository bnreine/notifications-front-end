import { Card, CardContent, Stack } from '@mui/material';
import whatsappSvg from '../../../assets/icons/WhatsApp.svg';
import TitleSubtitleStack from '../title-subtitle-stack';
import FieldValueStack from '../field-value-stack';
import IconComponent from '../icon-component';
import DestinationCardDeleteButton from '../destination-card-delete-button';

const WhatsappDestinationCard = ({
  destination,
  accessToken,
  onDestinationChange,
}) => {
  return (
    <Card>
      <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
        <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
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
};

export default WhatsappDestinationCard;
