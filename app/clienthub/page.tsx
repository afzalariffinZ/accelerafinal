'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

interface ContractSummary {
  requestId: string;
  status: string;
  submissionDate: string;
  numberOfSeats: string;
  priorityLevel: string;
  expectedTimeline: string;
  featureDescription: string;
}

const ClientHub = () => {
  const router = useRouter();
  const [contracts, setContracts] = useState<ContractSummary[]>([]);
  const [activeTab, setActiveTab] = useState('ongoing');

  useEffect(() => {
    // Load all submitted requests from localStorage
    // In a real app, this would be an API call to fetch user's contracts
    const storedRequest = localStorage.getItem('submittedRequest');
    if (storedRequest) {
      const request = JSON.parse(storedRequest);
      
      // Create multiple sample requests with different statuses for demonstration
      const sampleContracts = [
        {
          requestId: request.requestId,
          status: request.status || 'submitted',
          submissionDate: request.submissionDate,
          numberOfSeats: request.numberOfSeats,
          priorityLevel: request.priorityLevel,
          expectedTimeline: request.expectedTimeline,
          featureDescription: request.featureDescription
        },
        // Sample ongoing request
        {
          requestId: 'REQ-' + (Date.now() - 86400000), // Yesterday
          status: 'in_progress',
          submissionDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
          numberOfSeats: '150',
          priorityLevel: 'medium',
          expectedTimeline: 'Q1 2026',
          featureDescription: 'Integration with existing CRM system, custom workflow automation, and enhanced reporting capabilities for sales team optimization.'
        },
        // Sample completed request
        {
          requestId: 'REQ-' + (Date.now() - 172800000), // 2 days ago
          status: 'completed',
          submissionDate: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
          numberOfSeats: '75',
          priorityLevel: 'low',
          expectedTimeline: 'Q4 2025',
          featureDescription: 'Basic user management system with role-based access control and standard reporting features.'
        }
      ];
      
      setContracts(sampleContracts);
    }
  }, []);

  const handleContractClick = (requestId: string) => {
    router.push(`/requestdetail?id=${requestId}`);
  };

  const handleNewRequest = () => {
    router.push('/request');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_progress':
        return 'IN PROGRESS';
      case 'completed':
        return 'COMPLETED';
      case 'submitted':
        return 'SUBMITTED';
      case 'pending':
        return 'PENDING';
      default:
        return status.toUpperCase();
    }
  };

  const organizeContractsByStatus = () => {
    const ongoing = contracts.filter(contract => 
      ['submitted', 'in_progress', 'pending'].includes(contract.status.toLowerCase())
    );
    const completed = contracts.filter(contract => 
      contract.status.toLowerCase() === 'completed'
    );
    
    return { ongoing, completed };
  };

  const { ongoing, completed } = organizeContractsByStatus();

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const renderContractCard = (contract: ContractSummary, isCompleted: boolean = false) => (
    <div
      key={contract.requestId}
      onClick={() => handleContractClick(contract.requestId)}
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group ${
        isCompleted ? 'hover:border-green-200 opacity-90' : 'hover:border-purple-200'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className={`text-lg font-semibold text-gray-900 transition-colors ${
              isCompleted ? 'group-hover:text-green-600' : 'group-hover:text-purple-600'
            }`}>
              {contract.requestId}
            </h3>
            <p className="text-sm text-gray-500">
              Submitted: {formatDate(contract.submissionDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
            {isCompleted && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {getStatusDisplayName(contract.status)}
          </span>
          <svg className={`w-5 h-5 text-gray-400 transition-colors ${
            isCompleted ? 'group-hover:text-green-600' : 'group-hover:text-purple-600'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Seats Required</p>
          <p className="font-medium text-gray-900">{contract.numberOfSeats} licenses</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Priority</p>
          <p className={`font-medium capitalize ${getPriorityColor(contract.priorityLevel)}`}>
            {contract.priorityLevel}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Expected Timeline</p>
          <p className="font-medium text-gray-900">{contract.expectedTimeline}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">Feature Requirements</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {truncateText(contract.featureDescription, 200)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Hub</h1>
            <p className="text-gray-600">Manage your requests and track progress</p>
          </div>
          <button
            onClick={handleNewRequest}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ongoing'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ongoing Requests
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed Requests
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'ongoing' && (
              <div className="space-y-8">
                {ongoing.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Ongoing Requests</h2>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {ongoing.length} active
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {ongoing.map((contract) => renderContractCard(contract, false))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Ongoing Requests</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      You currently have no active requests in progress.
                    </p>
                    <button
                      onClick={handleNewRequest}
                      className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Submit Your First Request
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-8">
                {completed.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Completed Requests</h2>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {completed.length} completed
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {completed.map((contract) => renderContractCard(contract, true))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Completed Requests</h3>
                    <p className="text-gray-600">You don't have any completed requests yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHub;