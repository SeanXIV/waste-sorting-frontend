'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { recyclingCentersAPI } from '@/lib/api';

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
  latitude?: number;
  longitude?: number;
  notes?: string;
};

export default function RecyclingCenterDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [center, setCenter] = useState<RecyclingCenter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch recycling center details
    const fetchRecyclingCenter = async () => {
      try {
        const data = await recyclingCentersAPI.getById(params.id);
        setCenter(data);
      } catch (err) {
        console.error('Error fetching recycling center:', err);
        setError('Failed to load recycling center details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecyclingCenter();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading recycling center details...</p>
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
          <Link href="/recycling-centers" className="btn btn-primary">
            Back to Recycling Centers
          </Link>
        </div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="my-5">
        <div className="alert alert-warning" role="alert">
          Recycling center not found.
        </div>
        <div className="text-center mt-4">
          <Link href="/recycling-centers" className="btn btn-primary">
            Back to Recycling Centers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{center.name}</h1>
        <Link href="/recycling-centers" className="btn btn-outline-primary">
          Back to Recycling Centers
        </Link>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <div className="mb-3">
                <h5>Address</h5>
                <p>{center.address}</p>
              </div>

              {center.contactNumber && (
                <div className="mb-3">
                  <h5>Contact Number</h5>
                  <p>{center.contactNumber}</p>
                </div>
              )}

              {center.email && (
                <div className="mb-3">
                  <h5>Email</h5>
                  <p>{center.email}</p>
                </div>
              )}

              {center.website && (
                <div className="mb-3">
                  <h5>Website</h5>
                  <p>
                    <a href={center.website} target="_blank" rel="noopener noreferrer">
                      {center.website}
                    </a>
                  </p>
                </div>
              )}

              {center.operatingHours && (
                <div className="mb-3">
                  <h5>Operating Hours</h5>
                  <p>{center.operatingHours}</p>
                </div>
              )}

              <div className="mb-3">
                <h5>Status</h5>
                <p>
                  <span className={`badge ${center.active ? 'bg-success' : 'bg-danger'}`}>
                    {center.active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>

              {center.notes && (
                <div className="mb-3">
                  <h5>Notes</h5>
                  <p>{center.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Accepted Waste Categories</h5>
            </div>
            <ul className="list-group list-group-flush">
              {center.acceptedWasteCategories && center.acceptedWasteCategories.length > 0 ? (
                center.acceptedWasteCategories.map((category, index) => (
                  <li className="list-group-item" key={index}>{category}</li>
                ))
              ) : (
                <li className="list-group-item">No specific categories listed</li>
              )}
            </ul>
          </div>

          {center.website && (
            <div className="d-grid gap-2">
              <a
                href={center.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Map placeholder - in a real app, you would integrate with Google Maps or similar */}
      {(center.latitude && center.longitude) ? (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">Location</h5>
          </div>
          <div className="card-body">
            <div style={{ height: '300px', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-muted">Map would be displayed here with coordinates: {center.latitude}, {center.longitude}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">Location</h5>
          </div>
          <div className="card-body">
            <p className="text-muted">No map coordinates available for this recycling center.</p>
          </div>
        </div>
      )}
    </div>
  );
}
