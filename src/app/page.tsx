'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-900 mb-4">Welcome to Waste Sorting App</h1>
        <p className="text-xl text-gray-600 mb-8">
          Learn how to properly sort and dispose of different types of waste
        </p>

        <div className="mt-8">
          {isLoggedIn ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard" className="btn btn-primary px-6 py-3 text-lg">
                Go to Dashboard
              </Link>
              <Link href="/waste-categories" className="btn btn-secondary px-6 py-3 text-lg">
                Browse Waste Categories
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login" className="btn btn-primary px-6 py-3 text-lg">
                Login
              </Link>
              <Link href="/register" className="btn btn-outline px-6 py-3 text-lg hover:bg-primary-50">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
        <div className="card transition-all duration-300 hover:shadow-card-hover">
          <div className="card-body">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
              <i className="bi bi-book text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Learn</h3>
            <p className="text-gray-600">
              Learn about different waste categories and how to properly sort them.
            </p>
          </div>
        </div>
        <div className="card transition-all duration-300 hover:shadow-card-hover">
          <div className="card-body">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 mb-4">
              <i className="bi bi-people text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Contribute</h3>
            <p className="text-gray-600">
              Contribute to a cleaner environment by properly sorting your waste.
            </p>
          </div>
        </div>
        <div className="card transition-all duration-300 hover:shadow-card-hover">
          <div className="card-body">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-4">
              <i className="bi bi-graph-up text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track</h3>
            <p className="text-gray-600">
              Track your waste disposal habits and improve over time.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Waste Sorting App. All rights reserved.
        </p>
      </div>
    </main>
  );
}
