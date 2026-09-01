import { Box, Card, CardContent, Stack } from '@mui/material';

const DefaultDestinationCard = () => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack spacing={2} direction="row">
        <Box
          component="img"
          src={null}
          alt="Default Icon"
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

export default DefaultDestinationCard;
