'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { disposalGuidelinesAPI } from '@/lib/api';

type DisposalGuideline = {
  id: string;
  title: string;
  description: string;
  wasteCategory: string;
  steps: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
  relatedCategories?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export default function DisposalGuidelineDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [guideline, setGuideline] = useState<DisposalGuideline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch disposal guideline details
    const fetchGuideline = async () => {
      try {
        const data = await disposalGuidelinesAPI.getById(params.id);
        setGuideline(data);
      } catch (err) {
        console.error('Error fetching disposal guideline:', err);
        setError('Failed to load disposal guideline details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuideline();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading disposal guideline details...</p>
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
          <Link href="/disposal-guidelines" className="btn btn-primary">
            Back to Disposal Guidelines
          </Link>
        </div>
      </div>
    );
  }

  if (!guideline) {
    return (
      <div className="my-5">
        <div className="alert alert-warning" role="alert">
          Disposal guideline not found.
        </div>
        <div className="text-center mt-4">
          <Link href="/disposal-guidelines" className="btn btn-primary">
            Back to Disposal Guidelines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{guideline.title}</h1>
        <Link href="/disposal-guidelines" className="btn btn-outline-primary">
          Back to Disposal Guidelines
        </Link>
      </div>

      <div className="row">
        <div className="col-md-8">
          {guideline.imageUrl && (
            <div className="card mb-4">
              <img
                src={guideline.imageUrl}
                className="card-img-top"
                alt={guideline.title}
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="card mb-4">
            <div className="card-body">
              <div className="mb-3">
                <h5>Description</h5>
                <p>{guideline.description}</p>
              </div>

              <div className="mb-3">
                <h5>Waste Category</h5>
                <p>
                  <span className="badge bg-info">{guideline.wasteCategory}</span>
                </p>
              </div>

              <div className="mb-4">
                <h5>Steps to Follow</h5>
                <ol className="list-group list-group-numbered">
                  {guideline.steps.map((step, index) => (
                    <li className="list-group-item" key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              {guideline.videoUrl && (
                <div className="mb-4">
                  <h5>Instructional Video</h5>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={guideline.videoUrl}
                      title={guideline.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Helpful Tips</h5>
            </div>
            <ul className="list-group list-group-flush">
              {guideline.tips.map((tip, index) => (
                <li className="list-group-item" key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          {guideline.relatedCategories && guideline.relatedCategories.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Related Categories</h5>
              </div>
              <ul className="list-group list-group-flush">
                {guideline.relatedCategories.map((category, index) => (
                  <li className="list-group-item" key={index}>{category}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Information</h5>
            </div>
            <ul className="list-group list-group-flush">
              {guideline.createdAt && (
                <li className="list-group-item">
                  <strong>Created:</strong> {new Date(guideline.createdAt).toLocaleDateString()}
                </li>
              )}
              {guideline.updatedAt && (
                <li className="list-group-item">
                  <strong>Last Updated:</strong> {new Date(guideline.updatedAt).toLocaleDateString()}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
