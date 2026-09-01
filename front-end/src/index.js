import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router';
import './favicon.svg';
import { Amplify } from 'aws-amplify';
import config from './amplify-config';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionContextProvider } from './session-provider.js';

Amplify.configure(config);

const theme = createTheme({
  palette: {
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    // h4: {
    //     fontSize: "1.2rem",
    //     fontWeight: 600,
    //
    // },
    // h5: {
    //     fontSize: "1.5rem",
    //     fontWeight: 600,
    // },
    //
    // body1: {
    //     fontSize: "1rem",
    //     lineHeight: 1.5,
    // },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SessionContextProvider>
      <RouterProvider router={router} />
    </SessionContextProvider>
  </ThemeProvider>
);
