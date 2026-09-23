import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-8xl font-bold text-neutral-800 mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-neutral-400 max-w-[448px] mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex gap-3">
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
        <Link to="/events">
          <Button variant="outline">Browse Events</Button>
        </Link>
      </div>
    </motion.div>
  )
}
