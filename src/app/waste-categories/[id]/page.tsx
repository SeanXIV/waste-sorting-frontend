'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { wasteCategoriesAPI } from '../../../lib/api';
import { useLoading } from '../../../context/LoadingContext';

type WasteCategory = {
  id: string;
  name: string;
  description: string;
  recyclable: boolean;
  disposalMethods: string[];
};

export default function WasteCategoryDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [category, setCategory] = useState<WasteCategory | null>(null);
  const [error, setError] = useState('');
  const { isLoading, setLoading, setLoadingMessage } = useLoading();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch waste category details
    const fetchWasteCategory = async () => {
      setLoading(true);
      setLoadingMessage('Loading waste category details...');
      try {
        const data = await wasteCategoriesAPI.getById(params.id);
        setCategory(data);
      } catch (err) {
        console.error('Error fetching waste category:', err);
        setError('Failed to load waste category details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWasteCategory();
  }, [params.id, router, setLoading, setLoadingMessage]);

  // We don't need a local loading indicator as we're using the global loading context

  if (error) {
    return (
      <div className="my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <div className="text-center mt-4">
          <Link href="/waste-categories" className="btn btn-primary">
            Back to Waste Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="my-5">
        <div className="alert alert-warning" role="alert">
          Waste category not found.
        </div>
        <div className="text-center mt-4">
          <Link href="/waste-categories" className="btn btn-primary">
            Back to Waste Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center">
            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${category.recyclable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mr-3`}>
              {category.recyclable ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <h1 className="text-3xl font-bold text-dark-900">{category.name}</h1>
          </div>
          <p className="text-gray-600 mt-2 ml-13">Detailed information about this waste category</p>
        </div>
        <Link href="/waste-categories" className="btn btn-outline mt-4 md:mt-0 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Waste Categories
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="card h-full">
            <div className="card-header flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">About this Category</span>
            </div>
            <div className="card-body">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark-900 mb-2">Description</h3>
                <p className="text-gray-700">{category.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark-900 mb-2">Recyclability</h3>
                <div className="flex items-center">
                  <span className={`badge ${category.recyclable ? 'badge-success' : 'badge-danger'} mr-2`}>
                    {category.recyclable ? 'Recyclable' : 'Non-recyclable'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {category.recyclable
                      ? 'This item can be recycled through proper channels'
                      : 'This item cannot be recycled and requires special disposal'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dark-900 mb-3">Disposal Methods</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <ul className="space-y-3">
                    {category.disposalMethods.map((method, index) => (
                      <li className="flex items-start" key={index}>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 mr-3 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card h-full">
            <div className="card-header flex items-center bg-accent-50">
              <svg className="w-5 h-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-medium text-accent-800">Disposal Tips</span>
            </div>
            <div className="card-body">
              <p className="text-gray-700 mb-4">Here are some tips for disposing of {category.name.toLowerCase()}:</p>
              <ul className="space-y-3">
                {category.recyclable ? (
                  <>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Clean the item before recycling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Remove any non-recyclable parts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Check with your local recycling center for specific guidelines</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Consider reusing the item before recycling</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Dispose of in regular trash</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Check if any parts can be recycled separately</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Consider alternatives that are recyclable</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>For hazardous materials, contact your local waste management facility</span>
                    </li>
                  </>
                )}
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Find Recycling Centers</h4>
                <Link
                  href="/recycling-centers"
                  className="btn btn-accent w-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Find Nearby Centers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-gray-700 text-sm">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            <span className="font-medium">Note:</span> Disposal methods may vary by location. Always check with your local waste management authority for specific guidelines in your area.
          </p>
        </div>
      </div>
    </div>
  );
}
