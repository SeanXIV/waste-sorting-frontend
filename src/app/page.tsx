'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <main className={styles.main}>
      <div className="text-center my-5">
        <h1 className="display-4">Welcome to Waste Sorting App</h1>
        <p className="lead">
          Learn how to properly sort and dispose of different types of waste
        </p>
        
        <div className="mt-5">
          {isLoggedIn ? (
            <div>
              <Link href="/dashboard" className="btn btn-primary btn-lg me-3">
                Go to Dashboard
              </Link>
              <Link href="/waste-categories" className="btn btn-success btn-lg">
                Browse Waste Categories
              </Link>
            </div>
          ) : (
            <div>
              <Link href="/login" className="btn btn-primary btn-lg me-3">
                Login
              </Link>
              <Link href="/register" className="btn btn-outline-primary btn-lg">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Learn</h5>
              <p className="card-text">
                Learn about different waste categories and how to properly sort them.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Contribute</h5>
              <p className="card-text">
                Contribute to a cleaner environment by properly sorting your waste.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Track</h5>
              <p className="card-text">
                Track your waste disposal habits and improve over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
