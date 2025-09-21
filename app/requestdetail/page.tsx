'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';

interface SubmittedRequest {
  numberOfSeats: string;
  userTypes: {
    admin: number;
    standard: number;
    viewer: number;
  };
  featureDescription: string;
  priorityLevel: string;
  expectedTimeline: string;
  businessJustification: string;
  paymentPreference: string;
  monthlyRevenue: string;
  seasonalPatterns: string;
  preferredPaymentMonths: string;
  budgetConstraints: string;
  financialYearCycle: string;
  submissionDate: string;
  requestId: string;
  status: string;
}

const WorkflowProgress = () => {
  const steps = [
    { id: 1, title: 'Request Submitted', status: 'completed' },
    { id: 2, title: 'AI Analysis', status: 'current' },
    { id: 3, title: 'Finance Review', status: 'pending' },
    { id: 4, title: 'Client Approval', status: 'pending' },
    { id: 5, title: 'Implementation', status: 'pending' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Workflow Progress</h3>
      <div className="relative">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ${
                  step.status === 'completed'
                    ? 'bg-green-500 text-white border-green-500'
                    : step.status === 'current'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-500 border-gray-300'
                }`}
              >
                {step.status === 'completed' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-3 text-center max-w-24">
                <p
                  className={`text-xs font-medium leading-tight ${
                    step.status === 'completed' || step.status === 'current'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute top-5 left-5 right-5 h-0.5 bg-gray-300 z-0"></div>
      </div>
    </div>
  );
};

const RequestDetailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [requestData, setRequestData] = useState<SubmittedRequest | null>(null);
  
  const requestId = searchParams.get('id');

  useEffect(() => {
    // Load submitted request data from localStorage
    const storedRequest = localStorage.getItem('submittedRequest');
    if (storedRequest) {
      const request = JSON.parse(storedRequest);
      // If specific ID is requested, check if it matches
      if (!requestId || request.requestId === requestId) {
        setRequestData(request);
      } else {
        // Could fetch specific request by ID from API here
        setRequestData(request);
      }
    } else {
      // If no request data, redirect to clienthub
      router.push('/clienthub');
    }
  }, [requestId, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!requestData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading request details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center">
          <button
            onClick={() => router.push('/clienthub')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Details</h1>
            <p className="text-gray-600">Track your request progress and manage details</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Request Overview
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approval'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Approval
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invoices'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Invoices
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Workflow Progress */}
            <WorkflowProgress />

            {/* Request Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Request ID</p>
                  <p className="font-medium text-gray-900">{requestData.requestId}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {formatDate(requestData.submissionDate)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Subscription Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Subscription Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Seats:</span>
                      <span className="text-gray-900">{requestData.numberOfSeats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admin Users:</span>
                      <span className="text-gray-900">{requestData.userTypes.admin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standard Users:</span>
                      <span className="text-gray-900">{requestData.userTypes.standard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Viewer Users:</span>
                      <span className="text-gray-900">{requestData.userTypes.viewer}</span>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className={`text-gray-900 capitalize ${
                        requestData.priorityLevel === 'critical' ? 'text-red-600' :
                        requestData.priorityLevel === 'high' ? 'text-orange-600' :
                        requestData.priorityLevel === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {requestData.priorityLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="text-gray-900">{requestData.expectedTimeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="text-gray-900 capitalize">{requestData.paymentPreference.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Description */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Feature Requirements</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {requestData.featureDescription}
                </p>
              </div>

              {/* Business Justification */}
              {requestData.businessJustification && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Business Justification</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {requestData.businessJustification}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'approval' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Approval Status</h3>
            
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-medium text-green-900">Finance Review Completed - Awaiting Your Approval</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your request has been reviewed and approved by our finance team. Please review the details below and provide your final approval.
                    </p>
                  </div>
                </div>
              </div>

              {/* Approval Steps */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Approval Process</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-900">Request Submitted</h5>
                      <p className="text-sm text-green-700">Your request has been successfully submitted and entered our system.</p>
                      <p className="text-xs text-green-600 mt-1">✓ Completed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-900">AI Analysis</h5>
                      <p className="text-sm text-green-700">AI evaluation completed successfully with positive feasibility assessment.</p>
                      <p className="text-xs text-green-600 mt-1">✓ Completed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-900">Finance Review</h5>
                      <p className="text-sm text-green-700">Financial analysis completed and pricing approved by finance team.</p>
                      <p className="text-xs text-green-600 mt-1">✓ Completed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-900">Client Approval</h5>
                      <p className="text-sm text-blue-700">Waiting for your final approval to proceed with implementation.</p>
                      <p className="text-xs text-blue-600 mt-1">🔄 Awaiting Your Decision</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5"></div>
                    <div>
                      <h5 className="font-medium text-gray-600">Activation</h5>
                      <p className="text-sm text-gray-500">Activation of your requested request.</p>
                      <p className="text-xs text-gray-500 mt-1">⏳ Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Approval Information */}
              <div className="space-y-6">
                <h4 className="font-medium text-gray-900">Approval Details</h4>
                
                {/* Client Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Client Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Client Name:</span>
                      <p className="text-gray-900">Enterprise Customer</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="text-gray-900">customer@example.com</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Company:</span>
                      <p className="text-gray-900">Customer Company</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Timeline:</span>
                      <p className="text-gray-900">Q2 2026</p>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Project Title</h5>
                  <p className="text-lg font-medium text-gray-900 mb-4">HIGH Priority Enterprise Solution - 250 Seats</p>
                  
                  <h6 className="font-medium text-gray-700 mb-2">Description</h6>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We need advanced analytics dashboard with real-time data visualization, custom reporting capabilities, and AI-powered insights. The system should support multiple data sources including CRM, ERP, and marketing automation platforms. Key features include: automated report generation, predictive analytics, role-based access controls, and mobile responsiveness.
                  </p>
                </div>

                {/* Financial Analysis */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Financial Analysis</h5>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Analysis Inputs */}
                    <div>
                      <h6 className="font-medium text-gray-700 mb-3">Analysis Inputs</h6>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Payment:</span>
                          <span className="font-medium text-gray-900">RM 1,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Frequency:</span>
                          <span className="text-gray-900">Monthly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">New Frequency:</span>
                          <span className="text-gray-900">Quarterly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining Years:</span>
                          <span className="text-gray-900">5 years</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculation Results */}
                    <div>
                      <h6 className="font-medium text-gray-700 mb-3">Calculation Results</h6>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Present Value:</span>
                          <span className="font-medium text-gray-900">RM 12,100.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">New Equivalent Payment:</span>
                          <span className="font-medium text-gray-900">RM 11,900.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Potential Savings:</span>
                          <span className="font-medium text-green-600">RM 200.00</span>
                        </div>
                        <div className="text-center">
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            1.7% savings
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Economic Assumptions */}
                    <div>
                      <h6 className="font-medium text-gray-700 mb-3">Economic Assumptions</h6>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Inflation Rate:</span>
                          <span className="text-gray-900">3.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk-Free Rate:</span>
                          <span className="text-gray-900">3.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval Actions */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Your Decision Required</h5>
                  <p className="text-sm text-gray-600 mb-6">
                    Please review the above details carefully. By approving, you agree to proceed with the project under the specified terms and conditions.
                  </p>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('invoices')}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      ✓ Approve & Proceed to Payment
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reject this proposal? This action cannot be undone.')) {
                          alert('Proposal rejected. Our team will be notified and will contact you shortly.');
                        }
                      }}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      ✗ Reject Proposal
                    </button>
                  </div>
                </div>
              </div>

              {/* Estimated Timeline */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Estimated Timeline</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-yellow-800">
                      <strong>Expected completion:</strong> {requestData.expectedTimeline} from approval
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    If you have questions about the approval process or need to modify your request:
                  </p>
                  <div className="text-sm text-gray-700">
                    <p>📧 Email: support@accelereal.com</p>
                    <p>📞 Phone: +60 12-345-6789</p>
                    <p>💬 Live Chat: Available 9 AM - 6 PM MYT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-light text-gray-600 tracking-wide mb-8">INVOICE</h1>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">ISSUED TO:</p>
                  <p className="text-gray-900">Enterprise Customer</p>
                  <p className="text-gray-600">Customer Company</p>
                  <p className="text-gray-600">123 Anywhere St., Any City</p>
                </div>
              </div>
              <div className="text-right">
                <div className="space-y-1 mb-6">
                  <p className="text-sm text-gray-600">INVOICE NO: <span className="text-gray-900">01234</span></p>
                  <p className="text-sm text-gray-600">DATE: <span className="text-gray-900">{new Date().toLocaleDateString('en-GB')}</span></p>
                  <p className="text-sm text-gray-600">DUE DATE: <span className="text-gray-900">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">PAY TO:</p>
                  <p className="text-gray-900">Accelereal Sdn Bhd</p>
                  <p className="text-gray-600">Account Name: Accelereal Enterprise</p>
                  <p className="text-gray-600">Account No.: 0123 4567 8901</p>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <div className="border-b border-gray-300 pb-4 mb-6">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-900">
                  <div className="col-span-6">DESCRIPTION</div>
                  <div className="col-span-2 text-center">UNIT PRICE</div>
                  <div className="col-span-2 text-center">QTY</div>
                  <div className="col-span-2 text-right">TOTAL</div>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-12 gap-4 py-2">
                  <div className="col-span-6 text-gray-900">Enterprise Analytics Dashboard</div>
                  <div className="col-span-2 text-center text-gray-600">2,980</div>
                  <div className="col-span-2 text-center text-gray-600">1</div>
                  <div className="col-span-2 text-right text-gray-900">RM 2,980</div>
                </div>
                <div className="grid grid-cols-12 gap-4 py-2">
                  <div className="col-span-6 text-gray-900">Real-time Data Visualization</div>
                  <div className="col-span-2 text-center text-gray-600">1,500</div>
                  <div className="col-span-2 text-center text-gray-600">1</div>
                  <div className="col-span-2 text-right text-gray-900">RM 1,500</div>
                </div>
                <div className="grid grid-cols-12 gap-4 py-2">
                  <div className="col-span-6 text-gray-900">Custom Reporting Module</div>
                  <div className="col-span-2 text-center text-gray-600">2,200</div>
                  <div className="col-span-2 text-center text-gray-600">1</div>
                  <div className="col-span-2 text-right text-gray-900">RM 2,200</div>
                </div>
                <div className="grid grid-cols-12 gap-4 py-2">
                  <div className="col-span-6 text-gray-900">AI-Powered Insights Engine</div>
                  <div className="col-span-2 text-center text-gray-600">3,500</div>
                  <div className="col-span-2 text-center text-gray-600">1</div>
                  <div className="col-span-2 text-right text-gray-900">RM 3,500</div>
                </div>
                <div className="grid grid-cols-12 gap-4 py-2">
                  <div className="col-span-6 text-gray-900">Role-based Access Control</div>
                  <div className="col-span-2 text-center text-gray-600">1,200</div>
                  <div className="col-span-2 text-center text-gray-600">1</div>
                  <div className="col-span-2 text-right text-gray-900">RM 1,200</div>
                </div>
                <div className="grid grid-cols-12 gap-4 py-2">
                  <div className="col-span-6 text-gray-900">Mobile Responsive Design</div>
                  <div className="col-span-2 text-center text-gray-600">520</div>
                  <div className="col-span-2 text-center text-gray-600">1</div>
                  <div className="col-span-2 text-right text-gray-900">RM 520</div>
                </div>
              </div>

              {/* Invoice Totals */}
              <div className="border-t border-gray-300 mt-8 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">SUBTOTAL</span>
                    <span className="text-gray-900">RM 11,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax</span>
                    <span className="text-gray-600">6%</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">TOTAL</span>
                      <span className="text-lg font-bold text-gray-900">RM 12,614</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Payment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700"><strong>Bank:</strong> Maybank</p>
                  <p className="text-blue-700"><strong>Account Name:</strong> Accelereal Enterprise Sdn Bhd</p>
                  <p className="text-blue-700"><strong>Account Number:</strong> 0123 4567 8901</p>
                </div>
                <div>
                  <p className="text-blue-700"><strong>Payment Due:</strong> 30 days from invoice date</p>
                  <p className="text-blue-700"><strong>Late Payment:</strong> 2% monthly penalty applies</p>
                  <p className="text-blue-700"><strong>Reference:</strong> Please quote Invoice #01234</p>
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  alert('Redirecting to secure payment gateway...\n\nThis would typically redirect to:\n- Online banking\n- Credit card payment\n- Digital wallet payment');
                }}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay Now - RM 12,614
              </button>
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head><title>Invoice #01234</title></head>
                        <body style="font-family: Arial, sans-serif; margin: 40px;">
                          ${document.querySelector('[data-invoice-content]')?.innerHTML || 'Invoice content'}
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Download PDF
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Terms & Conditions</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Payment is due within 30 days of invoice date</p>
                <p>• Late payments are subject to a 2% monthly penalty charge</p>
                <p>• Development begins upon receipt of 50% deposit</p>
                <p>• Final delivery upon completion of payment</p>
                <p>• All prices are in Malaysian Ringgit (RM) and inclusive of 6% SST</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RequestDetail = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading request details...</p>
          </div>
        </div>
      </div>
    }>
      <RequestDetailContent />
    </Suspense>
  );
};

export default RequestDetail;