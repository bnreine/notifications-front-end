import { Card, CardContent, Stack } from '@mui/material';
import IconComponent from '../icon-component';

const DefaultDestinationCard = () => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack spacing={2} direction="row">
        <IconComponent iconSvg={null} alt={'unsupported type'} />
        <Stack>Unsupported Type</Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default DefaultDestinationCard;
