import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Events } from '@/pages/Events'
import { EventDetailsPage } from '@/pages/EventDetails'
import { CreateEvent } from '@/pages/CreateEvent'
import { LoginPage } from '@/pages/Login'
import { ResetPasswordPage } from '@/pages/ResetPassword/ResetPasswordPage'
import { ForgotPasswordPage } from '@/pages/ForgotPassword'
import { BookmarksPage } from '@/pages/Bookmarks'
import { FavoritesPage } from '@/pages/Favorites'
import { AdminPage } from '@/pages/Admin'
import { NotFound } from '@/pages/NotFound'
import { PrivacyPolicy, TermsOfService } from '@/pages/Legal'
import { RequireAuth } from './guards'

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
        element: (
          <RequireAuth>
            <CreateEvent />
          </RequireAuth>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'auth/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'auth/forgot-password/reset',
        element: <ResetPasswordPage />,
      },
      {
        path: 'bookmarks',
        element: (
          <RequireAuth>
            <BookmarksPage />
          </RequireAuth>
        ),
      },
      {
        path: 'favorites',
        element: (
          <RequireAuth>
            <FavoritesPage />
          </RequireAuth>
        ),
      },
      {
        path: 'admin',
        element: (
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        ),
      },
      {
        path: 'privacy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms',
        element: <TermsOfService />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
