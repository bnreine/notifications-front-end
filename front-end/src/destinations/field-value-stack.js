import { Stack, Typography } from '@mui/material';

const FieldValueStack = ({ field, value }) => (
  <Stack direction={'column'}>
    <Stack>
      <Typography variant={'subtitle2'} sx={{ color: 'grey.600' }}>
        {field}
      </Typography>
      <Typography variant={'subtitle2'} sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  </Stack>
);

export default FieldValueStack;
