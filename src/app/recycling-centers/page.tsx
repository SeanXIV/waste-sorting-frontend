'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { recyclingCentersAPI } from '../../lib/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
      try {
        const data = await recyclingCentersAPI.getAll();
        setRecyclingCenters(data);
      } catch (err) {
        console.error('Error fetching recycling centers:', err);
        setError('Failed to load recycling centers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecyclingCenters();
  }, [router]);

  // Filter recycling centers based on search term and active filter
  const filteredCenters = recyclingCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive = filterActive === null || center.active === filterActive;

    return matchesSearch && matchesActive;
  });

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading recycling centers...</p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Recycling Centers</h1>
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
                  placeholder="Search recycling centers..."
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
        </div>
      </div>

      {filteredCenters.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No recycling centers found matching your criteria.
        </div>
      ) : (
        <div className="row">
          {filteredCenters.map((center) => (
            <div className="col-md-6 mb-4" key={center.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{center.name}</h5>
                  <p className="card-text">
                    <strong>Address:</strong> {center.address}
                  </p>
                  {center.contactNumber && (
                    <p className="card-text">
                      <strong>Contact:</strong> {center.contactNumber}
                    </p>
                  )}
                  {center.email && (
                    <p className="card-text">
                      <strong>Email:</strong> {center.email}
                    </p>
                  )}
                  {center.operatingHours && (
                    <p className="card-text">
                      <strong>Hours:</strong> {center.operatingHours}
                    </p>
                  )}
                  <p className="card-text">
                    <span className={`badge ${center.active ? 'bg-success' : 'bg-danger'}`}>
                      {center.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <h6>Accepted Waste Categories:</h6>
                  <ul className="list-group list-group-flush mb-3">
                    {center.acceptedWasteCategories && center.acceptedWasteCategories.length > 0 ? (
                      center.acceptedWasteCategories.map((category, index) => (
                        <li className="list-group-item" key={index}>{category}</li>
                      ))
                    ) : (
                      <li className="list-group-item">No specific categories listed</li>
                    )}
                  </ul>
                </div>
                <div className="card-footer">
                  <Link
                    href={`/recycling-centers/${center.id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    View Details
                  </Link>
                  {center.website && (
                    <a
                      href={center.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
