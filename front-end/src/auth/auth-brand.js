import { Stack, SvgIcon, Typography } from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

const AuthBrand = ({ title, subtitle }) => {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <SvgIcon
        sx={{
          height: 36,
          width: 36,
          color: 'primary.main',
        }}
      >
        <CircleNotificationsIcon />
      </SvgIcon>

      <Stack spacing={0.5}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 20 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default AuthBrand;
