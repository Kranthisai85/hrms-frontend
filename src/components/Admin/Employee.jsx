import { ChevronLeft, ChevronRight, Edit, Eye, FileUp, Search, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { employeeService } from '../../services/api';
import EmployeeProfileDetails from './EmployeeProfileDetails';

const bloodGroupOptions = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export default function Employee({ darkMode }) {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [status, setStatus] = useState('All');
  const [department, setDepartment] = useState('All');
  const [dateOfJoiningFilter, setDateOfJoiningFilter] = useState('');
  const [dateOfLeavingFilter, setDateOfLeavingFilter] = useState('');

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await employeeService.getEmployees();
        setEmployees(response.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    (employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())) &&

    (status === 'All' || employee.employmentStatus === status) &&
    (department === 'All' || employee.department === department) &&
    (!dateOfJoiningFilter || employee.dateOfJoin >= dateOfJoiningFilter) &&
    (!dateOfLeavingFilter || (employee.dateOfLeaving && employee.dateOfLeaving <= dateOfLeavingFilter))
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, status, department, dateOfJoiningFilter, dateOfLeavingFilter]);

  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (updatedEmployeeData) => {
    try {
      if (selectedEmployee && selectedEmployee.id) {
        await employeeService.updateEmployee(selectedEmployee.id, updatedEmployeeData);
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.id === selectedEmployee.id ? { ...emp, ...updatedEmployeeData } : emp
          )
        );
      } else {
        const response = await employeeService.createEmployee(updatedEmployeeData);
        setEmployees(prevEmployees => [...prevEmployees, response.data]);
      }
      setSelectedEmployee(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to save employee');
    }
  };

  const handleDelete = async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
      setSelectedEmployee(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await employeeService.importEmployees(formData);
        setEmployees(prevEmployees => [...prevEmployees, ...response.data]);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to import employees');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await employeeService.exportEmployees();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to export employees');
    }
  };

  const handleInvite = () => {
    console.log('Invite functionality to be implemented');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-[#1C1C1C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'}`}>
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {!showForm ? (
        // Main employee list view
        <>
          <div className="flex justify-between items-center mb-4 p-4">
            <div className="flex space-x-2">
              <button onClick={handleInvite} className={`px-3 py-1.5 ${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-blue-500 text-white'} rounded text-sm`}>Invite</button>
              <button onClick={() => { setSelectedEmployee(null); setShowForm(true); }} className={`px-3 py-1.5 ${darkMode ? 'bg-[#03DAC6] text-[#1C1C1C]' : 'bg-green-500 text-white'} rounded text-sm`}>+ New</button>
              <button onClick={handleExport} className={`px-3 py-1.5 ${darkMode ? 'bg-[#3700B3] text-white' : 'bg-yellow-500 text-white'} rounded text-sm flex items-center`}>
                <Upload className="w-4 h-4 mr-1" />
                Export
              </button>
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className={`px-3 py-1.5 ${darkMode ? 'bg-[#3700B3] text-white' : 'bg-purple-500 text-white'} rounded text-sm flex items-center cursor-pointer`}
                >
                  <FileUp className="w-4 h-4 mr-1" />
                  Import
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`px-2 py-1 border rounded-l text-sm w-32 ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]'}`}
                />
                <button className={`absolute right-0 top-0 bottom-0 px-2 ${darkMode ? 'bg-[#3C3C3C] text-[#E0E0E0]' : 'bg-gray-200 text-[#31293F]'} rounded-r flex items-center justify-center`}>
                  <Search size={16} />
                </button>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`px-3 py-1.5 border rounded text-sm ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]'}`}
              >
                <option value="All">All Status</option>
                <option value="Probation">Probation</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Resigned">Resigned</option>
                <option value="Relieved">Relieved</option>
              </select>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`px-3 py-1.5 border rounded text-sm ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]'}`}
              >
                <option value="All">All Departments</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
              <input
                type="date"
                value={dateOfJoiningFilter}
                onChange={(e) => setDateOfJoiningFilter(e.target.value)}
                className={`px-3 py-1.5 border rounded text-sm ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]'}`}
                placeholder="Date of Joining"
              />
              <input
                type="date"
                value={dateOfLeavingFilter}
                onChange={(e) => setDateOfLeavingFilter(e.target.value)}
                className={`px-3 py-1.5 border rounded text-sm ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]'}`}
                placeholder="Date of Leaving"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className={`w-full text-sm ${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'}`}>
              <thead className={darkMode ? 'bg-[#3C3C3C]' : 'bg-gray-100'}>
                <tr>
                  <th className="px-4 py-2 text-left">Sl No</th>
                  <th className="px-4 py-2 text-left">Employee ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Designation</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Branch</th>
                  <th className="px-4 py-2 text-left">Date of Join</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Mobile</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee, index) => (
                  <tr key={employee.id} className={`border-b ${darkMode ? 'hover:bg-[#3C3C3C] border-[#4C4C4C]' : 'hover:bg-gray-50 border-gray-200'}`}>
                    <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-2">{employee.employeeId}</td>
                    <td className="px-4 py-2">{`${employee.firstName} ${employee.lastName}`}</td>
                    <td className="px-4 py-2">{employee.designationId}</td>
                    <td className="px-4 py-2">{employee.departmentId}</td>
                    <td className="px-4 py-2">{employee.branchId}</td>
                    <td className="px-4 py-2">{formatDate(employee.joiningDate)}</td>
                    <td className="px-4 py-2">{employee.email}</td>
                    <td className="px-4 py-2">{employee.phoneNumber}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${employee.employmentStatus === 'Probation' ? 'bg-yellow-200 text-yellow-800' :
                          employee.employmentStatus === 'Confirmed' ? 'bg-green-200 text-green-800' :
                            employee.employmentStatus === 'Resigned' ? 'bg-red-200 text-red-800' :
                              'bg-gray-200 text-gray-800'
                        }`}>
                        {employee.employmentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleView(employee)} className="mr-2 text-blue-500"><Eye size={16} /></button>
                      <button onClick={() => handleEdit(employee)} className="mr-2 text-green-500"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(employee.id)} className="text-red-500"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center p-4">
            <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} entries</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-2 py-1.5 border rounded text-sm ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]'}`}
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded text-sm ${currentPage === page
                      ? (darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-blue-500 text-white')
                      : (darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]')
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-2 py-1.5 border rounded text-sm ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        // Employee form
        <div className={`h-full ${darkMode ? 'bg-[#2C2C2C]' : 'bg-gray-50'}`}>
          <div className={`${darkMode ? 'bg-[#1C1C1C]' : 'bg-white'} shadow-sm`}>
            <div className="px-4">
              <div className="flex justify-between items-center h-14">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowForm(false)}
                    className={`mr-4 p-1.5 rounded-full hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-800' : ''}`}
                  >
                    <X size={20} />
                  </button>
                  <h2 className="text-lg font-semibold">
                    {selectedEmployee ? 'Edit Employee' : 'Create Employee'}
                  </h2>
                </div>
                {/* <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className={`px-3 py-1.5 rounded-md border ${
                      darkMode 
                        ? 'border-gray-600 hover:bg-gray-800' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="employee-form"
                    className={`px-3 py-1.5 rounded-md ${
                      darkMode
                        ? 'bg-[#BB86FC] text-[#1C1C1C] hover:bg-opacity-90'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {selectedEmployee ? 'Update Employee' : 'Create Employee'}
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className={`${darkMode ? 'bg-[#1C1C1C]' : 'bg-white'} rounded-lg shadow`}>
              <div className="p-4">
                <EmployeeProfileDetails
                  employee={selectedEmployee}
                  darkMode={darkMode}
                  onSave={handleSubmit}
                  onCancel={() => setShowForm(false)}
                  bloodGroupOptions={bloodGroupOptions}
                  formId="employee-form"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className={`${darkMode ? 'bg-[#2C2C2C]' : 'bg-white'} p-6 rounded-lg shadow-md w-2/3 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Employee Details</h2>
              <button onClick={() => setShowViewModal(false)} className={`${darkMode ? 'text-[#E0E0E0]' : 'text-gray-500'} hover:text-gray-700`}>
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(selectedEmployee).map(([key, value]) => {
                // Handle nested objects and format values
                const displayValue = typeof value === 'object'
                  ? JSON.stringify(value, null, 2)
                  : value;

                return (
                  <div key={key}>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-[#E0E0E0]' : 'text-gray-700'}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <pre className={`mt-1 ${darkMode ? 'text-[#A6A9C8]' : 'text-gray-900'} whitespace-pre-wrap`}>
                      {displayValue}
                    </pre>
                  </div>
                );
              })}

            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowViewModal(false)} className={`px-4 py-2 ${darkMode ? 'bg-[#3C3C3C] text-[#E0E0E0]' : 'bg-gray-300 text-gray-700'} rounded`}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
