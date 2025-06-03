import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const EmployeeReports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payslips, setPayslips] = useState([]);
  const [form16Data, setForm16Data] = useState([]);

  useEffect(() => {
    // Fetch payslips for the selected year
    fetch(`/api/payslips?year=${selectedYear}`)
      .then((res) => res.json())
      .then((data) => setPayslips(data));

    // Fetch Form-16 data
    fetch(`/api/form16`)
      .then((res) => res.json())
      .then((data) => setForm16Data(data));
  }, [selectedYear]);

  const tabs = ["Payslips", "Form-16"];

  return (
    <div className="p-1">
      {/* Tabs */}
      <div className="flex  border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === index
                ? 'bg-gray-200 font-semibold border-b-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Payslips</h3>

          {/* Year Dropdown */}
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-600">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="mt-2 w-32 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>

          {/* Payslips Table */}
          <table className="w-full mt-4 border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-2">Month</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <tr key={month} className="text-center">
                  <td className="border px-4 py-2">{month}</td>
                  <td className="border px-4 py-2">
                    {payslips.includes(month) ? (
                      <a
                        href={`/download/${selectedYear}/${month}`}
                        className="text-purple-500 hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 1 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Form-16</h3>

          {/* Form-16 Tables */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {["Part-A", "Part-B"].map((part, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-gray-700">{part}</h4>
                <table className="w-full mt-2 border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="border px-4 py-2">Year</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form16Data.map((yearData) => (
                      <tr key={yearData.year} className="text-center">
                        <td className="border px-4 py-2">{yearData.year}</td>
                        <td className="border px-4 py-2">
                          {yearData[part] ? (
                            <CheckCircle className="text-green-500 w-5 h-5 mx-auto" />
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeReports;
