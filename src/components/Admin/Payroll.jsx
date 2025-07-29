import React, { useState, useEffect } from 'react';
import { Search, FileUp, Download, Eye, Edit } from 'lucide-react';
import InvestmentDeclaration from './InvestmentDeclaration';
import InvestmentDeclarationModal from './InvestmentDeclarationModal';
import Sidebar from './Sidebar';

export default function Payroll({ darkMode, setCurrentPage, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [employees, setEmployees] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024-25');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'

  // Fetch employees data on mount (mock data here)
  useEffect(() => {
    const mockEmployees = [
      { 
        id: 'EMP5563',
        name: 'John Doe', 
        designation: 'Software Engineer',
        department: 'IT', 
        joiningDate: '2022-01-15',
        exitDate: null,
        status: 'Pending', 
        taxRegime: 'old' 
      },
      { 
        id: 'EMP5564',
        name: 'Jane Smith', 
        designation: 'HR Manager',
        department: 'HR', 
        joiningDate: '2021-06-20',
        exitDate: null,
        status: 'Approved', 
        taxRegime: 'new' 
      },
      { 
        id: 'EMP5565',
        name: 'Alice Johnson', 
        designation: 'Financial Analyst',
        department: 'Finance', 
        joiningDate: '2020-03-10',
        exitDate: '2023-12-31',
        status: 'Pending', 
        taxRegime: 'old' 
      },
      { 
        id: 'EMP5566',
        name: 'Bob Williams', 
        designation: 'Marketing Lead',
        department: 'Marketing', 
        joiningDate: '2023-08-01',
        exitDate: null,
        status: 'Approved', 
        taxRegime: 'new' 
      },
    ];
    setEmployees(mockEmployees);
  }, []);

  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       employee.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCompany === 'all' || employee.designation === selectedCompany)
  );

  const handleBulkImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement bulk import logic
      console.log('Importing file:', file.name);
      alert(`File "${file.name}" selected for import. Bulk import functionality to be implemented.`);
    }
  };

  const handleDownload = () => {
    // TODO: Implement actual download logic
    console.log('Downloading declarations');
    alert('Download functionality to be implemented. This would typically generate and download a report of all declarations.');
  };

  const handleBulkApprove = () => {
    // TODO: Implement bulk approve logic
    console.log('Bulk approving declarations');
    alert('Bulk approve functionality to be implemented.');
  };

  const handleViewEdit = (employee, mode) => {
    setSelectedEmployee(employee);
    setModalMode(mode);
    setIsModalOpen(true);
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
            <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-[#E0E0E0]' : 'text-gray-900'}`}>Investment Declaration Management</h1>
            
            {/* Top Toolbar */}
            <div className="flex justify-between items-center mb-4">
              <div />
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-[#A6A9C8]' : 'text-gray-400'} h-4 w-4`} />
                  <input
                    type="text"
                    placeholder="Search by ID, name"
                    className={`${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg pl-8 pr-3 py-1.5 w-[250px] text-sm focus:outline-none focus:border-gray-300`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filter by Designation
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm 
                           focus:outline-none focus:border-gray-300"
                >
                  <option value="all">All Designations</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                  <option value="Marketing Lead">Marketing Lead</option>
                </select> */}

                {/* Select Financial Year */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={`${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-300`}
                >
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                </select>

                {/* Action Buttons */}
                <label className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                  <input type="file" className="hidden" onChange={handleBulkImport} accept=".csv,.xlsx" />
                  <FileUp className="inline-block mr-1 h-4 w-4" />
                  Bulk Import
                </label>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="inline-block mr-1 h-4 w-4" />
                  Download
                </button>

                {/* <button
                  onClick={handleBulkApprove}
                  className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Bulk Approve
                </button> */}
              </div>
            </div>

            {/* Investment Declaration Table */}
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0]' : 'bg-white'}`}>
                <thead className={darkMode ? 'bg-[#3C3C3C]' : 'bg-gray-100'}>
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Sr. No</th>
                    <th className="px-4 py-2 text-left font-medium">Employee ID</th>
                    <th className="px-4 py-2 text-left font-medium">Employee Name</th>
                    <th className="px-4 py-2 text-left font-medium">Designation</th>
                    <th className="px-4 py-2 text-left font-medium">Department</th>
                    <th className="px-4 py-2 text-left font-medium">Joining Date</th>
                    <th className="px-4 py-2 text-left font-medium">Exit Date</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Tax Regime</th>
                    <th className="px-4 py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee, index) => (
                    <tr key={employee.id} className={`border-b ${darkMode ? 'border-[#4C4C4C] hover:bg-[#3C3C3C]' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{employee.id}</td>
                      <td className="px-4 py-2">{employee.name}</td>
                      <td className="px-4 py-2">{employee.designation}</td>
                      <td className="px-4 py-2">{employee.department}</td>
                      <td className="px-4 py-2">{employee.joiningDate}</td>
                      <td className="px-4 py-2">{employee.exitDate || '-'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          employee.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          employee.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{employee.taxRegime}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleViewEdit(employee, 'view')} className="mr-2 text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleViewEdit(employee, 'edit')} className="text-green-600 hover:text-green-800">
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <InvestmentDeclarationModal
          employee={selectedEmployee}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedData) => {
            console.log('Saving updated data:', updatedData);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
