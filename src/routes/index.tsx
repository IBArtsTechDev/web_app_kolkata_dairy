import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Events } from '@/pages/Events'
import { EventDetailsPage } from '@/pages/EventDetails'
import { CreateEvent } from '@/pages/CreateEvent'
import { NotFound } from '@/pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'events/:id',
        element: <EventDetailsPage />,
      },
      {
        path: 'create',
        element: <CreateEvent />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
