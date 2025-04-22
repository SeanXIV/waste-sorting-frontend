'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { reportsAPI } from '../../lib/api';

type ReportData = {
  categoryName?: string;
  location?: string;
  status?: string;
  count: number;
  percentage?: number;
};

type ComprehensiveReport = {
  byCategory: ReportData[];
  byLocation: ReportData[];
  byStatus: ReportData[];
  recyclableVsNonRecyclable: {
    recyclable: number;
    nonRecyclable: number;
    recyclablePercentage: number;
    nonRecyclablePercentage: number;
  };
  totalCollections: number;
};

export default function Reports() {
  const router = useRouter();
  const [report, setReport] = useState<ComprehensiveReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('comprehensive');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch report data
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        let data;
        switch (reportType) {
          case 'comprehensive':
            data = await reportsAPI.getComprehensive();
            break;
          case 'by-category':
            data = await reportsAPI.getByCategory();
            break;
          case 'by-location':
            data = await reportsAPI.getByLocation();
            break;
          case 'by-status':
            data = await reportsAPI.getByStatus();
            break;
          case 'recyclable-vs-non-recyclable':
            data = await reportsAPI.getRecyclableVsNonRecyclable();
            break;
          default:
            data = await reportsAPI.getComprehensive();
        }
        setReport(data);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load report data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, router]);

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading report data...</p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Waste Management Reports</h1>
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
            <div className="col-md-6">
              <label htmlFor="reportType" className="form-label">Report Type</label>
              <select
                id="reportType"
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="comprehensive">Comprehensive Report</option>
                <option value="by-category">By Category</option>
                <option value="by-location">By Location</option>
                <option value="by-status">By Status</option>
                <option value="recyclable-vs-non-recyclable">Recyclable vs Non-Recyclable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {report && (
        <div className="row">
          {/* Recyclable vs Non-Recyclable */}
          {(reportType === 'comprehensive' || reportType === 'recyclable-vs-non-recyclable') && report.recyclableVsNonRecyclable && (
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Recyclable vs Non-Recyclable</h5>
                </div>
                <div className="card-body">
                  <div className="progress mb-3" style={{ height: '30px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${report.recyclableVsNonRecyclable.recyclablePercentage}%` }}
                      aria-valuenow={report.recyclableVsNonRecyclable.recyclablePercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {report.recyclableVsNonRecyclable.recyclablePercentage}% Recyclable
                    </div>
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: `${report.recyclableVsNonRecyclable.nonRecyclablePercentage}%` }}
                      aria-valuenow={report.recyclableVsNonRecyclable.nonRecyclablePercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {report.recyclableVsNonRecyclable.nonRecyclablePercentage}% Non-Recyclable
                    </div>
                  </div>
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Recyclable</h6>
                          <p className="card-text">{report.recyclableVsNonRecyclable.recyclable} items</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Non-Recyclable</h6>
                          <p className="card-text">{report.recyclableVsNonRecyclable.nonRecyclable} items</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* By Category */}
          {(reportType === 'comprehensive' || reportType === 'by-category') && report.byCategory && (
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Waste by Category</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.byCategory.map((item, index) => (
                          <tr key={index}>
                            <td>{item.categoryName}</td>
                            <td>{item.count}</td>
                            <td>{item.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* By Location */}
          {(reportType === 'comprehensive' || reportType === 'by-location') && report.byLocation && (
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Waste by Location</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Location</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.byLocation.map((item, index) => (
                          <tr key={index}>
                            <td>{item.location}</td>
                            <td>{item.count}</td>
                            <td>{item.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* By Status */}
          {(reportType === 'comprehensive' || reportType === 'by-status') && report.byStatus && (
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Waste by Status</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.byStatus.map((item, index) => (
                          <tr key={index}>
                            <td>{item.status}</td>
                            <td>{item.count}</td>
                            <td>{item.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total Collections */}
          {reportType === 'comprehensive' && (
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Summary</h5>
                </div>
                <div className="card-body">
                  <div className="text-center">
                    <h2 className="display-4">{report.totalCollections}</h2>
                    <p className="lead">Total Waste Collections</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
