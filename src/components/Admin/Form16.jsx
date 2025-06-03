import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function Form16({ employees }) {
  const [selectedYear, setSelectedYear] = useState('');

  const handleDownloadForm16 = (employeeId) => {
    // TODO: Implement actual download logic
    console.log(`Downloading Form-16 for employee ${employeeId} for year ${selectedYear}`);
    alert(`Form-16 download functionality to be implemented for employee ${employeeId}`);
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
      {/* <h2 className="text-xl font-semibold mb-4">Form-16</h2> */}
      <div className="mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-300 dark:focus:border-gray-700"
        >
          <option value="">Select Financial Year</option>
          <option value="2022-2023">2022-2023</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2024-2025">2024-2025</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{employee.company}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDownloadForm16(employee.id)}
                  className="text-blue-600 hover:text-blue-900 flex items-center"
                  disabled={!selectedYear}
                >
                  <Download size={18} className="mr-1" />
                  Download Form-16
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

