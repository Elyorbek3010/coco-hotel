import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useHotel } from '../../hooks/useHotel';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Rooms', path: '/rooms' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Promotions', path: '/promotions' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const { hotelInfo } = useHotel();
  const hotelName = hotelInfo?.name || 'COCO HOTEL';
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Reset mobile menu when location changes without triggering effect warning
  if (location.pathname !== currentPath) {
    setCurrentPath(location.pathname);
    setMobileMenuOpen(false);
  }

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0c0a09]/95 backdrop-blur-md border-b border-[#c5a880]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand / Logo */}
          <Link
            to="/"
            className="flex flex-col group focus-visible:outline-2 focus-visible:outline-[#c5a880] focus-visible:outline-offset-4 rounded-xs"
          >
            <span className="font-serif text-2xl tracking-[0.25em] text-stone-100 font-bold group-hover:text-[#c5a880] transition-colors">
              {hotelName.toUpperCase()}
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#c5a880] font-medium">
              Boutique Sanctuary
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-6 lg:space-x-8"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-widest transition-colors py-1 focus-visible:outline-2 focus-visible:outline-[#c5a880] focus-visible:outline-offset-2 rounded-xs ${
                    isActive
                      ? 'text-[#dfc282] font-semibold border-b-2 border-[#c5a880]'
                      : 'text-stone-300 hover:text-[#c5a880] font-normal'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Book Now Button & Mobile Hamburger */}
          <div className="flex items-center space-x-4">
            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-[#c5a880] focus-visible:outline-offset-2"
            >
              Book Now
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              id="mobile-menu-button"
              aria-controls="mobile-navigation"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xs text-stone-300 hover:text-[#c5a880] hover:bg-stone-900 focus-visible:outline-2 focus-visible:outline-[#c5a880] focus-visible:outline-offset-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-[#c5a880]/20 bg-[#0c0a09] px-4 pt-3 pb-6 space-y-1.5 shadow-2xl"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3.5 py-2.5 rounded-xs text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'bg-[#181614] text-[#dfc282] font-semibold border-l-2 border-[#c5a880]'
                    : 'text-stone-300 hover:bg-[#141210] hover:text-[#c5a880]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-stone-800">
            <Link
              to="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors"
            >
              Book Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
