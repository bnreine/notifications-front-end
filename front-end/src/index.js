import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router';
import './favicon.svg';
import { Amplify } from 'aws-amplify';
import config from './amplify-config';
// import {ThemeProvider} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionContextProvider } from './session-provider.js';

Amplify.configure(config);

const theme = createTheme({});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SessionContextProvider>
      <RouterProvider router={router} />
    </SessionContextProvider>
  </ThemeProvider>
);
