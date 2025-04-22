'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { wasteCategoriesAPI } from '@/lib/api';

type User = {
  id: string;
  username: string;
  email: string;
  roles: string[];
};

type WasteCategory = {
  id: string;
  name: string;
  description: string;
  recyclable: boolean;
  disposalMethods: string[];
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Fetch waste categories
    const fetchWasteCategories = async () => {
      try {
        const data = await wasteCategoriesAPI.getAll();
        setWasteCategories(data);
      } catch (err) {
        console.error('Error fetching waste categories:', err);
        setError('Failed to load waste categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWasteCategories();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Welcome, {user?.username}!</h5>
          <p className="card-text">Email: {user?.email}</p>
          <p className="card-text">
            Role: {user?.roles.map(role => role.replace('ROLE_', '')).join(', ')}
          </p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-recycle" style={{ fontSize: '2rem', color: '#28a745' }}></i>
              <h5 className="card-title mt-3">Waste Categories</h5>
              <p className="card-text">Browse and learn about different waste categories</p>
              <Link href="/waste-categories" className="btn btn-primary">
                View Categories
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-building" style={{ fontSize: '2rem', color: '#17a2b8' }}></i>
              <h5 className="card-title mt-3">Recycling Centers</h5>
              <p className="card-text">Find recycling centers near you</p>
              <Link href="/recycling-centers" className="btn btn-primary">
                View Centers
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-info-circle" style={{ fontSize: '2rem', color: '#6f42c1' }}></i>
              <h5 className="card-title mt-3">Disposal Guidelines</h5>
              <p className="card-text">Learn how to properly dispose of waste</p>
              <Link href="/disposal-guidelines" className="btn btn-primary">
                View Guidelines
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-bar-chart" style={{ fontSize: '2rem', color: '#fd7e14' }}></i>
              <h5 className="card-title mt-3">Reports</h5>
              <p className="card-text">View waste management reports and statistics</p>
              <Link href="/reports" className="btn btn-primary">
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-3">Recent Waste Categories</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {wasteCategories.slice(0, 3).map((category) => (
          <div className="col-md-4 mb-4" key={category.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{category.name}</h5>
                <p className="card-text">{category.description}</p>
                <p className="card-text">
                  <span className={`badge ${category.recyclable ? 'bg-success' : 'bg-danger'}`}>
                    {category.recyclable ? 'Recyclable' : 'Non-recyclable'}
                  </span>
                </p>
                <h6>Disposal Methods:</h6>
                <ul className="list-group list-group-flush">
                  {category.disposalMethods.map((method, index) => (
                    <li className="list-group-item" key={index}>{method}</li>
                  ))}
                </ul>
              </div>
              <div className="card-footer">
                <Link
                  href={`/waste-categories/${category.id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="col-12 text-center mt-3">
          <Link href="/waste-categories" className="btn btn-outline-primary">
            View All Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
