'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

const RequestPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Subscription Details
    numberOfSeats: '',
    userTypes: {
      admin: 0,
      standard: 0,
      viewer: 0
    },
    
    // Feature Request
    featureDescription: '',
    priorityLevel: '',
    expectedTimeline: '',
    businessJustification: '',
    
    // Payment Preference
    paymentPreference: '',
    
    // Cash Flow Data
    monthlyRevenue: '',
    seasonalPatterns: '',
    preferredPaymentMonths: '',
    budgetConstraints: '',
    financialYearCycle: ''
  });

  // Demo data for filling the form
  const demoData = {
    numberOfSeats: '250',
    userTypes: {
      admin: 10,
      standard: 200,
      viewer: 40
    },
    featureDescription: 'We need advanced analytics dashboard with real-time data visualization, custom reporting capabilities, and AI-powered insights. The system should support multiple data sources including CRM, ERP, and marketing automation platforms. Key features include: automated report generation, predictive analytics, role-based access controls, and mobile responsiveness.',
    priorityLevel: 'high',
    expectedTimeline: 'Q2 2026',
    businessJustification: 'This feature will improve our decision-making process by 40%, reduce manual reporting time by 60 hours per week, and provide better visibility into our business performance. Expected ROI of 300% within the first year through improved operational efficiency and data-driven strategies.',
    paymentPreference: 'installment',
    monthlyRevenue: 'RM 2,500,000 - RM 3,000,000',
    seasonalPatterns: 'Higher revenue during Q4 (holiday season) and Q1 (new year campaigns). Typically 20-30% increase during these periods. Q3 shows slight decline due to summer vacation periods.',
    preferredPaymentMonths: 'March, June, September, December',
    budgetConstraints: 'Maximum RM 500,000 per quarter for software investments',
    financialYearCycle: 'January - December'
  };

  const fillDemoData = () => {
    setFormData(demoData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('userTypes.')) {
      const userType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        userTypes: {
          ...prev.userTypes,
          [userType]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare data for API
      const requestData = {
        fullName: 'Enterprise Customer', // TODO: Add name field to the form
        email: 'customer@example.com', // TODO: Add email field to the form  
        company: 'Customer Company', // TODO: Add company field to the form
        requestType: 'enterprise-solution',
        projectTitle: `${formData.priorityLevel.toUpperCase()} Priority Enterprise Solution - ${formData.numberOfSeats} Seats`,
        description: formData.featureDescription,
        timeline: formData.expectedTimeline,
        budget: formData.monthlyRevenue || 'TBD',
      };

      // Save to database via API
      const response = await fetch('/api/requests/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.success) {
        // Store both form data and database response for confirmation page
        localStorage.setItem('pendingRequest', JSON.stringify({
          ...formData,
          submissionDate: new Date().toISOString(),
          requestId: result.requestId, // This is the database request ID
          status: 'pending',
          databaseId: result.data.id
        }));
        
        // Navigate to confirmation page
        router.push('/requestconfirmation');
      } else {
        throw new Error(result.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Sales Request</h1>
              <p className="text-gray-600">Tell us about your requirements and we'll create a customized solution for your organization.</p>
            </div>
            <button
              type="button"
              onClick={fillDemoData}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fill Demo Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subscription Details */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="numberOfSeats" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Seats/Licenses Needed *
                  </label>
                  <input
                    type="number"
                    id="numberOfSeats"
                    name="numberOfSeats"
                    value={formData.numberOfSeats}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">User Type Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="userTypes.admin" className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Users
                    </label>
                    <input
                      type="number"
                      id="userTypes.admin"
                      name="userTypes.admin"
                      value={formData.userTypes.admin}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="userTypes.standard" className="block text-sm font-medium text-gray-700 mb-2">
                      Standard Users
                    </label>
                    <input
                      type="number"
                      id="userTypes.standard"
                      name="userTypes.standard"
                      value={formData.userTypes.standard}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="userTypes.viewer" className="block text-sm font-medium text-gray-700 mb-2">
                      Viewer Users
                    </label>
                    <input
                      type="number"
                      id="userTypes.viewer"
                      name="userTypes.viewer"
                      value={formData.userTypes.viewer}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Feature Request */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Request</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="featureDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Feature Description *
                  </label>
                  <textarea
                    id="featureDescription"
                    name="featureDescription"
                    value={formData.featureDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Describe the specific features or functionality you need..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="priorityLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level *
                    </label>
                    <select
                      id="priorityLevel"
                      name="priorityLevel"
                      value={formData.priorityLevel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expectedTimeline" className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Timeline for Implementation
                    </label>
                    <input
                      type="text"
                      id="expectedTimeline"
                      name="expectedTimeline"
                      value={formData.expectedTimeline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="e.g., 3 months, Q2 2026"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessJustification" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Justification
                  </label>
                  <textarea
                    id="businessJustification"
                    name="businessJustification"
                    value={formData.businessJustification}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Explain the business impact and ROI expected from this feature..."
                  />
                </div>
              </div>
            </section>

            {/* Payment Preference */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Preference</h2>
              
              <div>
                <label htmlFor="paymentPreference" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Payment Structure *
                </label>
                <select
                  id="paymentPreference"
                  name="paymentPreference"
                  value={formData.paymentPreference}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select Payment Preference</option>
                  <option value="unspecified">Unspecified (Let AI optimize)</option>
                  <option value="lump_sum">Lump Sum (Full payment upfront)</option>
                  <option value="installment">Installment (Spread payments over time)</option>
                </select>
              </div>
            </section>

            {/* Cash Flow Data */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cash Flow Data</h2>
              <p className="text-sm text-gray-600 mb-4">Optional but recommended for optimized payment planning</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Revenue Figures
                    </label>
                    <input
                      type="text"
                      id="monthlyRevenue"
                      name="monthlyRevenue"
                      value={formData.monthlyRevenue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="e.g., RM 500,000 - RM 1,000,000"
                    />
                  </div>

                  <div>
                    <label htmlFor="financialYearCycle" className="block text-sm font-medium text-gray-700 mb-2">
                      Financial Year Cycle
                    </label>
                    <input
                      type="text"
                      id="financialYearCycle"
                      name="financialYearCycle"
                      value={formData.financialYearCycle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="e.g., January - December"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="seasonalPatterns" className="block text-sm font-medium text-gray-700 mb-2">
                    Seasonal Revenue Patterns
                  </label>
                  <textarea
                    id="seasonalPatterns"
                    name="seasonalPatterns"
                    value={formData.seasonalPatterns}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Describe any seasonal variations in your revenue..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredPaymentMonths" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Payment Months
                    </label>
                    <input
                      type="text"
                      id="preferredPaymentMonths"
                      name="preferredPaymentMonths"
                      value={formData.preferredPaymentMonths}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="e.g., March, June, September"
                    />
                  </div>

                  <div>
                    <label htmlFor="budgetConstraints" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Constraints
                    </label>
                    <input
                      type="text"
                      id="budgetConstraints"
                      name="budgetConstraints"
                      value={formData.budgetConstraints}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Max RM 100,000 per quarter"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;