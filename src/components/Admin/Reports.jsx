import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Payslips from './Payslips';
import Form16 from './Form16';

/**
 * A separate Reports page that displays and manages:
 * 1. Payslips
 * 2. Form-16
 */
export default function Reports() {
  const [activeTab, setActiveTab] = useState('payslips');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024-25');

  useEffect(() => {
    // Fetch employees or relevant data from an API (using mock data for now)
    const mockEmployees = [
      { id: 1, name: 'John Doe', company: 'Company A', department: 'IT', status: 'Pending' },
      { id: 2, name: 'Jane Smith', company: 'Company B', department: 'HR', status: 'Approved' },
      { id: 3, name: 'Alice Johnson', company: 'Company A', department: 'Finance', status: 'Pending' },
      { id: 4, name: 'Bob Williams', company: 'Company C', department: 'Marketing', status: 'Approved' },
    ];
    setEmployees(mockEmployees);
  }, []);

  // Modified filter to remove company filter
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Conditionally render either Payslips or Form16 based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'payslips':
        return <Payslips employees={filteredEmployees} />;
      case 'form-16':
        return <Form16 employees={filteredEmployees} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-h-full bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white p-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('payslips')}
            className={`px-4 py-2 ${
              activeTab === 'payslips'
                ? 'bg-gray-100 font-semibold border-b-2 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Payslips
          </button>
          <button
            onClick={() => setActiveTab('form-16')}
            className={`px-4 py-2 ${
              activeTab === 'form-16'
                ? 'bg-gray-100 font-semibold border-b-2 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Form-16
          </button>
        </div>

        {/* Top Filters (modified) */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, company"
                className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 
                           rounded-lg pl-8 pr-3 py-1.5 w-[250px] text-sm focus:outline-none 
                           focus:border-gray-300 dark:focus:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 
                         rounded-lg px-3 py-1.5 text-sm focus:outline-none 
                         focus:border-gray-300 dark:focus:border-gray-700"
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select> */}
          </div>
          {/* Add any additional buttons or actions for Reports here */}
        </div>

        {/* Active Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
}
