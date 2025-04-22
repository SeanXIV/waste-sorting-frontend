'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { disposalGuidelinesAPI } from '../../lib/api';

type DisposalGuideline = {
  id: string;
  title: string;
  description: string;
  wasteCategory: string;
  steps: string[];
  tips: string[];
  imageUrl?: string;
};

export default function DisposalGuidelines() {
  const router = useRouter();
  const [guidelines, setGuidelines] = useState<DisposalGuideline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch disposal guidelines
    const fetchGuidelines = async () => {
      try {
        const data = await disposalGuidelinesAPI.getAll();
        setGuidelines(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((guideline: DisposalGuideline) => guideline.wasteCategory))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching disposal guidelines:', err);
        setError('Failed to load disposal guidelines. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuidelines();
  }, [router]);

  // Filter guidelines based on search term and selected category
  const filteredGuidelines = guidelines.filter(guideline => {
    const matchesSearch = guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === '' || guideline.wasteCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading disposal guidelines...</p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Disposal Guidelines</h1>
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
                  placeholder="Search disposal guidelines..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredGuidelines.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No disposal guidelines found matching your criteria.
        </div>
      ) : (
        <div className="row">
          {filteredGuidelines.map((guideline) => (
            <div className="col-md-6 mb-4" key={guideline.id}>
              <div className="card h-100">
                {guideline.imageUrl && (
                  <img
                    src={guideline.imageUrl}
                    className="card-img-top"
                    alt={guideline.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{guideline.title}</h5>
                  <p className="card-text">{guideline.description}</p>
                  <p className="card-text">
                    <span className="badge bg-info">{guideline.wasteCategory}</span>
                  </p>

                  <h6>Steps:</h6>
                  <ol className="list-group list-group-numbered mb-3">
                    {guideline.steps.map((step, index) => (
                      <li className="list-group-item" key={index}>{step}</li>
                    ))}
                  </ol>

                  <h6>Tips:</h6>
                  <ul className="list-group mb-3">
                    {guideline.tips.map((tip, index) => (
                      <li className="list-group-item" key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div className="card-footer">
                  <Link
                    href={`/disposal-guidelines/${guideline.id}`}
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
