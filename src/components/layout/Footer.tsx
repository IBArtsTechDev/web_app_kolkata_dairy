import { Link } from 'react-router-dom'


const footerLinks = {
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms and Conditions', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-neutral-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Top Section */}
        <div className="mb-8 max-w-md">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <img src="/logo.png" alt="KD Icon" className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <img src="/logo_text.png" alt="Kolkata Diary" className="h-6 w-auto object-contain" />
          </Link>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The premiere nightlife, entertainment, and heritage pass system for the City of Joy.
            Discover secret gigs, book luxury dining tables, and reserve curated cultural walks.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-neutral-600">
              © 2026 Kolkata Diary Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
