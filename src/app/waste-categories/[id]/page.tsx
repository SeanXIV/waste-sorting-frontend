'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { wasteCategoriesAPI } from '@/lib/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch waste category details
    const fetchWasteCategory = async () => {
      try {
        const data = await wasteCategoriesAPI.getById(params.id);
        setCategory(data);
      } catch (err) {
        console.error('Error fetching waste category:', err);
        setError('Failed to load waste category details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWasteCategory();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading waste category details...</p>
      </div>
    );
  }

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
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{category.name}</h1>
        <Link href="/waste-categories" className="btn btn-outline-primary">
          Back to Waste Categories
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-3">
            <h5>Description</h5>
            <p>{category.description}</p>
          </div>

          <div className="mb-3">
            <h5>Recyclable</h5>
            <p>
              <span className={`badge ${category.recyclable ? 'bg-success' : 'bg-danger'}`}>
                {category.recyclable ? 'Yes' : 'No'}
              </span>
            </p>
          </div>

          <div className="mb-3">
            <h5>Disposal Methods</h5>
            <ul className="list-group">
              {category.disposalMethods.map((method, index) => (
                <li className="list-group-item" key={index}>{method}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Disposal Tips</h5>
          <div className="card-text">
            <p>Here are some tips for disposing of {category.name.toLowerCase()}:</p>
            <ul>
              {category.recyclable ? (
                <>
                  <li>Clean the item before recycling</li>
                  <li>Remove any non-recyclable parts</li>
                  <li>Check with your local recycling center for specific guidelines</li>
                  <li>Consider reusing the item before recycling</li>
                </>
              ) : (
                <>
                  <li>Dispose of in regular trash</li>
                  <li>Check if any parts can be recycled separately</li>
                  <li>Consider alternatives that are recyclable</li>
                  <li>For hazardous materials, contact your local waste management facility</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
