'use client'

import React, { createContext, useState, useContext } from 'react';

const EmployeeContext = createContext();

export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([
    { id: 'EMP5563', name: 'Vinutha G', department: 'IT', designation: 'Software Engineer', branch: 'Bangalore', dateOfJoin: '2022-01-01', mobile: '1234567890', email: 'vinutha@example.com', dateOfBirth: '1990-01-01', reportingManager: 'John Doe', gender: 'Female', subDepartment: 'Development', employmentType: 'Full-time', employmentStatus: 'Probation', dateOfLeaving: '', dateOfResignation: '', dateOfConfirmation: '', bloodGroup: 'O+', officialEmail: 'vinutha.official@example.com' },
    { id: 'EMP5564', name: 'John Doe', department: 'HR', designation: 'HR Manager', branch: 'Mumbai', dateOfJoin: '2021-03-01', mobile: '2345678901', email: 'john@example.com', dateOfBirth: '1985-05-15', reportingManager: 'Jane Smith', gender: 'Male', subDepartment: 'Recruitment', employmentType: 'Full-time', employmentStatus: 'Confirmed', dateOfLeaving: '', dateOfResignation: '', dateOfConfirmation: '2021-06-01', bloodGroup: 'A+', officialEmail: 'john.official@example.com' },
    { id: 'EMP5565', name: 'Jane Smith', department: 'Admin', designation: 'Admin Assistant', branch: 'Delhi', dateOfJoin: '2022-02-15', mobile: '3456789012', email: 'jane@example.com', dateOfBirth: '1992-10-20', reportingManager: 'Mike Johnson', gender: 'Female', subDepartment: 'General Admin', employmentType: 'Full-time', employmentStatus: 'Confirmed', dateOfLeaving: '', dateOfResignation: '', dateOfConfirmation: '2022-05-01', bloodGroup: 'B+', officialEmail: 'jane.official@example.com' },
    { id: 'EMP5566', name: 'Mike Johnson', department: 'Sales', designation: 'Sales Manager', branch: 'Chennai', dateOfJoin: '2022-04-01', mobile: '4567890123', email: 'mike@example.com', dateOfBirth: '1988-07-10', reportingManager: 'Emily Brown', gender: 'Male', subDepartment: 'Sales Team', employmentType: 'Full-time', employmentStatus: 'Confirmed', dateOfLeaving: '', dateOfResignation: '', dateOfConfirmation: '2022-07-01', bloodGroup: 'AB+', officialEmail: 'mike.official@example.com' },
    { id: 'EMP5567', name: 'Emily Brown', department: 'Marketing', designation: 'Marketing Manager', branch: 'Hyderabad', dateOfJoin: '2022-05-15', mobile: '5678901234', email: 'emily@example.com', dateOfBirth: '1995-03-25', reportingManager: null, gender: 'Female', subDepartment: 'Digital Marketing', employmentType: 'Full-time', employmentStatus: 'Confirmed', dateOfLeaving: '', dateOfResignation: '', dateOfConfirmation: '2022-08-01', bloodGroup: 'O-', officialEmail: 'emily.official@example.com' },
  ]);

  const addEmployee = (newEmployee) => {
    setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const deleteEmployee = (employeeId) => {
    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeId));
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};