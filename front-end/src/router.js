import { createBrowserRouter } from 'react-router';
import Layout from './layout';
import Home from './home';
import Terms from './terms';
import Privacy from './privacy';

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
]);
