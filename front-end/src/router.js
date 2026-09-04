import { createBrowserRouter, Outlet } from 'react-router';
import Layout from './layout';
import Home from './home';
import Terms from './terms';
import Privacy from './privacy';
import AuthLayout from './auth/auth-layout';
import SignIn from './auth/sign-in';
import NewPassword from './auth/new-password-required';
import AppLayout from './app-layout';
import AuthGuard from './auth-guard';
import Configurations from './configurations/configurations';
import NewConfiguration from './configurations/new-configuration';
import EditConfiguration from './configurations/edit-configuration';
import ConfigPreferences from './configurations/config-preferences';
import Destinations from './destinations/destinations';
import OAuthSlack from './oauth-slack';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/terms',
        element: <Terms />,
      },
      {
        path: '/privacy',
        element: <Privacy />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/new-password-required',
        element: <NewPassword />,
      },
    ],
  },

  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/configurations',
            element: <Configurations />,
          },
          {
            path: '/destinations',
            element: <Destinations />,
          },
          {
            path: '/oauth/slack',
            element: <OAuthSlack />,
          },
          {
            path: '/configurations/new',
            element: <NewConfiguration />,
          },
          {
            path: '/configurations/:configurationId',
            element: <EditConfiguration />,
          },
          {
            path: '/configurations/:configurationId/preferences',
            element: <ConfigPreferences />,
          },
        ],
      },
    ],
  },
]);
