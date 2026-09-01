import { Box } from '@mui/material';

const IconComponent = ({ iconSvg, alt }) => {
  return (
    <Box
      component="img"
      src={iconSvg}
      alt={alt}
      sx={{
        width: 24,
        height: 24,
      }}
    />
  );
};

export default IconComponent;
