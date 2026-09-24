import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import CocoLogo from '../common/CocoLogo';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const { language, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { key: 'home', name: t('nav.home'), path: '/' },
    { key: 'rooms', name: t('nav.rooms'), path: '/rooms' },
    { key: 'about', name: t('nav.about'), path: '/about' },
    { key: 'services', name: t('nav.services'), path: '/services' },
    { key: 'gallery', name: t('nav.gallery'), path: '/gallery' },
    { key: 'promotions', name: t('nav.promotions'), path: '/promotions' },
    { key: 'contact', name: t('nav.contact'), path: '/contact' },
  ];

  const languages = [
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
  ];

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
    <header className="sticky top-0 z-50 bg-[var(--color-nav-bg)] backdrop-blur-md border-b border-theme transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Brand / Logo */}
          <Link
            to="/"
            className="flex items-center focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-4 rounded-xs"
            aria-label="Coco Hotel Home"
          >
            <CocoLogo size="default" />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center space-x-6 xl:space-x-8"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-widest transition-all py-1 focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2 rounded-xs ${
                    isActive
                      ? 'text-theme-gold font-bold border-b-2 border-[var(--color-gold)]'
                      : 'text-theme-muted hover:text-theme-gold font-medium'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls: Language, Theme, Book Now, Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Language Selector */}
            <div
              className="inline-flex items-center p-0.5 rounded-full border border-theme bg-theme-elevated shadow-xs"
              role="group"
              aria-label="Language selection"
            >
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => changeLanguage(item.code)}
                  aria-pressed={language === item.code}
                  className={`px-2 py-1 text-[11px] font-bold tracking-wider rounded-full transition-all cursor-pointer ${
                    language === item.code
                      ? 'bg-gold-metallic text-stone-950 shadow-xs'
                      : 'text-theme-muted hover:text-theme-main'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('common.switchToLight') : t('common.switchToDark')}
              className="p-2 rounded-full border border-theme bg-theme-elevated text-theme-muted hover:text-theme-gold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2 shadow-xs"
              title={theme === 'dark' ? t('common.switchToLight') : t('common.switchToDark')}
            >
              {theme === 'dark' ? (
                // Sun icon for switching to light
                <svg className="w-4 h-4 text-theme-gold" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                // Moon icon for switching to dark
                <svg className="w-4 h-4 text-stone-800" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Book Now Button */}
            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-gold-metallic gold-glow text-stone-950 rounded-full hover:brightness-110 active:scale-[0.98] transition-all shadow-md focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
            >
              {t('nav.bookNow')}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              id="mobile-menu-button"
              aria-controls="mobile-navigation"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={toggleMenu}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-theme-muted hover:text-theme-gold hover:bg-theme-elevated focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2 cursor-pointer border border-theme"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
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
          className="lg:hidden border-t border-theme bg-theme-main px-4 pt-3 pb-6 space-y-2 shadow-2xl transition-colors duration-200"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'bg-theme-elevated text-theme-gold font-bold border-l-2 border-[var(--color-gold)]'
                    : 'text-theme-muted hover:bg-theme-elevated hover:text-theme-gold'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile controls & Book Now */}
          <div className="pt-3 border-t border-theme space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs uppercase tracking-wider text-theme-muted">{t('common.language')}</span>
              <div
                className="inline-flex items-center p-0.5 rounded-full border border-theme bg-theme-elevated"
                role="group"
                aria-label="Language selection"
              >
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => changeLanguage(item.code)}
                    aria-pressed={language === item.code}
                    className={`px-2.5 py-1 text-xs font-bold tracking-wider rounded-full transition-all cursor-pointer ${
                      language === item.code
                        ? 'bg-gold-metallic text-stone-950 shadow-xs'
                        : 'text-theme-muted hover:text-theme-main'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-3 text-xs font-bold uppercase tracking-widest bg-gold-metallic text-stone-950 rounded-full hover:brightness-110 transition-transform active:scale-[0.99] shadow-md"
            >
              {t('nav.bookNow')}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
