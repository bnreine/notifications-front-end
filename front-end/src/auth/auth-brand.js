import { Box, Stack, SvgIcon, Typography } from '@mui/material';
import chroma from 'chroma-js';
// import AiMagicSvg from '../icons/ai-magic.jsx';

const AuthBrand = ({ title, subtitle }) => {
    return (
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    p: 1.5,
                    bgcolor: (theme) =>
                        chroma(theme.palette.primary.main).alpha(0.2).hex(),
                    borderRadius: 2,
                }}
            >
                {/*<SvgIcon*/}
                {/*    sx={{*/}
                {/*        height: 36,*/}
                {/*        width: 36,*/}
                {/*        color: (theme) =>*/}
                {/*            chroma(theme.palette.primary.main).alpha(0.9).hex(),*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {AiMagicSvg}*/}
                {/*</SvgIcon>*/}
            </Box>

            <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 20 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                        {subtitle}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
};

export default AuthBrand;
