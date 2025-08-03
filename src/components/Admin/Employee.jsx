import { ChevronLeft, ChevronRight, Edit, Eye, FileUp, Search, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { branchService, departmentService, designationService, employeeService } from '../../services/api';
import EmployeeProfileDetails from './create-employee/EmployeeProfileDetails';
import Sidebar from './Sidebar';

export default function Employee({ darkMode, setCurrentPage, toggleDarkMode }) {  
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [status, setStatus] = useState('All');
  const [department, setDepartment] = useState('All');
  const [dateOfJoiningFilter, setDateOfJoiningFilter] = useState('');
  const [dateOfLeavingFilter, setDateOfLeavingFilter] = useState('');
  const [departmentsList, setDepartments] = useState([])
  const [branchesList, setBranches] = useState([])
  const [designationsList, setDesignations] = useState([])

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchBranches();
    fetchDesignations();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    (employee.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())) &&

    (status === 'All' || employee.employmentStatus === status) &&
    (department === 'All' || employee.department === department) &&
    (!dateOfJoiningFilter || employee.dateOfJoin >= dateOfJoiningFilter) &&
    (!dateOfLeavingFilter || (employee.dateOfLeaving && employee.dateOfLeaving <= dateOfLeavingFilter))
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  useEffect(() => {
    setCurrentPageNumber(1);
  }, [searchTerm, status, department, dateOfJoiningFilter, dateOfLeavingFilter]);

  const currentEmployees = filteredEmployees.slice(
    (currentPageNumber - 1) * itemsPerPage,
    currentPageNumber * itemsPerPage
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

  const handleEdit = async (employee) => {
    try {
      setLoading(true);
      // Fetch complete employee data using the getEmployee API
      const response = await employeeService.getEmployee(employee.id);
      
      if (response.success) {
        // Set the complete employee data from the API response
        setSelectedEmployee(response.data);
        setShowForm(true);
      } else {
        console.error('Failed to fetch employee details:', response.message);
        // Fallback to the basic employee data if API fails
        setSelectedEmployee(employee);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      // Fallback to the basic employee data if API fails
      setSelectedEmployee(employee);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
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

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await departmentService.getDepartments()
      if (response.success) {
        setDepartments(response.data)
      } else {
        toast.error(response.message || 'Failed to fetch departments')
      }
    } catch (error) {
      toast.error('Error fetching departments')
    } finally {
      setLoading(false)
    }
  }

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const response = await branchService.getBranches()
      if (response.success) {
        setBranches(response.data)
      } else {
        toast.error(response.message || 'Failed to fetch branches')
      }
    } catch (error) {
      toast.error('Error fetching branches')
    } finally {
      setLoading(false)
    }
  }

  const fetchDesignations = async () => {
    try {
      setLoading(true)
      const response = await designationService.getDesignations()
      if (response.success) {
        setDesignations(response.data)
      } else {
        toast.error(response.message || 'Failed to fetch departments')
      }
    } catch (error) {
      toast.error('Error fetching departments')
    } finally {
      setLoading(false)
    }
  }

  function getNameByIdFromList(id, list) {
    const item = list.find(obj => obj.id === id);
    return item ? item.name.trim() : null;
  }

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
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className={`flex flex-col h-full ${darkMode ? 'bg-[#1C1C1C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'}`}>
          {error && (
            <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          {!showForm ? (
            // Main employee list view
            <>
                             {/* Header Section with Action Buttons */}
               <div className={`p-4 ${darkMode ? 'bg-[#1C1C1C]' : 'bg-white'} border-b ${darkMode ? 'border-[#3C3C3C]' : 'border-gray-200'}`}>
                 <div className="flex justify-between items-center">
                   <div className="flex space-x-3">
                     <button 
                       onClick={handleInvite} 
                       className={`px-4 py-2 ${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C] hover:bg-[#A66EFC]' : 'bg-blue-600 text-white hover:bg-blue-700'} rounded-md text-xs font-medium transition-all duration-200 transform hover:scale-102`}
                     >
                       Invite Employee
                     </button>
                     <button 
                       onClick={() => { setSelectedEmployee(null); setShowForm(true); }} 
                       className={`px-4 py-2 ${darkMode ? 'bg-[#03DAC6] text-[#1C1C1C] hover:bg-[#00BFA5]' : 'bg-green-600 text-white hover:bg-green-700'} rounded-md text-xs font-medium transition-all duration-200 transform hover:scale-102 flex items-center`}
                     >
                       <span className="mr-1.5">+</span>
                       New Employee
                     </button>
                     <button 
                       onClick={handleExport} 
                       className={`px-4 py-2 ${darkMode ? 'bg-[#3700B3] text-white hover:bg-[#2A0080]' : 'bg-yellow-600 text-white hover:bg-yellow-700'} rounded-md text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-102 flex items-center`}
                     >
                       <Upload className="w-3.5 h-3.5 mr-1.5" />
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
                         className={`px-4 py-2 ${darkMode ? 'bg-[#3700B3] text-white hover:bg-[#2A0080]' : 'bg-purple-600 text-white hover:bg-purple-700'} rounded-md text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-102 flex items-center cursor-pointer`}
                       >
                         <FileUp className="w-3.5 h-3.5 mr-1.5" />
                         Import
                       </label>
                     </div>
                   </div>
                 </div>
               </div>

                             {/* Search and Filters Section */}
               <div className={`p-4 ${darkMode ? 'bg-[#1C1C1C]' : 'bg-white'} border-b ${darkMode ? 'border-[#3C3C3C]' : 'border-gray-200'}`}>
                 <div className="flex items-center justify-between">
                   {/* Enhanced Search Bar */}
                   <div className="flex-1 max-w-sm">
                     <div className="relative">
                       <Search className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-[#A6A9C8]' : 'text-gray-400'} w-4 h-4`} />
                       <input
                         type="text"
                         placeholder="Search employees..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className={`w-full pl-8 pr-3 py-2 border rounded-md text-xs ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0] focus:border-[#BB86FC]' : 'bg-white border-gray-300 text-[#31293F] focus:border-blue-500'} transition-colors duration-200 focus:outline-none`}
                       />
                     </div>
                   </div>

                   {/* Filters Section - Right Side */}
                   <div className="flex items-center space-x-4">
                     {/* Status Filter */}
                     <div className="flex items-center space-x-2">
                       <label className={`text-xs font-medium ${darkMode ? 'text-[#E0E0E0]' : 'text-[#31293F]'}`}>Status:</label>
                       <div className="relative">
                         <select
                           value={status}
                           onChange={(e) => setStatus(e.target.value)}
                           className={`appearance-none px-4 py-2 pr-8 border rounded-md text-xs font-medium ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0] focus:border-[#BB86FC]' : 'bg-white border-gray-300 text-[#31293F] focus:border-blue-500'} transition-all duration-200 focus:outline-none shadow-sm hover:shadow-md cursor-pointer`}
                         >
                           <option value="All">All Status</option>
                           <option value="Probation">Probation</option>
                           <option value="Confirmed">Confirmed</option>
                           <option value="Resigned">Resigned</option>
                           <option value="Relieved">Relieved</option>
                         </select>
                         <div className={`absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none ${darkMode ? 'text-[#A6A9C8]' : 'text-gray-400'}`}>
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                           </svg>
                         </div>
                       </div>
                     </div>

                     {/* Department Filter */}
                     <div className="flex items-center space-x-2">
                       <label className={`text-xs font-medium ${darkMode ? 'text-[#E0E0E0]' : 'text-[#31293F]'}`}>Department:</label>
                       <div className="relative">
                         <select
                           value={department}
                           onChange={(e) => setDepartment(e.target.value)}
                           className={`appearance-none px-4 py-2 pr-8 border rounded-md text-xs font-medium ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0] focus:border-[#BB86FC]' : 'bg-white border-gray-300 text-[#31293F] focus:border-blue-500'} transition-all duration-200 focus:outline-none shadow-sm hover:shadow-md cursor-pointer`}
                         >
                           <option value="All">All Departments</option>
                           <option value="IT">IT</option>
                           <option value="HR">HR</option>
                           <option value="Finance">Finance</option>
                           <option value="Marketing">Marketing</option>
                         </select>
                         <div className={`absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none ${darkMode ? 'text-[#A6A9C8]' : 'text-gray-400'}`}>
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                           </svg>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

              {/* Table Section */}
              <div className="flex-grow overflow-hidden">
                <div className="overflow-x-auto h-full">
                                     <table className={`w-full text-xs ${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'}`}>
                     <thead className={`${darkMode ? 'bg-[#3C3C3C]' : 'bg-gray-100'} sticky top-0 z-10`}>
                       <tr>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Sl No</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Employee ID</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Name</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Designation</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Department</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Branch</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Date of Join</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Email</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Status</th>
                         <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Action</th>
                       </tr>
                     </thead>
                     <tbody className={`${darkMode ? 'divide-[#4C4C4C]' : 'divide-gray-200'}`}>
                       {currentEmployees.map((employee, index) => (
                         <tr 
                           key={employee.id} 
                           className={`${darkMode ? 'hover:bg-[#3C3C3C] border-[#4C4C4C]' : 'hover:bg-gray-50 border-gray-200'} hover:cursor-pointer transition-colors duration-150 border-b`} 
                           onClick={() => handleEdit(employee)}
                         >
                           <td className="px-4 py-3 font-medium">{(currentPageNumber - 1) * itemsPerPage + index + 1}</td>
                           <td className="px-4 py-3 font-medium">{employee.employeeId}</td>
                           <td className="px-4 py-3 font-medium">{`${employee.user.name} ${employee.user.lastName != undefined ? employee.user.lastName : ''}`}</td>
                           <td className="px-4 py-3">{getNameByIdFromList(employee.designationId, designationsList)}</td>
                           <td className="px-4 py-3">{getNameByIdFromList(employee.departmentId, departmentsList)}</td>
                           <td className="px-4 py-3">{getNameByIdFromList(employee.branchId, branchesList)}</td>
                           <td className="px-4 py-3">{formatDate(employee.joiningDate)}</td>
                           <td className="px-4 py-3">{employee.email}</td>
                           <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${employee.employmentStatus === 'Probation' ? 'bg-yellow-100 text-yellow-800' :
                               employee.employmentStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                 employee.employmentStatus === 'Resigned' ? 'bg-red-100 text-red-800' :
                                   'bg-gray-100 text-gray-800'
                               }`}>
                               {employee.employmentStatus}
                             </span>
                           </td>
                           <td className="px-4 py-3">
                             <div className="flex space-x-1">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleView(employee); }} 
                                 className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-[#4C4C4C] text-blue-400 hover:text-blue-300' : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700'} transition-colors duration-150`}
                                 title="View Details"
                               >
                                 <Eye size={14} />
                               </button>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleEdit(employee); }} 
                                 className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-[#4C4C4C] text-green-400 hover:text-green-300' : 'hover:bg-green-50 text-green-600 hover:text-green-700'} transition-colors duration-150`}
                                 title="Edit Employee"
                               >
                                 <Edit size={14} />
                               </button>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleDelete(employee.id); }} 
                                 className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-[#4C4C4C] text-red-400 hover:text-red-300' : 'hover:bg-red-50 text-red-600 hover:text-red-700'} transition-colors duration-150`}
                                 title="Delete Employee"
                               >
                                 <Trash2 size={14} />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </div>

                             {/* Pagination Section */}
               <div className={`p-4 ${darkMode ? 'bg-[#1C1C1C]' : 'bg-white'} border-t ${darkMode ? 'border-[#3C3C3C]' : 'border-gray-200'}`}>
                 <div className="flex justify-between items-center">
                   <div className={`text-xs ${darkMode ? 'text-[#A6A9C8]' : 'text-gray-600'}`}>
                     Showing <span className="font-semibold">{(currentPageNumber - 1) * itemsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPageNumber * itemsPerPage, filteredEmployees.length)}</span> of <span className="font-semibold">{filteredEmployees.length}</span> entries
                   </div>
                   <div className="flex items-center space-x-1">
                     <button
                       onClick={() => setCurrentPageNumber(prev => Math.max(prev - 1, 1))}
                       disabled={currentPageNumber === 1}
                       className={`p-1.5 rounded-md border transition-all duration-200 ${currentPageNumber === 1 
                         ? `${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#666666]' : 'bg-gray-100 border-gray-300 text-gray-400'} cursor-not-allowed` 
                         : `${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0] hover:bg-[#3C3C3C] hover:border-[#BB86FC]' : 'bg-white border-gray-300 text-[#31293F] hover:bg-gray-50 hover:border-blue-500'}`}`}
                     >
                       <ChevronLeft size={16} />
                     </button>
                     
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                       <button
                         key={page}
                         onClick={() => setCurrentPageNumber(page)}
                         className={`px-3 py-1.5 rounded-md border font-medium transition-all duration-200 ${
                           currentPageNumber === page
                             ? `${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C] border-[#BB86FC]' : 'bg-blue-600 text-white border-blue-600'} shadow-sm`
                             : `${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0] hover:bg-[#3C3C3C] hover:border-[#BB86FC]' : 'bg-white border-gray-300 text-[#31293F] hover:bg-gray-50 hover:border-blue-500'}`
                         }`}
                       >
                         {page}
                       </button>
                     ))}
                     
                     <button
                       onClick={() => setCurrentPageNumber(prev => Math.min(prev + 1, totalPages))}
                       disabled={currentPageNumber === totalPages}
                       className={`p-1.5 rounded-md border transition-all duration-200 ${currentPageNumber === totalPages 
                         ? `${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#666666]' : 'bg-gray-100 border-gray-300 text-gray-400'} cursor-not-allowed` 
                         : `${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0] hover:bg-[#3C3C3C] hover:border-[#BB86FC]' : 'bg-white border-gray-300 text-[#31293F] hover:bg-gray-50 hover:border-blue-500'}`}`}
                     >
                       <ChevronRight size={16} />
                     </button>
                   </div>
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
      </div>
    </div>
  );
}
