import { Box, Card, CardContent, Stack } from '@mui/material';
import slackSvg from '../../../assets/icons/slack.svg';

const SlackDestinationCard = () => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack spacing={2} direction="row">
        <Box
          component="img"
          src={slackSvg}
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

export default SlackDestinationCard;
