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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">Currently in AI Analysis Phase</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your request is being analyzed by our AI system to determine technical feasibility and resource requirements.
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

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-900">AI Analysis</h5>
                      <p className="text-sm text-blue-700">AI is evaluating requirements, complexity, and resource needs.</p>
                      <p className="text-xs text-blue-600 mt-1">🔄 In Progress</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5"></div>
                    <div>
                      <h5 className="font-medium text-gray-600">Finance Review</h5>
                      <p className="text-sm text-gray-500">Financial team will review pricing and create cost estimates.</p>
                      <p className="text-xs text-gray-500 mt-1">⏳ Pending</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5"></div>
                    <div>
                      <h5 className="font-medium text-gray-600">Client Approval</h5>
                      <p className="text-sm text-gray-500">You'll receive the proposal for final approval and payment.</p>
                      <p className="text-xs text-gray-500 mt-1">⏳ Pending</p>
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
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Invoices</h3>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Invoices Yet</h4>
              <p className="text-gray-600 mb-6">
                Invoices will appear here once your request moves to the finance review stage.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-700">
                  💡 <strong>What's next?</strong> Our team is currently analyzing your request. 
                  You'll receive invoices and payment options once we complete the technical and financial review.
                </p>
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