import { Link } from 'react-router-dom'
import { Globe, MessageCircle, Share2, PlayCircle } from 'lucide-react'

const footerLinks = {
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms and Conditions', href: '/terms' },
  ],
}

const socialLinks = [
  { icon: Globe, href: 'https://instagram.com', label: 'Instagram' },
  { icon: MessageCircle, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Share2, href: 'https://facebook.com', label: 'Facebook' },
  { icon: PlayCircle, href: 'https://youtube.com', label: 'Youtube' },
]

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-neutral-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img src="/logo.png" alt="KD Icon" className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              <img src="/logo_text.png" alt="Kolkata Diary" className="h-6 w-auto object-contain" />
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed mb-4">
              The premiere nightlife, entertainment, and heritage pass system for the City of Joy.
              Discover secret gigs, book luxury dining tables, and reserve curated cultural walks.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-neutral-800/50 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700/50 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Get the Mobile App */}
          <div className="hidden sm:block">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Get the Mobile App
            </h4>
            <p className="text-xs text-neutral-500 mb-4">
              Experience instant ticket access, offline passes, and personalized offers.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="relative inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#141414] border border-neutral-800/50 hover:border-neutral-700 transition-colors opacity-80 cursor-not-allowed"
              >
                <div className="absolute -top-2.5 -right-2 bg-accent-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 animate-pulse">
                  Coming Soon
                </div>
                <svg className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="flex flex-col items-start justify-center">
                  <p className="text-[9px] text-neutral-400 uppercase leading-none font-medium mb-0.5">Download on the</p>
                  <p className="text-sm font-semibold text-white leading-none">App Store</p>
                </div>
              </a>
              
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="relative inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#141414] border border-neutral-800/50 hover:border-neutral-700 transition-colors opacity-80 cursor-not-allowed"
              >
                <div className="absolute -top-2.5 -right-2 bg-accent-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 animate-pulse">
                  Coming Soon
                </div>
                <svg className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.394 12l2.304-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z" />
                </svg>
                <div className="flex flex-col items-start justify-center">
                  <p className="text-[9px] text-neutral-400 uppercase leading-none font-medium mb-0.5">Get it on</p>
                  <p className="text-sm font-semibold text-white leading-none">Google Play</p>
                </div>
              </a>
            </div>
          </div>
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
