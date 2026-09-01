import { Card, CardContent, Stack, Box } from '@mui/material';
import whatsappSvg from '../../../assets/icons/WhatsApp.svg';

const DestinationCard = () => {
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
          <Stack>Second</Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;
