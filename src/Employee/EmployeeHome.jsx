import React from 'react';
import { Link } from 'react-router-dom';

export default function EmployeeHome() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Link to="/employee/profile" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p>View and edit your profile information</p>
      </Link>
      <Link to="/employee/payroll" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">Payroll</h2>
        <p>Access your salary information and payslips</p>
      </Link>
      <Link to="/employee/attendance" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">Attendance</h2>
        <p>Check your attendance records</p>
      </Link>
      {/* Add more sections as needed */}
    </div>
  );
}