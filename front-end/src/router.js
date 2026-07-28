import { createBrowserRouter, Outlet } from 'react-router';
import Layout from './layout';
import Home from './home';
import Terms from './terms';
import Privacy from './privacy';
import AuthLayout from './auth/auth-layout';
import SignIn from './auth/sign-in';
import NewPassword from './auth/new-password-required';

const PassThrough = () => <Outlet />;
const Configurations = () => 'configs';
const NewConfig = () => 'new config';
const EditConfig = () => 'edit config';
const ConfigPreferences = () => 'config preferences';

// const NewPassword = () => 'new password';


const AuthGuard = () => 'auth guarded';

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
    element: <AuthGuard />, // guarded for now until i put the auth in properly
    children: [
      {
        path: '/configurations',
        element: <Configurations />,
      },
      {
        path: '/configurations/new',
        element: <NewConfig />,
      },
      {
        path: '/configurations/:configurationId',
        element: <EditConfig />,
      },
      {
        path: '/configurations/:configurationId/preferences',
        element: <ConfigPreferences />,
      },
    ],
  },
]);
