'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

interface PendingRequest {
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

const RequestConfirmation = () => {
  const router = useRouter();
  const [requestData, setRequestData] = useState<PendingRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Load pending request data from localStorage
    const storedRequest = localStorage.getItem('pendingRequest');
    if (storedRequest) {
      setRequestData(JSON.parse(storedRequest));
      
      // Simulate AI processing time
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    } else {
      // If no pending request, redirect to request page
      router.push('/request');
    }
  }, [router]);

  const generateAIEnhancedSummary = (data: PendingRequest) => {
    const totalUsers = data.userTypes.admin + data.userTypes.standard + data.userTypes.viewer;
    const priorityEmoji = {
      'critical': '🔴',
      'high': '🟠', 
      'medium': '🟡',
      'low': '🟢'
    }[data.priorityLevel] || '⚪';

    return {
      executiveSummary: `${data.requestId}: Enterprise-grade solution for ${totalUsers} users with ${data.priorityLevel} priority implementation targeting ${data.expectedTimeline}. Our AI analysis indicates this project aligns with modern scalability requirements and estimated ${data.paymentPreference === 'installment' ? 'flexible payment structure' : data.paymentPreference === 'lump_sum' ? 'upfront investment model' : 'optimized payment strategy'}.`,
      
      technicalAnalysis: `Based on your requirements for ${data.numberOfSeats} licenses, our AI recommends a scalable architecture supporting ${data.userTypes.admin} administrators, ${data.userTypes.standard} standard users, and ${data.userTypes.viewer} viewers. The proposed solution incorporates enterprise-grade security, role-based access controls, and seamless integration capabilities.`,
      
      implementationStrategy: `Priority ${data.priorityLevel.toUpperCase()} classification ensures dedicated resource allocation. Target completion: ${data.expectedTimeline}. Recommended approach: Agile methodology with bi-weekly sprints, continuous integration, and user acceptance testing phases.`,
      
      financialOptimization: data.monthlyRevenue ? `Revenue analysis (${data.monthlyRevenue}) suggests ${data.paymentPreference === 'installment' ? 'quarterly payment schedule aligning with cash flow patterns' : data.paymentPreference === 'lump_sum' ? 'upfront payment with enterprise discount eligibility' : 'AI-optimized payment structure based on seasonal patterns'}. ${data.preferredPaymentMonths ? `Preferred payment months (${data.preferredPaymentMonths}) incorporated into financial planning.` : ''}` : 'Custom payment structure to be determined based on final scope.',
      
      riskAssessment: `Low complexity risk profile. Standard implementation timeline. ${data.budgetConstraints ? `Budget constraints (${data.budgetConstraints}) accommodate recommended solution scope.` : 'Flexible budget allocation recommended.'}`,
      
      nextSteps: [
        'Technical architecture review (1-2 business days)',
        'Resource allocation and team assignment',
        'Detailed project timeline creation',
        'Final cost estimation and contract preparation',
        'Client approval and project kickoff'
      ]
    };
  };

  const handleConfirmSubmission = () => {
    if (!requestData) return;

    // Move from pending to submitted status
    const confirmedRequest = {
      ...requestData,
      status: 'submitted',
      confirmedDate: new Date().toISOString()
    };

    // Store confirmed request for client hub
    localStorage.setItem('submittedRequest', JSON.stringify(confirmedRequest));
    localStorage.removeItem('pendingRequest');

    // Navigate to request detail page
    router.push(`/requestdetail?id=${confirmedRequest.requestId}`);
  };

  const handleEditRequest = () => {
    router.push('/request');
  };

  if (!requestData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-gray-600">Loading request data...</p>
          </div>
        </div>
      </div>
    );
  }

  const aiSummary = generateAIEnhancedSummary(requestData);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Confirmation</h1>
          <p className="text-gray-600">AI-Enhanced Analysis of Your Enterprise Request</p>
        </div>

        {/* AI Processing Indicator */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <div>
                <h3 className="text-blue-800 font-medium">AI Analysis in Progress</h3>
                <p className="text-blue-600 text-sm">Optimizing your request parameters and generating recommendations...</p>
              </div>
            </div>
          </div>
        )}

        {!isProcessing && (
          <>
            {/* AI Analysis Results */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">AI-Enhanced Request Summary</h2>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">🤖 Executive Summary</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{aiSummary.executiveSummary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🔧 Technical Analysis</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiSummary.technicalAnalysis}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Implementation Strategy</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiSummary.implementationStrategy}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💰 Financial Optimization</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiSummary.financialOptimization}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">⚡ Risk Assessment</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiSummary.riskAssessment}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">🎯 Recommended Next Steps</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {aiSummary.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Original Request Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📋 Your Original Request Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Request Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">ID:</span> <span className="text-gray-900 font-medium">{requestData.requestId}</span></p>
                    <p><span className="text-gray-600">Priority:</span> <span className="capitalize text-gray-900 font-medium">{requestData.priorityLevel}</span></p>
                    <p><span className="text-gray-600">Timeline:</span> <span className="text-gray-900 font-medium">{requestData.expectedTimeline}</span></p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Subscription Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Total Seats:</span> <span className="text-gray-900 font-medium">{requestData.numberOfSeats}</span></p>
                    <p><span className="text-gray-600">Admin:</span> <span className="text-gray-900 font-medium">{requestData.userTypes.admin}</span></p>
                    <p><span className="text-gray-600">Standard:</span> <span className="text-gray-900 font-medium">{requestData.userTypes.standard}</span></p>
                    <p><span className="text-gray-600">Viewer:</span> <span className="text-gray-900 font-medium">{requestData.userTypes.viewer}</span></p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Payment Preference</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Method:</span> <span className="capitalize text-gray-900 font-medium">{requestData.paymentPreference.replace('_', ' ')}</span></p>
                    {requestData.monthlyRevenue && (
                      <p><span className="text-gray-600">Revenue:</span> <span className="text-gray-900 font-medium">{requestData.monthlyRevenue}</span></p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Feature Requirements</h3>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 leading-relaxed">{requestData.featureDescription}</p>
                </div>
                
                {requestData.businessJustification && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Business Justification</h3>
                    <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 leading-relaxed">{requestData.businessJustification}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleEditRequest}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                ← Edit Request
              </button>
              
              <button
                onClick={handleConfirmSubmission}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2"
              >
                Confirm & Submit Request
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestConfirmation;