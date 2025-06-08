'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { wasteCategoriesAPI } from '../../lib/api';
import { useLoading } from '../../context/LoadingContext';

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
  const [error, setError] = useState('');
  const { isLoading, setLoading, setLoadingMessage } = useLoading();

  // Function to remove duplicates based on ID and name
  const removeDuplicates = (categories: WasteCategory[]): WasteCategory[] => {
    const seen = new Set();
    return categories.filter(category => {
      // Create a unique identifier using both id and name
      const identifier = `${category.id}-${category.name.toLowerCase().trim()}`;
      
      if (seen.has(identifier)) {
        return false; // Skip duplicate
      }
      
      seen.add(identifier);
      return true; // Keep unique item
    });
  };

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
      setLoading(true);
      setLoadingMessage('Loading dashboard data...');

      try {
        const data = await wasteCategoriesAPI.getAll();
        
        // Remove duplicates before setting state
        const uniqueCategories = removeDuplicates(Array.isArray(data) ? data : []);
        
        setWasteCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching waste categories:', err);
        setError('Failed to load waste categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWasteCategories();
  }, [router, setLoading, setLoadingMessage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">Welcome, {user?.username}!</h1>
            <p className="text-gray-600 mt-2">Here's an overview of your waste management dashboard</p>
          </div>
          <button
            className="btn btn-outline text-sm px-3 py-1.5 hover:text-red-600 hover:border-red-600"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right mr-1"></i> Logout
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card transition-all duration-300 hover:translate-y-[-5px]">
          <div className="card-body flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
              <i className="bi bi-recycle text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Waste Categories</h3>
            <p className="text-gray-600 mb-4">Browse and learn about different waste categories</p>
            <Link href="/waste-categories" className="btn btn-primary mt-auto w-full">
              View Categories
            </Link>
          </div>
        </div>

        <div className="card transition-all duration-300 hover:translate-y-[-5px]">
          <div className="card-body flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 mb-4">
              <i className="bi bi-building text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Recycling Centers</h3>
            <p className="text-gray-600 mb-4">Find recycling centers near you</p>
            <Link href="/recycling-centers" className="btn btn-secondary mt-auto w-full">
              View Centers
            </Link>
          </div>
        </div>

        <div className="card transition-all duration-300 hover:translate-y-[-5px]">
          <div className="card-body flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
              <i className="bi bi-info-circle text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Disposal Guidelines</h3>
            <p className="text-gray-600 mb-4">Learn how to properly dispose of waste</p>
            <Link href="/disposal-guidelines" className="btn btn-primary mt-auto w-full">
              View Guidelines
            </Link>
          </div>
        </div>

        <div className="card transition-all duration-300 hover:translate-y-[-5px]">
          <div className="card-body flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-4">
              <i className="bi bi-bar-chart text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <p className="text-gray-600 mb-4">View waste management reports and statistics</p>
            <Link href="/reports" className="btn btn-accent mt-auto w-full">
              View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Categories Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-900">Recent Waste Categories</h2>
          <Link href="/waste-categories" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger mb-6" role="alert">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wasteCategories.slice(0, 3).map((category) => (
            <div className="card h-full\" key={`${category.id}-${category.name}`}>
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <span className={`badge ${category.recyclable ? 'badge-success' : 'badge-danger'}`}>
                    {category.recyclable ? 'Recyclable' : 'Non-recyclable'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Disposal Methods:</h4>
                  <ul className="space-y-1">
                    {category.disposalMethods.map((method, index) => (
                      <li key={index} className="text-gray-600 text-sm flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="card-footer bg-gray-50">
                <Link
                  href={`/waste-categories/${category.id}`}
                  className="btn btn-outline w-full"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}