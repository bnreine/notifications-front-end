import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import chroma from 'chroma-js';
import { signOut } from 'aws-amplify/auth';
import { useSessionContext } from './session-context';

const NAV_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Configurations', to: '/configurations', Icon: TuneIcon },
  { label: 'Destinations', to: '/destinations', Icon: ForumOutlinedIcon },
];

const getDisplayName = (email) => {
  if (!email) {
    return 'Account';
  }

  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const getInitials = (name, email) => {
  const source = name && name !== 'Account' ? name : email || '?';
  const parts = source
    .replace(/@.*/, '')
    .split(/[\s._-]+/)
    .filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || '?'
  );
};

const LeftNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, reloadSession } = useSessionContext();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const displayName = getDisplayName(email);

  const handleSignOut = async () => {
    setMenuAnchor(null);
    await signOut();
    await reloadSession();
    navigate('/sign-in', { replace: true });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: NAV_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: NAV_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'grey.900',
          color: 'common.white',
          borderRight: 0,
        },
      }}
    >
      <Stack sx={{ height: '100%', p: 2, boxSizing: 'border-box' }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', px: 1, py: 1, mb: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              p: 1,
              bgcolor: (theme) =>
                chroma(theme.palette.primary.main).alpha(0.2).hex(),
              borderRadius: 2,
            }}
          >
            <NotificationsOutlinedIcon
              sx={{
                fontSize: 20,
                color: (theme) =>
                  chroma(theme.palette.primary.main).alpha(0.9).hex(),
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>
            Notifications
          </Typography>
        </Stack>

        <List sx={{ flexGrow: 1, py: 0 }}>
          {NAV_ITEMS.map(({ label, to, Icon }) => {
            const selected = location.pathname.startsWith(to);

            return (
              <ListItemButton
                key={to}
                component={NavLink}
                to={to}
                selected={selected}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: selected ? 'common.white' : 'grey.400',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                  '&:hover': {
                    bgcolor: (theme) =>
                      chroma(theme.palette.common.white).alpha(0.06).hex(),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: selected ? 600 : 500,
                    fontSize: 14,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Box
          onClick={(event) => setMenuAnchor(event.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            cursor: 'pointer',
            bgcolor: (theme) =>
              chroma(theme.palette.common.white).alpha(0.06).hex(),
            '&:hover': {
              bgcolor: (theme) =>
                chroma(theme.palette.common.white).alpha(0.1).hex(),
            },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {getInitials(displayName, email)}
          </Avatar>
          <Stack sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {displayName}
            </Typography>
            {email && (
              <Typography variant="caption" sx={{ color: 'grey.400' }} noWrap>
                {email}
              </Typography>
            )}
          </Stack>
          <ExpandMoreIcon sx={{ color: 'grey.400', fontSize: 20 }} />
        </Box>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </Menu>
      </Stack>
    </Drawer>
  );
};

export default LeftNav;
