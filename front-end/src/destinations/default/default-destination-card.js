import { Card, CardContent, Stack } from '@mui/material';
import IconComponent from '../icon-component';
import DestinationCardDeleteButton from '../destination-card-delete-button';

const DefaultDestinationCard = ({
  destination,
  accessToken,
  onDestinationChange,
}) => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack spacing={2} direction="row" alignItems="flex-start">
        <IconComponent iconSvg={null} alt={'unsupported type'} />
        <Stack sx={{ flex: 1 }}>Unsupported Type</Stack>
        <DestinationCardDeleteButton
          destination={destination}
          accessToken={accessToken}
          onDestinationChange={onDestinationChange}
        />
      </Stack>
    </CardContent>
  </Card>
);

export default DefaultDestinationCard;
