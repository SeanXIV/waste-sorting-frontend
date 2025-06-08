'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { wasteCategoriesAPI } from '../../lib/api';
import { useLoading } from '../../context/LoadingContext';

type WasteCategory = {
  id: string;
  name: string;
  description: string;
  recyclable: boolean;
  disposalMethods: string[];
};

export default function WasteCategories() {
  const router = useRouter();
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([]);
  const [error, setError] = useState('');
  const { isLoading, setLoading, setLoadingMessage } = useLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecyclable, setFilterRecyclable] = useState<boolean | null>(null);

  // Function to remove duplicates based on ID and name
  const removeDuplicates = (categories: WasteCategory[]): WasteCategory[] => {
    const seen = new Set();
    return categories.filter(category => {
      // Create a unique identifier using both id and name (in case API has inconsistent IDs)
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

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch waste categories
    const fetchWasteCategories = async () => {
      setLoading(true);
      setLoadingMessage('Loading waste categories...');
      try {
        const data = await wasteCategoriesAPI.getAll();
        
        // Remove duplicates before setting state
        const uniqueCategories = removeDuplicates(Array.isArray(data) ? data : []);
        
        console.log('Original categories count:', data?.length || 0);
        console.log('Unique categories count:', uniqueCategories.length);
        
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

  // Filter waste categories based on search term and recyclable filter
  const filteredCategories = wasteCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRecyclable = filterRecyclable === null || category.recyclable === filterRecyclable;

    return matchesSearch && matchesRecyclable;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Waste Categories</h1>
          <p className="text-gray-600 mt-2">Learn how to properly sort and dispose of different types of waste</p>
          {wasteCategories.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">Showing {filteredCategories.length} of {wasteCategories.length} categories</p>
          )}
        </div>
        <Link href="/dashboard" className="btn btn-outline mt-4 md:mt-0 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger mb-6" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-8 shadow-sm">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="form-control pl-10"
                  placeholder="Search waste categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="form-control"
                value={filterRecyclable === null ? '' : filterRecyclable.toString()}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setFilterRecyclable(null);
                  } else {
                    setFilterRecyclable(e.target.value === 'true');
                  }
                }}
              >
                <option value="">All Items</option>
                <option value="true">Recyclable Only</option>
                <option value="false">Non-recyclable Only</option>
              </select>
            </div>
          </div>

          {searchTerm && (
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600 mr-2">Search results for:</span>
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No waste categories found matching your criteria.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div className="card h-full hover:shadow-card-hover transition-shadow duration-300" key={`${category.id}-${category.name}`}>
              <div className="card-body">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-dark-900">{category.name}</h3>
                  <span className={`badge ${category.recyclable ? 'badge-success' : 'badge-danger'}`}>
                    {category.recyclable ? 'Recyclable' : 'Non-recyclable'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="h-4 w-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Disposal Methods:
                  </h4>
                  <ul className="space-y-1 pl-2">
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
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  <span>View Details</span>
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}