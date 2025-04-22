'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { recyclingCentersAPI } from '../../lib/api';
import { useLoading } from '../../context/LoadingContext';

type RecyclingCenter = {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
  operatingHours: string;
  acceptedWasteCategories: string[];
  active: boolean;
};

export default function RecyclingCenters() {
  const router = useRouter();
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [error, setError] = useState('');
  const { isLoading, setLoading, setLoadingMessage } = useLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch recycling centers
    const fetchRecyclingCenters = async () => {
      setLoading(true);
      setLoadingMessage('Loading recycling centers...');
      try {
        const data = await recyclingCentersAPI.getAll();
        setRecyclingCenters(data);
      } catch (err) {
        console.error('Error fetching recycling centers:', err);
        setError('Failed to load recycling centers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecyclingCenters();
  }, [router, setLoading, setLoadingMessage]);

  // Filter recycling centers based on search term and active filter
  const filteredCenters = recyclingCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive = filterActive === null || center.active === filterActive;

    return matchesSearch && matchesActive;
  });

  // We don't need a local loading indicator as we're using the global loading context

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Recycling Centers</h1>
          <p className="text-gray-600 mt-2">Find recycling centers near you to properly dispose of waste</p>
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
                  placeholder="Search recycling centers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="form-control"
                value={filterActive === null ? '' : filterActive.toString()}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setFilterActive(null);
                  } else {
                    setFilterActive(e.target.value === 'true');
                  }
                }}
              >
                <option value="">All Centers</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
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

      {filteredCenters.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No recycling centers found matching your criteria.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCenters.map((center) => (
            <div className="card h-full hover:shadow-card-hover transition-shadow duration-300" key={center.id}>
              <div className="card-header flex items-center bg-secondary-50">
                <svg className="w-5 h-5 mr-2 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-secondary-800">{center.name}</span>
                <span className={`ml-auto badge ${center.active ? 'badge-success' : 'badge-danger'}`}>
                  {center.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-gray-700">{center.address}</span>
                  </div>

                  {center.contactNumber && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{center.contactNumber}</span>
                    </div>
                  )}

                  {center.email && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{center.email}</span>
                    </div>
                  )}

                  {center.operatingHours && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{center.operatingHours}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="h-4 w-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Accepted Waste Categories:
                  </h4>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    {center.acceptedWasteCategories && center.acceptedWasteCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {center.acceptedWasteCategories.map((category, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No specific categories listed</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-footer bg-gray-50 flex justify-between items-center">
                <Link
                  href={`/recycling-centers/${center.id}`}
                  className="btn btn-primary flex items-center"
                >
                  <span>View Details</span>
                  <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                {center.website && (
                  <a
                    href={center.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline flex items-center"
                  >
                    <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
