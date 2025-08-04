import { useCallback, useState, useEffect } from 'react';
import {
    branchService,
    categoryService,
    departmentService,
    designationService,
    employeeService,
    gradesService,
    reasonsService,
    subDepartmentService,
} from '../../../services/api';
import FloatingInput from '../FloatingInput.jsx';
import SearchableSelect from '../SearchableSelect.jsx';

export function OrgDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // Use employeeData for form values
    const formData = employeeData;
    const [formErrors, setFormErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Validation functions
    const validateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'Date of Birth is required';
        
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            return 'Employee must be at least 18 years old';
        }
        if (age > 70) {
            return 'Employee age cannot be more than 70 years';
        }
        return null;
    };

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return null;
    };

    const validateMobileNumber = (phone) => {
        if (!phone) return 'Mobile number is required';
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9';
        }
        return null;
    };

    const validatePAN = (pan) => {
        if (!pan) return 'PAN is required';
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(pan.toUpperCase())) {
            return 'Please enter a valid PAN number (e.g., ABCDE1234F)';
        }
        return null;
    };

    const validateAadhaar = (aadhaar) => {
        if (!aadhaar) return 'Aadhaar number is required';
        const aadhaarRegex = /^[0-9]{12}$/;
        if (!aadhaarRegex.test(aadhaar)) {
            return 'Please enter a valid 12-digit Aadhaar number';
        }
        return null;
    };

    const validateEmployeeCode = (empCode) => {
        if (!empCode) return 'Employee Code is required';
        if (empCode.length < 3) {
            return 'Employee Code must be at least 3 characters long';
        }
        if (empCode.length > 20) {
            return 'Employee Code cannot exceed 20 characters';
        }
        return null;
    };

    const validateName = (name) => {
        if (!name) return 'Name is required';
        if (name.length < 2) {
            return 'Name must be at least 2 characters long';
        }
        if (name.length > 50) {
            return 'Name cannot exceed 50 characters';
        }
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            return 'Name can only contain letters and spaces';
        }
        return null;
    };

    const validateJoiningDate = (joiningDate, dateOfBirth) => {
        if (!joiningDate) return 'Joining Date is required';
        
        const joinDate = new Date(joiningDate);
        const today = new Date();
        
        if (joinDate > today) {
            return 'Joining Date cannot be in the future';
        }
        
        if (dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            const ageAtJoining = joinDate.getFullYear() - birthDate.getFullYear();
            const monthDiff = joinDate.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && joinDate.getDate() < birthDate.getDate())) {
                ageAtJoining--;
            }
            
            if (ageAtJoining < 18) {
                return 'Employee must be at least 18 years old at joining date';
            }
        }
        
        return null;
    };

    const validateConfirmationDate = (confirmationDate, joiningDate) => {
        if (!confirmationDate) return 'Confirmation Date is required';
        
        const confirmDate = new Date(confirmationDate);
        const joinDate = new Date(joiningDate);
        const today = new Date();
        
        if (confirmDate < joinDate) {
            return 'Confirmation Date cannot be before Joining Date';
        }
        
        if (confirmDate > today) {
            return 'Confirmation Date cannot be in the future';
        }
        
        return null;
    };

    const validateResignationDate = (resignationDate, joiningDate) => {
        if (!resignationDate) return 'Resignation Date is required';
        
        const resignDate = new Date(resignationDate);
        const joinDate = new Date(joiningDate);
        const today = new Date();
        
        if (resignDate < joinDate) {
            return 'Resignation Date cannot be before Joining Date';
        }
        
        if (resignDate > today) {
            return 'Resignation Date cannot be in the future';
        }
        
        return null;
    };

    const validateRelievedDate = (relievedDate, resignationDate) => {
        if (!relievedDate) return 'Relieved Date is required';
        
        const relieveDate = new Date(relievedDate);
        const resignDate = new Date(resignationDate);
        const today = new Date();
        
        if (resignationDate && relieveDate < resignDate) {
            return 'Relieved Date cannot be before Resignation Date';
        }
        
        if (relieveDate > today) {
            return 'Relieved Date cannot be in the future';
        }
        
        return null;
    };

    // Comprehensive validation function
    const validateForm = () => {
        const errors = {};
        
        // Basic validations
        errors.empCode = validateEmployeeCode(formData.empCode);
        errors.name = validateName(formData.user?.name);
        errors.dateOfBirth = validateAge(formData.user?.date_of_birth || formData.user?.dateOfBirth);
        errors.email = validateEmail(formData.email);
        errors.mobileNumber = validateMobileNumber(formData.user?.phone);
        errors.panNumber = validatePAN(formData.panNumber);
        errors.aadharNumber = validateAadhaar(formData.aadharNumber);
        errors.joiningDate = validateJoiningDate(formData.joiningDate, formData.user?.date_of_birth || formData.user?.dateOfBirth);
        
        // Conditional validations
        if (formData.employmentStatus === 'Confirmed' && formData.confirmationDate) {
            errors.confirmationDate = validateConfirmationDate(formData.confirmationDate, formData.joiningDate);
        }
        
        if ((formData.employmentStatus === 'Resigned' || formData.employmentStatus === 'Relieved') && formData.resignationDate) {
            errors.resignationDate = validateResignationDate(formData.resignationDate, formData.joiningDate);
        }
        
        if (formData.relievedDate) {
            errors.relievedDate = validateRelievedDate(formData.relievedDate, formData.resignationDate);
        }
        
        // Required field validations
        if (!formData.branchId) errors.branchId = 'Branch is required';
        if (!formData.designationId) errors.designationId = 'Designation is required';
        if (!formData.departmentId) errors.departmentId = 'Department is required';
        if (!formData.subDepartmentId) errors.subDepartmentId = 'Sub Department is required';
        if (!formData.gradeId) errors.gradeId = 'Grade is required';
        if (!formData.categoryId) errors.categoryId = 'Category is required';
        if (!formData.employmentType) errors.employmentType = 'Employment Type is required';
        if (!formData.employmentStatus) errors.employmentStatus = 'Employment Status is required';
        if (!formData.user?.gender) errors.gender = 'Gender is required';
        if (!formData.user?.blood_group) errors.bloodGroup = 'Blood Group is required';
        
        // Remove null values
        Object.keys(errors).forEach(key => {
            if (errors[key] === null) {
                delete errors[key];
            }
        });
        
        setFormErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
        
        return Object.keys(errors).length === 0;
    };

    // Validate form on data changes
    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, [setEmployeeData]);

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }
        
        // Prepare data matching backend API expectations
        const sectionData = {
            // Employee basic fields (only those expected by backend)
            departmentId: formData.departmentId,
            empCode: formData.empCode,
            designationId: formData.designationId,
            subDepartmentId: formData.subDepartmentId,
            gradeId: formData.gradeId,
            categoryId: formData.categoryId,
            reportingManagerId: formData.reportingManagerId,
            branchId: formData.branchId,
            employmentType: formData.employmentType,
            employmentStatus: formData.employmentStatus,
            panNumber: formData.panNumber, // Backend expects 'pan'
            aadharNumber: formData.aadharNumber, // Backend expects 'aadhaarNo'
            officialEmail: formData.email, // Backend expects 'officialEmail'
            joiningDate: formData.joiningDate, // Backend expects 'dateOfJoin'
            confirmationDate: formData.confirmationDate,
            resignationDate: formData.resignationDate,
            relievedDate: formData.relievedDate,
            reason: formData.reason,
            inviteSent: formData.inviteSent,
            
            // User details (for user update) - using backend expected field names
            name: formData.user?.name, // Backend expects 'name' not 'firstName'
            phone: formData.user?.phone, // Backend expects 'mobileNumber'
            dateOfBirth: formData.user?.date_of_birth || formData.user?.dateOfBirth,
            gender: formData.user?.gender,
            bloodGroup: formData.user?.blood_group || formData.user?.bloodGroup
        };
        onSaveSection(sectionData);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInput
                    id="empCode"
                    label="Employee Code"
                    value={formData.empCode || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.empCode}
                />
                <FloatingInput
                    id="name"
                    label="Name"
                    value={formData.user?.name || ''}
                    onChange={(e) => {
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, name: e.target.value }
                        }));
                    }}
                    required
                    error={formErrors.name}
                />
                <SearchableSelect
                    id="gender"
                    label="Gender"
                    value={formData.user?.gender}
                    onChange={(e) => {
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, gender: e.target.value }
                        }));
                    }}
                    staticOptions={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' },
                    ]}
                    required
                />
                <FloatingInput
                    id="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    value={formData.user?.date_of_birth || formData.user?.dateOfBirth}
                    onChange={(e) => {
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, date_of_birth: e.target.value }
                        }));
                    }}
                    required
                    error={formErrors.dateOfBirth}
                    max={new Date().toISOString().split('T')[0]}
                />
                <SearchableSelect
                    id="branchId"
                    label="Branch"
                    value={formData.branchId}
                    onChange={handleInputChange}
                    fetchOptions={branchService.getBranches}
                    darkMode={darkMode}
                    required
                    error={formErrors.branchId}
                />
                <SearchableSelect
                    id="designationId"
                    label="Designation"
                    value={formData.designationId}
                    onChange={handleInputChange}
                    fetchOptions={designationService.getDesignations}
                    darkMode={darkMode}
                    required
                    error={formErrors.designationId}
                />
                <SearchableSelect
                    id="departmentId"
                    label="Department"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    fetchOptions={departmentService.getDepartments}
                    darkMode={darkMode}
                    required
                    error={formErrors.departmentId}
                />
                <SearchableSelect
                    id="subDepartmentId"
                    label="Sub Department"
                    value={formData.subDepartmentId}
                    onChange={handleInputChange}
                    fetchOptions={subDepartmentService.getAllSubDepartments}
                    darkMode={darkMode}
                    required
                    error={formErrors.subDepartmentId}
                />
                <SearchableSelect
                    id="gradeId"
                    label="Grade"
                    value={formData.gradeId}
                    onChange={handleInputChange}
                    fetchOptions={gradesService.getGrades}
                    darkMode={darkMode}
                    required
                    error={formErrors.gradeId}
                />
                <SearchableSelect
                    id="categoryId"
                    label="Category"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    fetchOptions={categoryService.getAllCategories}
                    darkMode={darkMode}
                    required
                    error={formErrors.categoryId}
                />
                <SearchableSelect
                    id="reportingManagerId"
                    label="Reporting Manager"
                    value={formData.reportingManagerId}
                    onChange={handleInputChange}
                    error={formErrors.reportingManagerId}
                    fetchOptions={employeeService.getEmployees}
                    darkMode={darkMode}
                    isEmployee={true}
                    required
                />
                <FloatingInput
                    id="joiningDate"
                    label="Date of Join"
                    type="date"
                    value={formData.joiningDate || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.joiningDate}
                    max={new Date().toISOString().split('T')[0]}
                />
                <SearchableSelect
                    id="employmentType"
                    label="Employee Type"
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange({ target: { name: 'employmentType', value: e.target.value } })}
                    staticOptions={[
                        { value: 'Full-time', label: 'Full-Time' },
                        { value: 'Part-time', label: 'Part-Time' },
                        { value: 'Contract', label: 'Contract' },
                        { value: 'Intern', label: 'Intern' },
                    ]}
                    required
                    error={formErrors.employmentType}
                />
                <SearchableSelect
                    id="employmentStatus"
                    label="Employment Status"
                    value={formData.employmentStatus}
                    onChange={(e) => handleInputChange({ target: { name: 'employmentStatus', value: e.target.value } })}
                    staticOptions={[
                        { value: 'Probation', label: 'Probation' },
                        { value: 'Confirmed', label: 'Confirmed' },
                        { value: 'Resigned', label: 'Resigned' },
                        { value: 'Relieved', label: 'Relieved' },
                        { value: 'Terminated', label: 'Terminated' },
                    ]}
                    darkMode={darkMode}
                    required
                    error={formErrors.employmentStatus}
                />
                {formData.employmentStatus === 'Confirmed' && (
                                    <FloatingInput
                    id="confirmationDate"
                    label="Confirmation Date"
                    type="date"
                    value={formData.confirmationDate}
                    onChange={handleInputChange}
                    required
                    error={formErrors.confirmationDate}
                    min={formData.joiningDate || new Date().toISOString().split('T')[0]}
                    max={new Date().toISOString().split('T')[0]}
                />
                )}
                {(formData.employmentStatus === 'Resigned' || formData.employmentStatus === 'Relieved') && (
                    <>
                        <FloatingInput
                            id="resignationDate"
                            label="Date of Resignation"
                            type="date"
                            value={formData.resignationDate}
                            onChange={handleInputChange}
                            required
                            error={formErrors.resignationDate}
                            min={formData.joiningDate || new Date().toISOString().split('T')[0]}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        <FloatingInput
                            id="relievedDate"
                            label="Date of Relieved"
                            type="date"
                            value={formData.relievedDate}
                            onChange={handleInputChange}
                            required
                            error={formErrors.relievedDate}
                            min={formData.resignationDate || formData.joiningDate || new Date().toISOString().split('T')[0]}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        <SearchableSelect
                            id="reasonForResignation"
                            label="Resignation Reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            fetchOptions={reasonsService.getAllResignationReasons}
                            darkMode={darkMode}
                            required
                            error={formErrors.reason}
                        />
                    </>
                )}
                {formData.employmentStatus === 'Terminated' && (
                    <>
                        <FloatingInput
                            id="relievedDate"
                            label="Date of Relieved"
                            type="date"
                            value={formData.relievedDate}
                            onChange={handleInputChange}
                            required
                            error={formErrors.relievedDate}
                            min={formData.joiningDate || new Date().toISOString().split('T')[0]}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        <SearchableSelect
                            id="reasonForTermination"
                            label="Termination Reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            fetchOptions={reasonsService.getAllTerminationReasons}
                            darkMode={darkMode}
                            required
                            error={formErrors.reason}
                        />
                    </>
                )}
                <FloatingInput
                    id="mobileNumber"
                    label="Mobile Number"
                    value={formData.user?.phone}
                    onChange={(e) => {
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, phone: e.target.value }
                        }));
                    }}
                    required
                    error={formErrors.mobileNumber}
                    maxLength={10}
                    placeholder="10-digit mobile number"
                />
                <FloatingInput
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.email}
                />
                <SearchableSelect
                    id="bloodGroup"
                    label="Blood Group"
                    value={formData.user?.blood_group}
                    onChange={(e) => {
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, blood_group: e.target.value }
                        }));
                    }}
                    staticOptions={[
                        { label: 'A+', value: 'A+' },
                        { label: 'A-', value: 'A-' },
                        { label: 'B+', value: 'B+' },
                        { label: 'B-', value: 'B-' },
                        { label: 'AB+', value: 'AB+' },
                        { label: 'AB-', value: 'AB-' },
                        { label: 'O+', value: 'O+' },
                        { label: 'O-', value: 'O-' }
                    ]}
                    required
                />
                <FloatingInput
                    id="aadharNumber"
                    label="Aadhaar No"
                    value={formData.aadharNumber || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.aadharNumber}
                    maxLength={12}
                    placeholder="12-digit Aadhaar number"
                />
                <FloatingInput
                    id="panNumber"
                    label="PAN"
                    value={formData.panNumber || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.panNumber}
                    maxLength={10}
                    placeholder="ABCDE1234F"
                />
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="inviteSent"
                        name="inviteSent"
                        checked={formData.inviteSent}
                        onChange={handleInputChange}
                        className="mr-2 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="inviteSent" className="text-sm font-medium text-gray-700">
                        Send Invite
                    </label>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <button
                    onClick={handleSave}
                    className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isFormValid && !loading
                            ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={loading || !isFormValid}
                >
                    {employeeData.id ? 'Update ' : 'Create '} {"Employee"}
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>
            {feedback && (
                <div className={`mt-2 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</div>
            )}
            
            {/* Validation Summary */}
            {Object.keys(formErrors).length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                        {Object.entries(formErrors).map(([field, error]) => (
                            <li key={field} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{error}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}