import { Stack, Typography } from '@mui/material';

const TitleSubtitleStack = ({ title, subTitle }) => (
  <Stack>
    <Typography variant="title" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="subtitle2" sx={{ color: 'grey.600' }}>
      {subTitle}
    </Typography>
  </Stack>
);

export default TitleSubtitleStack;
