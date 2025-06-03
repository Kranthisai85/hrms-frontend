import React from 'react';
import { Eye, Edit } from 'lucide-react';

export default function InvestmentDeclaration({ employees, selectedYear, onView, onEdit }) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tax Regime</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{employee.company}</td>
              <td className="px-6 py-4 whitespace-nowrap">{employee.department}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  employee.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {employee.status}
                </span>
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.taxRegime === 'old' ? 'Old Regime' : 'New Regime'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => onView(employee)} className="text-blue-600 hover:text-blue-900 mr-2">
                  <Eye size={18} />
                </button>
                <button onClick={() => onEdit(employee)} className="text-green-600 hover:text-green-900">
                  <Edit size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

