'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { disposalGuidelinesAPI } from '../../lib/api';
import { useLoading } from '../../context/LoadingContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
  const [error, setError] = useState('');
  const { isLoading, setLoading, setLoadingMessage } = useLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchGuidelines = async () => {
      setLoading(true);
      setLoadingMessage('Loading disposal guidelines...');
      try {
        const data = await disposalGuidelinesAPI.getAll();
        if (Array.isArray(data)) {
          setGuidelines(data);
          const uniqueCategories = [...new Set(data.map(guideline => guideline.wasteCategory))];
          setCategories(uniqueCategories);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching disposal guidelines:', err);
        setError('Failed to load disposal guidelines. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuidelines();
  }, [router, setLoading, setLoadingMessage]);

  const filteredGuidelines = guidelines.filter(guideline => {
    if (!guideline?.title || !guideline?.description) return false;
    
    const matchesSearch = (guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = !selectedCategory || guideline.wasteCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Disposal Guidelines</h1>
          <p className="text-gray-600 mt-2">Learn the proper methods for disposing different types of waste</p>
        </div>
        <Link href="/dashboard" className="btn btn-outline mt-4 md:mt-0 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="alert alert-danger mb-6"
          role="alert"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8 shadow-sm"
      >
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
                  placeholder="Search disposal guidelines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="form-control"
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

          {searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center"
            >
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
            </motion.div>
          )}
        </div>
      </motion.div>

      {filteredGuidelines.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-6"
        >
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No disposal guidelines found matching your criteria.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredGuidelines.map((guideline, index) => (
            <motion.div
              key={guideline.id}
              variants={itemVariants}
              className="card h-full hover:shadow-card-hover transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-dark-900">{guideline.title}</h3>
                  <span className="badge badge-primary">{guideline.wasteCategory}</span>
                </div>
                <p className="text-gray-600 mb-4">{guideline.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Steps to Follow:</h4>
                  <ul className="space-y-2">
                    {guideline.steps.map((step, stepIndex) => (
                      <motion.li
                        key={stepIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: stepIndex * 0.1 }}
                        className="flex items-start"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 mr-3 flex-shrink-0">
                          {stepIndex + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {guideline.tips.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Helpful Tips:</h4>
                    <ul className="space-y-2">
                      {guideline.tips.map((tip, tipIndex) => (
                        <motion.li
                          key={tipIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tipIndex * 0.1 }}
                          className="flex items-start"
                        >
                          <span className="text-primary-500 mr-2">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="card-footer bg-gray-50">
                <Link
                  href={`/disposal-guidelines/${guideline.id}`}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  <span>View Full Guide</span>
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}