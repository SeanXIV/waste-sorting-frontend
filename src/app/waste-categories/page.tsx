'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { wasteCategoriesAPI } from '../../lib/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecyclable, setFilterRecyclable] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

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

  // Filter waste categories based on search term and recyclable filter
  const filteredCategories = wasteCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRecyclable = filterRecyclable === null || category.recyclable === filterRecyclable;

    return matchesSearch && matchesRecyclable;
  });

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading waste categories...</p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Waste Categories</h1>
        <Link href="/dashboard" className="btn btn-outline-primary">
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search waste categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
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
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No waste categories found matching your criteria.
        </div>
      ) : (
        <div className="row">
          {filteredCategories.map((category) => (
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
        </div>
      )}
    </div>
  );
}
