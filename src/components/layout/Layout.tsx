import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileNav } from './MobileNav'
import { ToastContainer } from '@/components/common/Toast'
import { AuthModal } from '@/components/auth'

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />
      <AuthModal />
      <ToastContainer />
    </div>
  )
}
