'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      const user = JSON.parse(userData);
      setUsername(user.username);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkClasses = (path: string) => {
    const isActive =
      path === pathname ||
      (path !== '/' && pathname.startsWith(path));

    return `block py-2 px-3 rounded-md transition-colors ${isActive
      ? 'text-white bg-primary-600 font-medium'
      : 'text-gray-700 hover:bg-gray-100'}`;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-primary-600 text-2xl">♻️</span>
            <span className="font-bold text-xl text-dark-900">Waste Sorting App</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className={navLinkClasses('/')}>
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link href="/dashboard" className={navLinkClasses('/dashboard')}>
                  Dashboard
                </Link>
                <Link href="/waste-categories" className={navLinkClasses('/waste-categories')}>
                  Waste Categories
                </Link>
                <Link href="/recycling-centers" className={navLinkClasses('/recycling-centers')}>
                  Recycling Centers
                </Link>
                <Link href="/disposal-guidelines" className={navLinkClasses('/disposal-guidelines')}>
                  Guidelines
                </Link>
                <Link href="/reports" className={navLinkClasses('/reports')}>
                  Reports
                </Link>
              </>
            )}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Welcome, <span className="font-medium text-primary-600">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-sm px-3 py-1.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn btn-outline text-sm px-3 py-1.5">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary text-sm px-3 py-1.5">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
          <div className="space-y-1 pb-3 pt-2">
            <Link
              href="/"
              className={navLinkClasses('/')}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className={navLinkClasses('/dashboard')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/waste-categories"
                  className={navLinkClasses('/waste-categories')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Waste Categories
                </Link>
                <Link
                  href="/recycling-centers"
                  className={navLinkClasses('/recycling-centers')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recycling Centers
                </Link>
                <Link
                  href="/disposal-guidelines"
                  className={navLinkClasses('/disposal-guidelines')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Disposal Guidelines
                </Link>
                <Link
                  href="/reports"
                  className={navLinkClasses('/reports')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reports
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 pb-3">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-700 px-3">
                  Welcome, <span className="font-medium text-primary-600">{username}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
