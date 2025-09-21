'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

interface ReportData {
  status: string;
  report_data: {
    inputs: {
      current_payment_MYR: number;
      current_frequency: string;
      new_frequency: string;
      remaining_years: number;
    };
    calculation_results: {
      original_present_value_MYR: number;
      new_equivalent_payment_MYR: number;
    };
    economic_assumptions: {
      inflation_rate: number;
      risk_free_rate: number;
    };
  };
  s3_location: string;
}

interface ClientRequest {
  id: number;
  request_id: string;
  full_name: string;
  email: string;
  company: string;
  request_type: string;
  project_title: string;
  description: string;
  timeline: string;
  budget: string;
  status: 'pending' | 'accepted' | 'rejected' | 'submitted'; // submitted is legacy, will be treated as pending
  priority: string;
  created_at: string;
}

const ReportPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get('requestId');
  
  const [request, setRequest] = useState<ClientRequest | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (requestId) {
      fetchRequestData();
    }
  }, [requestId]);

  const fetchRequestData = async () => {
    try {
      const response = await fetch(`/api/requests/client?requestId=${requestId}`);
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        setRequest(result.data[0]);
        
        // Generate mock report data based on the provided JSON structure
        const mockReportData: ReportData = {
          status: "Success",
          report_data: {
            inputs: {
              current_payment_MYR: 1000,
              current_frequency: "monthly",
              new_frequency: "quarterly",
              remaining_years: 5
            },
            calculation_results: {
              original_present_value_MYR: 12100,
              new_equivalent_payment_MYR: 11900
            },
            economic_assumptions: {
              inflation_rate: 0.032,
              risk_free_rate: 0.035
            }
          },
          s3_location: "s3://client-data-hfh/llm-generated-reports/report-2025-09-21T13-32-55Z.json"
        };
        
        setReportData(mockReportData);
      }
    } catch (error) {
      console.error('Error fetching request data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (newStatus: 'accepted' | 'rejected') => {
    if (!request) return;
    
    setUpdating(true);
    try {
      const response = await fetch('/api/requests/client', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: request.request_id,
          status: newStatus
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setRequest({...request, status: newStatus});
        alert(`Request ${newStatus} successfully!`);
        // Close the tab after a delay
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        alert('Failed to update request status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating request status');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return (rate * 100).toFixed(1) + '%';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'submitted': // Legacy support - treat as pending
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (!request || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <p className="text-gray-600">Unable to load the requested report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Requirement Analysis Report</h1>
              <p className="text-sm text-gray-500 mt-1">Request ID: {request.request_id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(request.status)}`}>
                {request.status.toUpperCase()}
              </span>
              <button
                onClick={() => window.print()}
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button className="text-indigo-600 border-indigo-500 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
              Request Overview
            </button>
            <button className="text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm">
              Invoices
            </button>
          </nav>
        </div>

        {/* Workflow Progress */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Workflow Progress</h2>
          <div className="flex items-center justify-between">
            {/* Step 1: Request Submitted */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">Request</div>
                <div className="text-sm text-gray-500">Submitted</div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

            {/* Step 2: AI Analysis */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                2
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">AI Analysis</div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

            {/* Step 3: Development Review */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">
                3
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-500">Development</div>
                <div className="text-sm text-gray-500">Review</div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

            {/* Step 4: Finance Review */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">
                4
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-500">Finance Review</div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

            {/* Step 5: Client Approval */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">
                5
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-500">Client Approval</div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

            {/* Step 6: Implementation */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">
                6
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-500">Implementation</div>
              </div>
            </div>
          </div>
        </div>
        {/* Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Analysis Status: {reportData.status}</span>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <p className="text-gray-900">{request.full_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{request.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <p className="text-gray-900">{request.company || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
              <p className="text-gray-900">{request.timeline || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <p className="text-gray-900">{request.project_title}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{request.description}</p>
            </div>
          </div>
        </div>

        {/* Financial Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Analysis Inputs */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Inputs</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">Current Payment</label>
                <p className="text-lg text-blue-900 font-semibold">
                  {formatCurrency(reportData.report_data.inputs.current_payment_MYR)}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">Current Frequency</label>
                <p className="text-lg text-blue-900 font-semibold capitalize">
                  {reportData.report_data.inputs.current_frequency}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">New Frequency</label>
                <p className="text-lg text-blue-900 font-semibold capitalize">
                  {reportData.report_data.inputs.new_frequency}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">Remaining Years</label>
                <p className="text-lg text-blue-900 font-semibold">
                  {reportData.report_data.inputs.remaining_years} years
                </p>
              </div>
            </div>
          </div>

          {/* Calculation Results */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calculation Results</h2>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-green-700 mb-1">Original Present Value</label>
                <p className="text-2xl text-green-900 font-bold">
                  {formatCurrency(reportData.report_data.calculation_results.original_present_value_MYR)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-green-700 mb-1">New Equivalent Payment</label>
                <p className="text-2xl text-green-900 font-bold">
                  {formatCurrency(reportData.report_data.calculation_results.new_equivalent_payment_MYR)}
                </p>
              </div>
              
              {/* Savings Calculation */}
              <div className="bg-green-100 rounded-lg p-4 border-2 border-green-200">
                <label className="block text-sm font-medium text-green-700 mb-1">Potential Savings</label>
                <p className="text-3xl text-green-900 font-bold">
                  {formatCurrency(
                    reportData.report_data.calculation_results.original_present_value_MYR - 
                    reportData.report_data.calculation_results.new_equivalent_payment_MYR
                  )}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  ({((reportData.report_data.calculation_results.original_present_value_MYR - 
                      reportData.report_data.calculation_results.new_equivalent_payment_MYR) / 
                      reportData.report_data.calculation_results.original_present_value_MYR * 100).toFixed(1)}% savings)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Economic Assumptions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Economic Assumptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-yellow-700 mb-1">Inflation Rate</label>
              <p className="text-lg text-yellow-900 font-semibold">
                {formatPercentage(reportData.report_data.economic_assumptions.inflation_rate)}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-yellow-700 mb-1">Risk-Free Rate</label>
              <p className="text-lg text-yellow-900 font-semibold">
                {formatPercentage(reportData.report_data.economic_assumptions.risk_free_rate)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(request.status === 'pending' || request.status === 'submitted') && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Decision</h2>
            <p className="text-gray-600 mb-6">
              Please review the financial analysis above and make a decision on this request.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => updateRequestStatus('accepted')}
                disabled={updating}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Accept Request
              </button>
              <button
                onClick={() => updateRequestStatus('rejected')}
                disabled={updating}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                Reject Request
              </button>
            </div>
          </div>
        )}

        {request.status !== 'pending' && request.status !== 'submitted' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${getStatusColor(request.status)}`}>
                Request {request.status.toUpperCase()}
              </div>
              <p className="text-gray-600 mt-2">This request has already been reviewed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReportPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ReportPageContent />
    </Suspense>
  );
};

export default ReportPage;