import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, X, Download, Upload, Edit, Save, Lock, Unlock, FileUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { attendanceService } from '../../services/api';

const initialEmployees = [
  { id: 1, code: 'VL005', name: 'Chinne Gowda H M', joinDate: '2023-08-23', exitDate: '2024-11-18' },
  { id: 2, code: 'VL006', name: 'B Mukamma', joinDate: '2023-08-24', exitDate: '' },
  { id: 3, code: 'VL010', name: 'Lavana M J', joinDate: '2023-08-25', exitDate: '' },
  { id: 4, code: 'VL011', name: 'John Dick', joinDate: '2023-08-26', exitDate: '' },
  { id: 5, code: 'VL012', name: 'Jane Smith', joinDate: '2023-08-27', exitDate: '' },
  { id: 6, code: 'VL013', name: 'Ravi Mukamma', joinDate: '2023-08-24', exitDate: '2024-01-10' },
  { id: 7, code: 'VL014', name: 'John Doe', joinDate: '2023-08-26', exitDate: '' },
  { id: 8, code: 'VL015', name: 'Duane Smith', joinDate: '2023-08-27', exitDate: '' },
  { id: 9, code: 'VL016', name: 'Ben Mukamma', joinDate: '2023-08-24', exitDate: '' },
  { id: 10, code: 'VL017', name: 'John walker', joinDate: '2023-08-26', exitDate: '' },
  { id: 11, code: 'VL018', name: 'Merlin Martin', joinDate: '2023-08-27', exitDate: '' },
  { id: 12, code: 'VL019', name: 'Nova Martin', joinDate: '2023-03-07', exitDate: '2024-10-10' },
  { id: 13, code: 'VL020', name: 'Martin James', joinDate: '2023-09-27', exitDate: '' },
];

const attendanceStatuses = ['P', 'PH', 'WO', 'LOP', 'CO', 'CL', 'EL', 'LWP'];

const AttendanceTable = ({ employees, darkMode, selectedMonth, selectedYear, attendanceData, setAttendanceData, isEditing }) => {
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const calculatePayDays = (employeeId) => {
    if (!attendanceData[employeeId]) return 0;
    return Object.values(attendanceData[employeeId]).filter(status => status !== 'LOP' && status !== 'LWP').length;
  };

  const handleAttendanceChange = (employeeId, day, value) => {
    if (!isEditing) return;
    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [day]: value
      }
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'P': 'text-green-600',
      'PH': 'text-yellow-500',
      'WO': 'text-blue-500',
      'LOP': 'text-red-500',
      'CO': 'text-purple-500',
      'CL': 'text-indigo-500',
      'EL': 'text-pink-500',
      'LWP': 'text-gray-500',
    };
    return colors[status] || '';
  };

  return (
    <div className="relative overflow-x-auto scrollable-hover" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <table className={`w-full text-xs table-fixed ${darkMode ? 'bg-[#1C1C1C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'}`}>
        <thead className={`${darkMode ? 'bg-blue-800' : 'bg-gray-300'} sticky top-0 z-30 text-black`}>
          <tr>
            <th className="px-2 py-1 text-left text-xs font-medium tracking-wider sticky left-0 z-40 w-12">Sl.No</th>
            <th className="px-2 py-1 text-left text-xs font-medium tracking-wider sticky left-12 z-40 w-20">Emp Code</th>
            <th className="px-2 py-1 text-left text-xs font-medium tracking-wider sticky left-32 z-40 w-28">Emp Name</th>
            <th className="px-2 py-1 text-left text-xs font-medium tracking-wider sticky left-60 z-40 w-20">Join Date</th>
            <th className="px-2 py-1 text-left text-xs font-medium tracking-wider sticky left-80 z-40 w-20">Exit Date</th>
            {days.map(day => (
              <th key={day} className="px-1 py-1 text-center text-xs font-medium uppercase tracking-wider w-12">
                {day}
              </th>
            ))}
            <th className="px-2 py-2 text-left text-xs font-medium  tracking-wider w-20">Pay Days</th>
            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider w-32">Remarks</th>
          </tr>
        </thead>
        <tbody className={`${darkMode ? 'divide-[#3C3C3C]' : 'divide-gray-200'}`}>
          {employees.map((employee, index) => {
            const joinDate = new Date(employee.joinDate);
            const exitDate = employee.exitDate ? new Date(employee.exitDate) : new Date(9999, 11, 31);
            return (
              <tr key={employee.id} className={darkMode ? 'bg-[#1C1C1C]' : 'bg-white'}>
                <td className="px-2 py-2 whitespace-nowrap sticky left-0 z-20 w-12 bg-inherit">{index + 1}</td>
                <td className="px-2 py-2 whitespace-nowrap sticky left-12 z-20 w-20 bg-inherit">{employee.code}</td>
                <td className="px-2 py-2 whitespace-nowrap sticky left-32 z-20 w-28 bg-inherit">{employee.name}</td>
                <td className="px-2 py-2 whitespace-nowrap sticky left-60 z-20 w-20 bg-inherit">{employee.joinDate}</td>
                <td className="px-2 py-2 whitespace-nowrap sticky left-80 z-20 w-20 bg-inherit">{employee.exitDate}</td>
                {days.map(day => {
                  const currentDate = new Date(selectedYear, selectedMonth, day);
                  const isDisabled = currentDate < joinDate || currentDate > exitDate;
                  const currentStatus = attendanceData[employee.id]?.[day] || 'P';
                  return (
                    <td key={day} className="px-1 py-2 text-center w-12">
                      {isDisabled ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <select
                          className={`border rounded text-xs px-1 w-full ${getStatusColor(currentStatus)} ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C]' : 'bg-white border-black'} ${isDisabled ? 'cursor-not-allowed bg-red-800 border-red-900' : 'hover:border-blue-500'}`}
                          value={currentStatus}
                          onChange={(e) => handleAttendanceChange(employee.id, day, e.target.value)}
                          disabled={!isEditing || isDisabled}
                        >
                          {attendanceStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  );
                })}
                <td className="px-2 py-2 whitespace-nowrap w-20">{calculatePayDays(employee.id)}</td>
                <td className="px-2 py-2 whitespace-nowrap w-32">
                  <input 
                    className={`border p-1 rounded text-xs w-full ${darkMode ? 'bg-[#2C2C2C] border-[#3C3C3C] text-[#E0E0E0]' : 'bg-white border-gray-300 text-[#31293F]'}`} 
                    type="text" 
                    placeholder="Remarks" 
                    disabled={!isEditing}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const MarkAllPopup = ({ darkMode, onClose, onMarkAll, daysInMonth }) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [status, setStatus] = useState('P');

  const handleMarkAll = () => {
    onMarkAll(selectedDay, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'} p-6 rounded-lg shadow-xl w-96`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mark All</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
            >
              {['P','WO','PH', 'LOP', 'LWP', 'CL', 'EL', 'CO'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 text-[#E0E0E0]' : 'bg-gray-200 text-[#31293F]'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleMarkAll}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-[#796EA8] text-white'}`}
          >
            Mark All
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterPopup = ({ darkMode, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    employeeName: '',
    empCode: '',
    joinDateStart: '',
    joinDateEnd: '',
    exitDateStart: '',
    exitDateEnd: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'} p-6 rounded-lg shadow-xl w-96`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee Name</label>
            <input
              type="text"
              name="employeeName"
              value={filters.employeeName}
              onChange={handleFilterChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Emp Code</label>
            <input
              type="text"
              name="empCode"
              value={filters.empCode}
              onChange={handleFilterChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Join Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="joinDateStart"
                value={filters.joinDateStart}
                onChange={handleFilterChange}
                className={`w-1/2 p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
              />
              <input
                type="date"
                name="joinDateEnd"
                value={filters.joinDateEnd}
                onChange={handleFilterChange}
                className={`w-1/2 p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Exit Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="exitDateStart"
                value={filters.exitDateStart}
                onChange={handleFilterChange}
                className={`w-1/2 p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
              />
              <input
                type="date"
                name="exitDateEnd"
                value={filters.exitDateEnd}
                onChange={handleFilterChange}
                className={`w-1/2 p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 text-[#E0E0E0]' : 'bg-gray-200 text-[#31293F]'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleApplyFilters}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-[#796EA8] text-white'}`}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadPopup = ({ darkMode, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        setUploading(true);
        setError(null);
        await onUpload(selectedFile);
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to upload file');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'} p-6 rounded-lg shadow-xl w-96`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Attendance</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select File</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className={`w-full p-2 border rounded ${darkMode ? 'bg-[#1C1C1C] border-[#3C3C3C]' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={uploading}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 text-[#E0E0E0]' : 'bg-gray-200 text-[#31293F]'} ${uploading && 'opacity-50 cursor-not-allowed'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-[#796EA8] text-white'} ${(!selectedFile || uploading) && 'opacity-50 cursor-not-allowed'}`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Alert = ({ message, type, onClose }) => {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      {message}
      <button onClick={onClose} className="ml-2 font-bold">&times;</button>
    </div>
  );
};

export default function Attendance({ darkMode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);
  const [showMarkAllPopup, setShowMarkAllPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [alert, setAlert] = useState(null);
  const itemsPerPage = 12 ;

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await attendanceService.getAttendanceHistory();
        setAttendanceData(response.data || {});
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch attendance data');
        showAlert(err.message || 'Failed to fetch attendance data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const filteredEmployees = useMemo(() => {
    return initialEmployees.filter(employee => {
      const nameMatch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
      const codeMatch = employee.code.toLowerCase().includes(searchTerm.toLowerCase());
      const joinDate = new Date(employee.joinDate);
      const exitDate = employee.exitDate ? new Date(employee.exitDate) : null;
      
      const joinDateInRange = (!appliedFilters.joinDateStart || joinDate >= new Date(appliedFilters.joinDateStart)) &&
                              (!appliedFilters.joinDateEnd || joinDate <= new Date(appliedFilters.joinDateEnd));
      
      const exitDateInRange = (!appliedFilters.exitDateStart || !exitDate || exitDate >= new Date(appliedFilters.exitDateStart)) &&
                              (!appliedFilters.exitDateEnd || !exitDate || exitDate <= new Date(appliedFilters.exitDateEnd));

      const currentDate = new Date(selectedYear, selectedMonth, 1);
      const previousMonth = new Date(selectedYear, selectedMonth - 1, 1);

      const isRelevantForSelectedMonth =
        (joinDate < previousMonth) &&
        (!exitDate || exitDate > currentDate);

      return (nameMatch || codeMatch) &&
             (!appliedFilters.employeeName || employee.name.toLowerCase().includes(appliedFilters.employeeName.toLowerCase())) &&
             (!appliedFilters.empCode || employee.code.includes(appliedFilters.empCode)) &&
             joinDateInRange && exitDateInRange && isRelevantForSelectedMonth;
    });
  }, [searchTerm, appliedFilters, selectedMonth, selectedYear]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const currentEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredEmployees.slice(start, end);
  }, [currentPage, filteredEmployees]);

  const handleMarkAll = (day, status) => {
    if (!isEditing) return;
    setAttendanceData(prev => {
      const newData = { ...prev };
      currentEmployees.forEach(employee => {
        if (newData[employee.id]) {
          newData[employee.id][day] = status;
        }
      });
      return newData;
    });
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleEdit = () => {
    if (isLocked) {
      showAlert("Attendance is locked. Only Super Admin can edit.", "error");
      return;
    }
    setIsEditing(true);
    setIsSaved(false);
    showAlert("Editing mode activated. You can now make changes to the attendance.");
  };

  const handleSave = async () => {
    try {
      await attendanceService.bulkMarkAttendance(attendanceData);
      setIsEditing(false);
      setIsSaved(true);
      showAlert("Attendance data has been saved successfully.");
    } catch (err) {
      setError(err.message || 'Failed to save attendance data');
      showAlert(err.message || 'Failed to save attendance data', 'error');
    }
  };

  const handleLock = async () => {
    if (!isSaved) {
      showAlert("Please save the data before locking.", "error");
      return;
    }
    const confirmLock = window.confirm("Are you sure you want to lock the attendance? You won't be able to make further changes.");
    if (confirmLock) {
      try {
        await attendanceService.lockAttendance(selectedMonth + 1, selectedYear);
        setIsLocked(true);
        setIsEditing(false);
        showAlert("Attendance has been locked. You cannot edit it now.");
      } catch (err) {
        setError(err.message || 'Failed to lock attendance');
        showAlert(err.message || 'Failed to lock attendance', 'error');
      }
    }
  };

  const handleUnlock = async () => {
    try {
      await attendanceService.unlockAttendance(selectedMonth + 1, selectedYear);
      setIsLocked(false);
      showAlert("Attendance has been unlocked.");
    } catch (err) {
      setError(err.message || 'Failed to unlock attendance');
      showAlert("Please contact your Super Admin to unlock the attendance.", "error");
    }
  };

  const handleExportReport = async () => {
    if (!isLocked) {
      showAlert("Please lock the attendance before exporting the report.", "error");
      return;
    }
    try {
      const response = await attendanceService.exportAttendance(selectedMonth + 1, selectedYear);
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${selectedYear}_${(selectedMonth + 1).toString().padStart(2, '0')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showAlert("Attendance report has been downloaded.");
    } catch (err) {
      setError(err.message || 'Failed to export attendance report');
      showAlert(err.message || 'Failed to export attendance report', 'error');
    }
  };

  const handleUploadAttendance = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await attendanceService.importAttendance(formData);
      setShowUploadPopup(false);
      showAlert("Attendance data has been imported successfully.");
      // Refresh attendance data
      const response = await attendanceService.getAttendanceHistory();
      setAttendanceData(response.data || {});
    } catch (err) {
      setError(err.message || 'Failed to import attendance data');
      showAlert(err.message || 'Failed to import attendance data', 'error');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await attendanceService.downloadTemplate();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showAlert("Template has been downloaded.");
    } catch (err) {
      setError(err.message || 'Failed to download template');
      showAlert(err.message || 'Failed to download template', 'error');
    }
  };

  return (
    <div className={`w-full mx-auto px-2 py-2 ${darkMode ? 'bg-[#1C1C1C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'}`}>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button className={`px-2 py-1 ${darkMode ? 'bg-[#2C2C2C] text-[#BB86FC]' : 'bg-[#F3F4F6] text-[#31293F]'} rounded`}>Attendance</button>
          {/* <button className={`px-2 py-1 ${darkMode ? 'bg-[#1C1C1C] text-[#E0E0E0]' : 'bg-white text-[#31293F]'} rounded`} disabled>Leaves</button> */}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowUploadPopup(true)}
            className={`flex items-center space-x-2 px-4 py-1 rounded-lg ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
            } hover:bg-opacity-80 transition-colors duration-200`}
              title="Upload Attendance"
          >
            <Upload size={16} />
            <span className="ml-1">Upload</span>
          </button>
          <button
            onClick={handleDownloadTemplate}
            className={`flex items-center space-x-2 px-4 py-1 rounded-lg ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
            } hover:bg-opacity-80 transition-colors duration-200`}
              title="Download Attendance Template"
          >
            <Download className="w-4 h-4" />
            <span>Template</span>
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`pl-8 pr-4 py-1 border rounded-md text-sm ${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0] border-[#3C3C3C]' : 'bg-white text-[#31293F] border-gray-300'}`}
            />
            <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-[#A6A9C8]' : 'text-gray-400'}`} size={16} />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className={`p-2 rounded ${darkMode ? 'bg-[#2C2C2C] text-[#BB86FC]' : 'bg-[#F3F4F6] text-[#31293F]'} hover:opacity-80`}
          >
            <Filter size={16} />
          </button>
          <input
            type="month"
            value={`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split('-');
              setSelectedYear(parseInt(year));
              setSelectedMonth(parseInt(month) - 1);
            }}
            className={`p-1 border rounded ${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0] border-[#3C3C3C]' : 'bg-white text-[#31293F] border-gray-300'}`}
          />
          <button
            onClick={() => setShowMarkAllPopup(true)}
            className={`px-3 py-1 ${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-[#796EA8] text-white'} rounded text-xs hover:opacity-90`}
            disabled={!isEditing}
          >
            Mark All
          </button>
        </div>
      </div>

      <AttendanceTable 
        employees={currentEmployees} 
        darkMode={darkMode} 
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        attendanceData={attendanceData}
        setAttendanceData={setAttendanceData}
        isEditing={isEditing}
      />

      <div className={`mt-2 flex items-center justify-between ${darkMode ? 'text-[#A6A9C8]' : 'text-[#554D74]'}`}>
        <div>
          Page {currentPage} of {totalPages} ({filteredEmployees.length} items)
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 border rounded ${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0] border-[#3C3C3C]' : 'bg-white text-[#31293F] border-gray-300'} hover:opacity-80`}
          >
            <ChevronLeft size={12} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 border rounded ${currentPage === page ? (darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-[#796EA8] text-white') : ''} ${darkMode ? 'border-[#3C3C3C]' : 'border-gray-300'} hover:opacity-80`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 border rounded ${darkMode ? 'bg-[#2C2C2C] text-[#E0E0E0] border-[#3C3C3C]' : 'bg-white text-[#31293F] border-gray-300'} hover:opacity-80`}
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button 
          className={`px-3 py-1 ${darkMode ? 'bg-[#3700B3] text-white' : 'bg-[#554D74] text-white'} rounded text-xs hover:opacity-90 flex items-center`}
          onClick={handleEdit}
          disabled={isLocked}
        >
          <Edit size={14} className="mr-1" />
          Edit
        </button>
        <button 
          className={`px-3 py-1 ${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-[#796EA8] text-white'} rounded text-xs hover:opacity-90 flex items-center`}
          onClick={handleSave}
          disabled={!isEditing}
        >
          <Save size={14} className="mr-1" />
          Save
        </button>
        <button 
          className={`px-3 py-1 ${darkMode ? 'bg-[#CF6679] text-[#1C1C1C]' : 'bg-[#EF4444] text-white'} rounded text-xs hover:opacity-90 flex items-center`}
          onClick={handleLock}
          disabled={isLocked || !isSaved}
        >
          <Lock size={14} className="mr-1" />
          Lock
        </button>
        <button 
          className={`px-3 py-1 ${darkMode ? 'bg-[#03DAC6] text-[#1C1C1C]' : 'bg-[#10B981] text-white'} rounded text-xs hover:opacity-90 flex items-center`}
          onClick={handleUnlock}
          disabled={!isLocked}
        >
          <Unlock size={14} className="mr-1" />
          Unlock
        </button>
        <button 
          className={`px-3 py-1 ${darkMode ? 'bg-[#BB86FC] text-[#1C1C1C]' : 'bg-[#796EA8] text-white'} rounded text-xs hover:opacity-90 flex items-center`}
          onClick={handleExportReport}
          disabled={!isLocked}
        >
          <FileUp size={14} className="mr-1" />
          Export Report
        </button>
      </div>

      {showFilters && (
        <FilterPopup
          darkMode={darkMode}
          onClose={() => setShowFilters(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}

      {showMarkAllPopup && (
        <MarkAllPopup
          darkMode={darkMode}
          onClose={() => setShowMarkAllPopup(false)}
          onMarkAll={handleMarkAll}
          daysInMonth={daysInMonth}
        />
      )}

      {showUploadPopup && (
        <UploadPopup
          darkMode={darkMode}
          onClose={() => setShowUploadPopup(false)}
          onUpload={handleUploadAttendance}
        />
      )}

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
