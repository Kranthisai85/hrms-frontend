import React from 'react';

export default function EmployeeHelp() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Help & Support</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">How do I update my personal information?</h3>
            <p className="text-gray-600">You can update your personal information in the Profile section of your dashboard.</p>
          </div>
          <div>
            <h3 className="font-medium">Where can I find my payslips?</h3>
            <p className="text-gray-600">Payslips are available in the Payroll section of your dashboard.</p>
          </div>
          <div>
            <h3 className="font-medium">How do I apply for leave?</h3>
            <p className="text-gray-600">You can apply for leave through the Attendance section of your dashboard.</p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
        <p className="mb-4">If you need further assistance, please contact our HR support team:</p>
        <p className="font-medium">Email: hr@company.com</p>
        <p className="font-medium">Phone: (123) 456-7890</p>
      </div>
    </div>
  );
}