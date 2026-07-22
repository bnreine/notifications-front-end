import { createBrowserRouter, Outlet } from 'react-router';

export const router = createBrowserRouter([
    {
        element: <Outlet />,
        children: [
            {
                path: '/',
                element: <div>home</div>,
            },
            {
                path: '/terms',
                element: <div>Terms</div>,
            },
            {
                path: '/privacy',
                element: <div>Privacy</div>,
            },
        ],
    },
]);
