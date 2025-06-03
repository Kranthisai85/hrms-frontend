import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function Payslips({ employees }) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleDownloadPayslip = (employeeId) => {
    // TODO: Implement actual download logic
    console.log(`Downloading payslip for employee ${employeeId} for ${selectedMonth} ${selectedYear}`);
    alert(`Payslip download functionality to be implemented for employee ${employeeId}`);
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
      {/* <h2 className="text-xl font-semibold mb-4">Payslips</h2> */}
      <div className="mb-4 flex space-x-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-300 dark:focus:border-gray-700"
        >
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-300 dark:focus:border-gray-700"
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
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
                  onClick={() => handleDownloadPayslip(employee.id)}
                  className="text-blue-600 hover:text-blue-900 flex items-center"
                  disabled={!selectedMonth || !selectedYear}
                >
                  <Download size={18} className="mr-1" />
                  Download Payslip
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

