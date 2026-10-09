import { Outlet, useLocation, matchPath } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileNav } from './MobileNav'
import { ToastContainer } from '@/components/common/Toast'
import { AuthModal } from '@/components/auth'

export function Layout() {
  const location = useLocation()
  const isEventDetails = matchPath('/events/:id', location.pathname)

  return (
    <div className="min-h-dvh flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {!isEventDetails && <Footer />}
      {!isEventDetails && <MobileNav />}
      <AuthModal />
      <ToastContainer />
    </div>
  )
}
