import { Box, Card, CardContent, Stack } from '@mui/material';
import smsSvg from '../../../assets/icons/sms.svg';

const SmsDestinationCard = () => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack spacing={2} direction="row">
        <Box
          component="img"
          src={smsSvg}
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

export default SmsDestinationCard;
