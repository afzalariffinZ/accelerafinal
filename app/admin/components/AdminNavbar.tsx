'use client';

import React from 'react';
import Link from 'next/link';

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Accelera</span>
            </Link>
          </div>

          

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Mr Nabil</div>
                <div className="text-xs text-gray-500">(Startup CFO)</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">MN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;