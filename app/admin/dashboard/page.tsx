'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../components/AdminNavbar';

interface Customer {
  customerId: string;
  companyName: string;
  contactName: string;
  email: string;
  subscriptionPlan: string;
  monthlyRevenue: number;
  joinDate: string;
  status: 'active' | 'pending' | 'overdue' | 'inactive';
  lastPayment: string;
  nextBilling: string;
  totalUsers: number;
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
  status: 'pending' | 'accepted' | 'rejected';
  priority: string;
  created_at: string;
  executive_summary?: string;
  technical_analysis?: string;
  implementation_strategy?: string;
  financial_optimization?: string;
  risk_assessment?: string;
  next_steps?: string;
}

interface ReportData {
  statusCode: number;
  body: {
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
  };
}

interface CompanySettings {
  companyName: string;
  industry: string;
  businessModel: string;
  minimumRevenue: number;
  baseCurrency: string;
  taxRate: number;
  defaultDiscount: number;
  featurePricing: {
    basePrice: number;
    developmentHourlyRate: number;
    complexityMultiplier: {
      low: number;
      medium: number;
      high: number;
    };
  };
  paymentTerms: {
    defaultPaymentDays: number;
    installmentOptions: number[];
    earlyPaymentDiscount: number;
  };
}

const AdminDashboard = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    // Load dummy customer data
    const dummyCustomers: Customer[] = [
      {
        customerId: 'CUST-001',
        companyName: 'Tech Corp Ltd',
        contactName: 'John Smith',
        email: 'john.smith@techcorp.com',
        subscriptionPlan: 'Enterprise+',
        monthlyRevenue: 15000,
        joinDate: '2024-01-15',
        status: 'active',
        lastPayment: '2024-09-01',
        nextBilling: 'Oct 1 - Oct 31, 2025',
        totalUsers: 250
      },
      {
        customerId: 'CUST-002',
        companyName: 'StartupXYZ',
        contactName: 'Sarah Johnson',
        email: 'sarah@startupxyz.com',
        subscriptionPlan: 'Pro',
        monthlyRevenue: 8500,
        joinDate: '2024-03-20',
        status: 'overdue',
        lastPayment: '2024-08-15',
        nextBilling: 'Oct 15 - Nov 15, 2025',
        totalUsers: 75
      },
      {
        customerId: 'CUST-003',
        companyName: 'Global Industries',
        contactName: 'Michael Chen',
        email: 'mchen@globalind.com',
        subscriptionPlan: 'Enterprise+',
        monthlyRevenue: 22000,
        joinDate: '2023-11-10',
        status: 'overdue',
        lastPayment: '2024-08-20',
        nextBilling: 'Nov 1 - Nov 30, 2025',
        totalUsers: 500
      },
      {
        customerId: 'CUST-004',
        companyName: 'Innovation Labs',
        contactName: 'Emily Rodriguez',
        email: 'emily@innovationlabs.io',
        subscriptionPlan: 'Pro',
        monthlyRevenue: 12000,
        joinDate: '2024-05-08',
        status: 'active',
        lastPayment: '2024-09-08',
        nextBilling: 'Oct 8 - Nov 8, 2025',
        totalUsers: 150
      },
      {
        customerId: 'CUST-005',
        companyName: 'Digital Solutions Inc',
        contactName: 'David Wilson',
        email: 'dwilson@digitalsol.com',
        subscriptionPlan: 'Free',
        monthlyRevenue: 0,
        joinDate: '2024-08-12',
        status: 'pending',
        lastPayment: 'N/A',
        nextBilling: 'Dec 1 - Dec 31, 2025',
        totalUsers: 10
      },
      {
        customerId: 'CUST-006',
        companyName: 'MegaCorp Solutions',
        contactName: 'Lisa Thompson',
        email: 'lisa.thompson@megacorp.com',
        subscriptionPlan: 'Enterprise+',
        monthlyRevenue: 45000,
        joinDate: '2023-06-25',
        status: 'active',
        lastPayment: '2024-09-01',
        nextBilling: 'Oct 1 - Dec 31, 2025',
        totalUsers: 1250
      }
    ];
    
    setCustomers(dummyCustomers);
    
    // Fetch client requests from API
    fetchClientRequests();
  }, []);

  const fetchClientRequests = async () => {
    try {
      const response = await fetch('/api/requests/client');
      const result = await response.json();
      
      if (result.success) {
        setClientRequests(result.data);
      }
    } catch (error) {
      console.error('Error fetching client requests:', error);
    }
  };

  const handleViewReport = (request: ClientRequest) => {
    // Open report in new tab
    const reportUrl = `/admin/report?requestId=${request.request_id}`;
    window.open(reportUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'overdue':
        return 'Overdue';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => 
      c.customerId === updatedCustomer.customerId ? updatedCustomer : c
    ));
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor customer performance and manage accounts</p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'customers'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Client Requests
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Workflow Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'customers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                      </svg>
                      Filter
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      New Customer
                    </button>
                  </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Customer ID</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Company</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Revenue</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Next Billing</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {customers.map((customer) => (
                          <tr 
                            key={customer.customerId}
                            onClick={() => handleCustomerClick(customer)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <td className="py-4 px-6 text-sm font-medium text-gray-900">
                              {customer.customerId}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">
                              <div>
                                <div className="font-medium">{customer.companyName}</div>
                                <div className="text-gray-500">{customer.contactName}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-medium text-gray-900">
                              {customer.monthlyRevenue === 0 ? 'Free' : formatCurrency(customer.monthlyRevenue)}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">
                              {customer.nextBilling}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                                {getStatusDisplayName(customer.status)}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">
                              <div className="flex items-center space-x-2">
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m0 0a9 9 0 11-9-9 9 9 0 019 9z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Client Requests</h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={fetchClientRequests}
                      className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Client Requests Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clientRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {request.request_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{request.full_name}</div>
                                <div className="text-sm text-gray-500">{request.email}</div>
                                {request.company && (
                                  <div className="text-sm text-gray-500">{request.company}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.project_title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{request.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {request.budget || 'TBD'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewReport(request)}
                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Report
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {clientRequests.length === 0 && (
                    <div className="text-center py-12">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No client requests</h3>
                      <p className="text-gray-500">Client requests will appear here once submitted.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Overview Dashboard</h3>
                <p className="text-gray-600">Analytics and overview metrics coming soon</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Analytics</h3>
                <p className="text-gray-600">Advanced analytics and reporting coming soon</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Settings</h2>
                  <p className="text-gray-600">Configure your company information and AI workflow parameters</p>
                </div>
                
                <CompanySettingsForm />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Settings Form */}
      <CompanySettingsForm />

      {/* Customer Modal */}
      {showCustomerModal && selectedCustomer && (
        <CustomerDetailModal 
          customer={selectedCustomer} 
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedCustomer(null);
          }}
          onUpdate={(updatedCustomer) => {
            setCustomers(customers.map(c => 
              c.customerId === updatedCustomer.customerId ? updatedCustomer : c
            ));
            setSelectedCustomer(updatedCustomer);
          }}
        />
      )}
    </div>
  );
};

// Company Settings Form Component
const CompanySettingsForm = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    companyName: 'Saas E',
    industry: 'Software as a Service',
    businessModel: 'B2B SaaS',
    minimumRevenue: 50000,
    baseCurrency: 'MYR',
    taxRate: 6,
    defaultDiscount: 0,
    featurePricing: {
      basePrice: 5000,
      developmentHourlyRate: 150,
      complexityMultiplier: {
        low: 1.0,
        medium: 1.5,
        high: 2.5
      }
    },
    paymentTerms: {
      defaultPaymentDays: 30,
      installmentOptions: [2, 3, 6, 12],
      earlyPaymentDiscount: 5
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('companySettings', JSON.stringify(settings));
    setIsEditing(false);
    setHasChanges(false);
    // Here you would typically send to backend API
    alert('Company settings saved successfully!');
  };

  const handleReset = () => {
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setSettings(newSettings);
    setHasChanges(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Company Settings</h3>
          <p className="text-sm text-gray-600">Configure your company information and pricing parameters</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing && hasChanges && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Company Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => updateSetting('companyName', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              value={settings.industry}
              onChange={(e) => updateSetting('industry', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Model</label>
            <select
              value={settings.businessModel}
              onChange={(e) => updateSetting('businessModel', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            >
              <option value="B2B SaaS">B2B SaaS</option>
              <option value="B2C SaaS">B2C SaaS</option>
              <option value="Enterprise Software">Enterprise Software</option>
              <option value="Platform">Platform</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
            <select
              value={settings.baseCurrency}
              onChange={(e) => updateSetting('baseCurrency', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            >
              <option value="MYR">Malaysian Ringgit (MYR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="SGD">Singapore Dollar (SGD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financial Parameters */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Financial Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Monthly Revenue (MYR)</label>
            <input
              type="number"
              value={settings.minimumRevenue}
              onChange={(e) => updateSetting('minimumRevenue', parseInt(e.target.value) || 0)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
            <p className="text-xs text-gray-500 mt-1">Used by AI for revenue optimization</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Discount (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.defaultDiscount}
              onChange={(e) => updateSetting('defaultDiscount', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Early Payment Discount (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.paymentTerms.earlyPaymentDiscount}
              onChange={(e) => updateSetting('paymentTerms.earlyPaymentDiscount', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
        </div>
      </div>

      {/* Feature Pricing Configuration */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Feature Pricing Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Feature Price (MYR)</label>
            <input
              type="number"
              value={settings.featurePricing.basePrice}
              onChange={(e) => updateSetting('featurePricing.basePrice', parseInt(e.target.value) || 0)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
            <p className="text-xs text-gray-500 mt-1">Starting price for custom features</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Development Hourly Rate (MYR)</label>
            <input
              type="number"
              value={settings.featurePricing.developmentHourlyRate}
              onChange={(e) => updateSetting('featurePricing.developmentHourlyRate', parseInt(e.target.value) || 0)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Complexity Multiplier</label>
            <input
              type="number"
              step="0.1"
              value={settings.featurePricing.complexityMultiplier.low}
              onChange={(e) => updateSetting('featurePricing.complexityMultiplier.low', parseFloat(e.target.value) || 1)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medium Complexity Multiplier</label>
            <input
              type="number"
              step="0.1"
              value={settings.featurePricing.complexityMultiplier.medium}
              onChange={(e) => updateSetting('featurePricing.complexityMultiplier.medium', parseFloat(e.target.value) || 1)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">High Complexity Multiplier</label>
            <input
              type="number"
              step="0.1"
              value={settings.featurePricing.complexityMultiplier.high}
              onChange={(e) => updateSetting('featurePricing.complexityMultiplier.high', parseFloat(e.target.value) || 1)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Terms</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Payment Days</label>
            <input
              type="number"
              value={settings.paymentTerms.defaultPaymentDays}
              onChange={(e) => updateSetting('paymentTerms.defaultPaymentDays', parseInt(e.target.value) || 30)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Installment Options (months)</label>
            <input
              type="text"
              value={settings.paymentTerms.installmentOptions.join(', ')}
              onChange={(e) => updateSetting('paymentTerms.installmentOptions', e.target.value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)))}
              disabled={!isEditing}
              placeholder="e.g., 2, 3, 6, 12"
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated list of installment options</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Report Modal Component
const ReportModal = ({ 
  request, 
  reportData,
  onClose 
}: { 
  request: ClientRequest; 
  reportData: ReportData;
  onClose: () => void; 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return (rate * 100).toFixed(1) + '%';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Financial Analysis Report</h2>
              <p className="text-sm text-gray-500 mt-1">Request ID: {request.request_id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">Status: {reportData.body.status}</span>
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Name</label>
                  <p className="text-sm text-gray-900">{request.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="text-sm text-gray-900">{request.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Title</label>
                  <p className="text-sm text-gray-900">{request.project_title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <p className="text-sm text-gray-900">{request.budget || 'TBD'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Analysis Inputs */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Inputs</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700">Current Payment</label>
                  <p className="text-sm text-blue-900 font-medium">
                    {formatCurrency(reportData.body.report_data.inputs.current_payment_MYR)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Current Frequency</label>
                  <p className="text-sm text-blue-900 font-medium capitalize">
                    {reportData.body.report_data.inputs.current_frequency}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">New Frequency</label>
                  <p className="text-sm text-blue-900 font-medium capitalize">
                    {reportData.body.report_data.inputs.new_frequency}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Remaining Years</label>
                  <p className="text-sm text-blue-900 font-medium">
                    {reportData.body.report_data.inputs.remaining_years} years
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Results */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Calculation Results</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700">Original Present Value</label>
                  <p className="text-lg text-green-900 font-bold">
                    {formatCurrency(reportData.body.report_data.calculation_results.original_present_value_MYR)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700">New Equivalent Payment</label>
                  <p className="text-lg text-green-900 font-bold">
                    {formatCurrency(reportData.body.report_data.calculation_results.new_equivalent_payment_MYR)}
                  </p>
                </div>
              </div>
              
              {/* Savings Calculation */}
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="bg-green-100 rounded-lg p-3">
                  <label className="block text-sm font-medium text-green-700">Potential Savings</label>
                  <p className="text-xl text-green-900 font-bold">
                    {formatCurrency(
                      reportData.body.report_data.calculation_results.original_present_value_MYR - 
                      reportData.body.report_data.calculation_results.new_equivalent_payment_MYR
                    )}
                  </p>
                  <p className="text-sm text-green-700">
                    ({((reportData.body.report_data.calculation_results.original_present_value_MYR - 
                        reportData.body.report_data.calculation_results.new_equivalent_payment_MYR) / 
                        reportData.body.report_data.calculation_results.original_present_value_MYR * 100).toFixed(1)}% savings)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Economic Assumptions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Economic Assumptions</h3>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-700">Inflation Rate</label>
                  <p className="text-sm text-yellow-900 font-medium">
                    {formatPercentage(reportData.body.report_data.economic_assumptions.inflation_rate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-700">Risk-Free Rate</label>
                  <p className="text-sm text-yellow-900 font-medium">
                    {formatPercentage(reportData.body.report_data.economic_assumptions.risk_free_rate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* S3 Location */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Storage</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">S3 Location</label>
              <code className="text-xs text-gray-600 bg-white p-2 rounded border block">
                {reportData.body.s3_location}
              </code>
            </div>
          </div>

          {/* AI Summary if available */}
          {request.executive_summary && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Analysis Summary</h3>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-900 leading-relaxed">
                  {request.executive_summary}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Customer Detail Modal Component
const CustomerDetailModal = ({ 
  customer, 
  onClose, 
  onUpdate 
}: { 
  customer: Customer; 
  onClose: () => void; 
  onUpdate: (customer: Customer) => void; 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer>(customer);

  const handleSave = () => {
    onUpdate(editedCustomer);
    setEditMode(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
            <div className="flex items-center space-x-2">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditedCustomer(customer);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                <input
                  type="text"
                  value={editedCustomer.customerId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editedCustomer.companyName}
                  onChange={(e) => setEditedCustomer({...editedCustomer, companyName: e.target.value})}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={editedCustomer.contactName}
                  onChange={(e) => setEditedCustomer({...editedCustomer, contactName: e.target.value})}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editedCustomer.email}
                  onChange={(e) => setEditedCustomer({...editedCustomer, email: e.target.value})}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
                />
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select
                  value={editedCustomer.subscriptionPlan}
                  onChange={(e) => setEditedCustomer({...editedCustomer, subscriptionPlan: e.target.value})}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise+">Enterprise+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Revenue</label>
                <input
                  type="number"
                  value={editedCustomer.monthlyRevenue}
                  onChange={(e) => setEditedCustomer({...editedCustomer, monthlyRevenue: parseInt(e.target.value) || 0})}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editedCustomer.status}
                  onChange={(e) => setEditedCustomer({...editedCustomer, status: e.target.value as Customer['status']})}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Users</label>
                <input
                  type="number"
                  value={editedCustomer.totalUsers}
                  onChange={(e) => setEditedCustomer({...editedCustomer, totalUsers: parseInt(e.target.value) || 0})}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
                />
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <p className="text-sm text-gray-900 py-2">{formatDate(editedCustomer.joinDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Payment</label>
                <p className="text-sm text-gray-900 py-2">{formatDate(editedCustomer.lastPayment)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing</label>
                <input
                  type="date"
                  value={editedCustomer.nextBilling}
                  onChange={(e) => setEditedCustomer({...editedCustomer, nextBilling: e.target.value})}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revenue (Monthly)</label>
                <p className="text-sm font-medium text-gray-900 py-2">
                  {editedCustomer.monthlyRevenue === 0 ? 'Free Plan' : formatCurrency(editedCustomer.monthlyRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;