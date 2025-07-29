import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Payslips from './Payslips';
import Form16 from './Form16';
import Sidebar from './Sidebar';

/**
 * A separate Reports page that displays and manages:
 * 1. Payslips
 * 2. Form-16
 */
export default function Reports({ darkMode, setCurrentPage, toggleDarkMode }) {
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
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className={`max-h-full ${darkMode ? 'bg-[#1C1C1C] text-[#E0E0E0]' : 'bg-white text-gray-900'} p-4`}>
          <div className="max-w-[1400px] mx-auto">
            <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-[#E0E0E0]' : 'text-gray-900'}`}>Reports</h1>
            
            {/* Tabs */}
            <div className={`flex border-b mb-4 ${darkMode ? 'border-[#3C3C3C]' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveTab('payslips')}
                className={`px-4 py-2 ${
                  activeTab === 'payslips'
                    ? `${darkMode ? 'bg-[#2C2C2C] font-semibold border-b-2 border-[#BB86FC]' : 'bg-gray-100 font-semibold border-b-2 border-blue-500'}`
                    : `${darkMode ? 'text-[#A6A9C8] hover:bg-[#2C2C2C]' : 'text-gray-600 hover:bg-gray-50'}`
                }`}
              >
                Payslips
              </button>
              <button
                onClick={() => setActiveTab('form-16')}
                className={`px-4 py-2 ${
                  activeTab === 'form-16'
                    ? `${darkMode ? 'bg-[#2C2C2C] font-semibold border-b-2 border-[#BB86FC]' : 'bg-gray-100 font-semibold border-b-2 border-blue-500'}`
                    : `${darkMode ? 'text-[#A6A9C8] hover:bg-[#2C2C2C]' : 'text-gray-600 hover:bg-gray-50'}`
                }`}
              >
                Form-16
              </button>
            </div>

            {/* Top Filters (modified) */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-[#A6A9C8]' : 'text-gray-400'} h-4 w-4`} />
                  <input
                    type="text"
                    placeholder="Search by name, company"
                    className={`${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg pl-8 pr-3 py-1.5 w-[250px] text-sm focus:outline-none focus:border-gray-300`}
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
      </div>
    </div>
  );
}
