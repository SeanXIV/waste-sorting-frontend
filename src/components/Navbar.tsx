'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Waste Sorting App
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link
                    href="/dashboard"
                    className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/waste-categories"
                    className={`nav-link ${pathname.startsWith('/waste-categories') ? 'active' : ''}`}
                  >
                    Waste Categories
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/recycling-centers"
                    className={`nav-link ${pathname.startsWith('/recycling-centers') ? 'active' : ''}`}
                  >
                    Recycling Centers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/disposal-guidelines"
                    className={`nav-link ${pathname.startsWith('/disposal-guidelines') ? 'active' : ''}`}
                  >
                    Disposal Guidelines
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/reports"
                    className={`nav-link ${pathname.startsWith('/reports') ? 'active' : ''}`}
                  >
                    Reports
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Welcome, {username}</span>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    href="/login"
                    className={`nav-link ${pathname === '/login' ? 'active' : ''}`}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/register"
                    className={`nav-link ${pathname === '/register' ? 'active' : ''}`}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
