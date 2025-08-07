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
    const [touchedFields, setTouchedFields] = useState({});
    


    // Validation functions
    const validateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'Date of Birth is required';
        
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
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
        // Check for common invalid patterns
        const invalidPatterns = [
            'AAAAA0000A', 'BBBBB0000B', 'CCCCC0000C', 'DDDDD0000D', 'EEEEE0000E',
            'FFFFF0000F', 'GGGGG0000G', 'HHHHH0000H', 'IIIII0000I', 'JJJJJ0000J',
            'KKKKK0000K', 'LLLLL0000L', 'MMMMM0000M', 'NNNNN0000N', 'OOOOO0000O',
            'PPPPP0000P', 'QQQQQ0000Q', 'RRRRR0000R', 'SSSSS0000S', 'TTTTT0000T',
            'UUUUU0000U', 'VVVVV0000V', 'WWWWW0000W', 'XXXXX0000X', 'YYYYY0000Y',
            'ZZZZZ0000Z'
        ];
        if (invalidPatterns.includes(pan.toUpperCase())) {
            return 'Please enter a valid PAN number';
        }
        return null;
    };

    const validateAadhaar = (aadhaar) => {
        if (!aadhaar) return 'Aadhaar number is required';
        const aadhaarRegex = /^[0-9]{12}$/;
        if (!aadhaarRegex.test(aadhaar)) {
            return 'Please enter a valid 12-digit Aadhaar number';
        }
        // Check for common invalid patterns
        if (aadhaar === '000000000000' || aadhaar === '111111111111' || aadhaar === '999999999999') {
            return 'Please enter a valid Aadhaar number';
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
        
        if (dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            let ageAtJoining = joinDate.getFullYear() - birthDate.getFullYear();
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
        
        if (confirmDate < joinDate) {
            return 'Confirmation Date cannot be before Joining Date';
        }
        
        return null;
    };

    const validateResignationDate = (resignationDate, joiningDate) => {
        if (!resignationDate) return 'Resignation Date is required';
        
        const resignDate = new Date(resignationDate);
        const joinDate = new Date(joiningDate);
        
        if (resignDate < joinDate) {
            return 'Resignation Date cannot be before Joining Date';
        }
        
        return null;
    };

    const validateRelievedDate = (relievedDate, resignationDate) => {
        if (!relievedDate) return 'Relieved Date is required';
        
        const relieveDate = new Date(relievedDate);
        const resignDate = new Date(resignationDate);
        
        if (resignationDate && relieveDate < resignDate) {
            return 'Relieved Date cannot be before Resignation Date';
        }
        
        return null;
    };

    const validateCTC = (ctc) => {
        if (!ctc) return 'CTC is required';
        if (isNaN(ctc) || parseFloat(ctc) <= 0) {
            return 'CTC must be a valid positive number';
        }
        if (parseFloat(ctc) > 999999999) {
            return 'CTC cannot exceed 999,999,999';
        }
        return null;
    };

    // Validate individual field
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'empCode':
                return validateEmployeeCode(value);
            case 'name':
                return validateName(value);
            case 'dateOfBirth':
                return validateAge(value);
            case 'email':
                return validateEmail(value);
            case 'personalEmail':
                return validateEmail(value);
            case 'mobileNumber':
                return validateMobileNumber(value);
            case 'panNumber':
                return validatePAN(value);
            case 'aadharNumber':
                return validateAadhaar(value);
            case 'bloodGroup':
                return !value ? 'Blood Group is required' : null;
            case 'joiningDate':
                return validateJoiningDate(value, formData.user?.dateOfBirth);
            case 'confirmationDate':
                return validateConfirmationDate(value, formData.joiningDate);
            case 'resignationDate':
                return validateResignationDate(value, formData.joiningDate);
            case 'relievedDate':
                return validateRelievedDate(value, formData.resignationDate);
            case 'ctc':
                return validateCTC(value);
            case 'branchId':
            case 'designationId':
            case 'departmentId':
            case 'subDepartmentId':
            case 'gradeId':
            case 'categoryId':
            case 'employmentType':
            case 'employmentStatus':
            case 'gender':
                return !value ? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` : null;
            default:
                return null;
        }
    };

    // Comprehensive validation function for entire form
    const validateForm = () => {
        const errors = {};
        
        // Basic validations
        errors.empCode = validateEmployeeCode(formData.empCode);
        errors.name = validateName(formData.user?.name);
        errors.dateOfBirth = validateAge(formData.user?.dateOfBirth);
        errors.email = validateEmail(formData.email);
        errors.personalEmail = validateEmail(formData.personalEmail);
        errors.mobileNumber = validateMobileNumber(formData.user?.phone);
        errors.panNumber = validatePAN(formData.panNumber);
        errors.aadharNumber = validateAadhaar(formData.aadharNumber);
        errors.ctc = validateCTC(formData.ctc);
        errors.joiningDate = validateJoiningDate(formData.joiningDate, formData.user?.dateOfBirth);
        
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
        if (!formData.user?.bloodGroup) errors.bloodGroup = 'Blood Group is required';
        
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

    // Handle field blur - validate individual field when user leaves the field
    const handleFieldBlur = (fieldName, value) => {
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
        
        const error = validateField(fieldName, value);
        setFormErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    };

    // Handle field change - validate and remove errors when value becomes valid
    const handleFieldChange = (fieldName, value) => {
        // Validate on change if field has been touched
        if (touchedFields[fieldName]) {
            const error = validateField(fieldName, value);
            setFormErrors(prev => ({
                ...prev,
                [fieldName]: error
            }));
        }
    };

    // Handle field change with immediate validation (for real-time feedback)
    const handleFieldChangeWithValidation = (fieldName, value) => {
        // Mark field as touched and validate immediately
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
        
        const error = validateField(fieldName, value);
        setFormErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    };

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        
        setEmployeeData(prev => ({
            ...prev,
            [name]: fieldValue,
        }));
        
        // Validate field immediately for real-time feedback
        handleFieldChangeWithValidation(name, fieldValue);
    }, [setEmployeeData]);

    const handleSave = async () => {
        // Validate entire form when save is clicked
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
            personalEmail: formData.personalEmail, // Backend expects 'personalEmail'
            joiningDate: formData.joiningDate, // Backend expects 'dateOfJoin'
            confirmationDate: formData.confirmationDate,
            resignationDate: formData.resignationDate,
            relievedDate: formData.relievedDate,
            reason: formData.reason,
            inviteSent: formData.inviteSent,
            ctc: formData.ctc,
            // User details (for user update) - using backend expected field names
            name: formData.user?.name, // Backend expects 'name' not 'firstName'
            phone: formData.user?.phone, // Backend expects 'mobileNumber'
            dateOfBirth:  formData.user?.dateOfBirth,
            gender: formData.user?.gender,
            bloodGroup: formData.user?.bloodGroup
        };
        
        // Call onSaveSection with error handling for unique constraints
        try {
            await onSaveSection(sectionData);
        } catch (error) {
            console.log('Backend error received:', error);
            console.log('Error response:', error.response);
            console.log('Error data:', error.response?.data);
            
            // Handle unique constraint errors from backend
            if (error.response?.data?.errors) {
                const backendErrors = error.response.data.errors;
                console.log('Backend errors:', backendErrors);
                const newFormErrors = { ...formErrors };
                
                // Map backend error fields to frontend field names
                Object.keys(backendErrors).forEach(field => {
                    console.log(`Processing error for field: ${field}`, backendErrors[field]);
                    switch (field) {
                        case 'empCode':
                            newFormErrors.empCode = backendErrors[field];
                            break;
                        case 'officialEmail':
                            newFormErrors.email = backendErrors[field];
                            break;
                        case 'personalEmail':
                            newFormErrors.personalEmail = backendErrors[field];
                            break;
                        case 'panNumber':
                            newFormErrors.panNumber = backendErrors[field];
                            break;
                        case 'aadharNumber':
                            newFormErrors.aadharNumber = backendErrors[field];
                            break;
                        case 'phone':
                            newFormErrors.mobileNumber = backendErrors[field];
                            break;
                        case 'email':
                            newFormErrors.personalEmail = backendErrors[field];
                            break;
                        default:
                            newFormErrors[field] = backendErrors[field];
                    }
                });
                
                console.log('Updated form errors:', newFormErrors);
                setFormErrors(newFormErrors);
                setIsFormValid(false);
            } else {
                console.error('Unexpected error format:', error);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInput
                    id="empCode"
                    label="Employee Code"
                    value={formData.empCode || ''}
                    onChange={handleInputChange}
                    onBlur={(e) => handleFieldBlur('empCode', e.target.value)}
                    required
                    error={formErrors.empCode}
                />
                <FloatingInput
                    id="name"
                    label="Name"
                    value={formData.user?.name || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, name: value }
                        }));
                        handleFieldChangeWithValidation('name', value);
                    }}
                    onBlur={(e) => handleFieldBlur('name', e.target.value)}
                    required
                    error={formErrors.name}
                />
                <SearchableSelect
                    id="gender"
                    label="Gender"
                    value={formData.user?.gender}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, gender: value }
                        }));
                        handleFieldChangeWithValidation('gender', value);
                    }}
                    onBlur={(e) => handleFieldBlur('gender', e.target.value)}
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
                    value={formData.user?.dateOfBirth}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, dateOfBirth: value }
                        }));
                        handleFieldChangeWithValidation('dateOfBirth', value);
                    }}
                    onBlur={(e) => handleFieldBlur('dateOfBirth', e.target.value)}
                    required
                    error={formErrors.dateOfBirth}
                    max={new Date().toISOString().split('T')[0]}
                />
                <SearchableSelect
                    id="branchId"
                    label="Branch"
                    value={formData.branchId}
                    onChange={handleInputChange}
                    onBlur={(e) => handleFieldBlur('branchId', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('designationId', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('departmentId', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('subDepartmentId', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('gradeId', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('categoryId', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('reportingManagerId', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('joiningDate', e.target.value)}
                    required
                    error={formErrors.joiningDate}
                    min={formData.user?.dateOfBirth}
                />
                <SearchableSelect
                    id="employmentType"
                    label="Employee Type"
                    value={formData.employmentType}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange({ target: { name: 'employmentType', value: value } });
                        handleFieldChangeWithValidation('employmentType', value);
                    }}
                    onBlur={(e) => handleFieldBlur('employmentType', e.target.value)}
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
                    onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange({ target: { name: 'employmentStatus', value: value } });
                        handleFieldChangeWithValidation('employmentStatus', value);
                    }}
                    onBlur={(e) => handleFieldBlur('employmentStatus', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('confirmationDate', e.target.value)}
                    required
                    error={formErrors.confirmationDate}
                    min={formData.joiningDate || new Date().toISOString().split('T')[0]}
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
                            onBlur={(e) => handleFieldBlur('resignationDate', e.target.value)}
                            required
                            error={formErrors.resignationDate}
                            min={formData.joiningDate || new Date().toISOString().split('T')[0]}
                        />
                        <FloatingInput
                            id="relievedDate"
                            label="Date of Relieved"
                            type="date"
                            value={formData.relievedDate}
                            onChange={handleInputChange}
                            onBlur={(e) => handleFieldBlur('relievedDate', e.target.value)}
                            required
                            error={formErrors.relievedDate}
                            min={formData.resignationDate || formData.joiningDate || new Date().toISOString().split('T')[0]}
                        />
                        <SearchableSelect
                            id="reasonForResignation"
                            label="Resignation Reason"
                            value={formData.reason}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange({ target: { name: 'reason', value: value } });
                                handleFieldChangeWithValidation('reason', value);
                            }}
                            onBlur={(e) => handleFieldBlur('reason', e.target.value)}
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
                            onBlur={(e) => handleFieldBlur('relievedDate', e.target.value)}
                            required
                            error={formErrors.relievedDate}
                            min={formData.joiningDate || new Date().toISOString().split('T')[0]}
                        />
                        <SearchableSelect
                            id="reasonForTermination"
                            label="Termination Reason"
                            value={formData.reason}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange({ target: { name: 'reason', value: value } });
                                handleFieldChangeWithValidation('reason', value);
                            }}
                            onBlur={(e) => handleFieldBlur('reason', e.target.value)}
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
                        const value = e.target.value;
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, phone: value }
                        }));
                        handleFieldChangeWithValidation('mobileNumber', value);
                    }}
                    onBlur={(e) => handleFieldBlur('mobileNumber', e.target.value)}
                    required
                    error={formErrors.mobileNumber}
                    maxLength={10}
                    placeholder="10-digit mobile number"
                />
                <FloatingInput
                    id="personalEmail"
                    label="Personal Email"
                    type="email"
                    value={formData.personalEmail || ''}
                    onChange={handleInputChange}
                    onBlur={(e) => handleFieldBlur('personalEmail', e.target.value)}
                    required
                    error={formErrors.personalEmail}
                />
                <FloatingInput
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    onBlur={(e) => handleFieldBlur('email', e.target.value)}
                    required
                    error={formErrors.email}
                />
                <SearchableSelect
                    id="bloodGroup"
                    label="Blood Group"
                    value={formData.user?.bloodGroup}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, bloodGroup: value }
                        }));
                        handleFieldChangeWithValidation('bloodGroup', value);
                    }}
                    onBlur={(e) => handleFieldBlur('bloodGroup', e.target.value)}
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
                    error={formErrors.bloodGroup}
                />
                <FloatingInput
                    id="aadharNumber"
                    label="Aadhaar No"
                    value={formData.aadharNumber || ''}
                    onChange={handleInputChange}
                    onBlur={(e) => handleFieldBlur('aadharNumber', e.target.value)}
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
                    onBlur={(e) => handleFieldBlur('panNumber', e.target.value)}
                    required
                    error={formErrors.panNumber}
                    maxLength={10}
                                         placeholder="ABCDE1234F"
                 />
                 <FloatingInput
                     id="ctc"
                     label="CTC (Cost to Company)"
                     type="number"
                     value={formData.ctc || ''}
                     onChange={handleInputChange}
                     onBlur={(e) => handleFieldBlur('ctc', e.target.value)}
                     required
                     error={formErrors.ctc}
                     min="0"
                     step="0.01"
                     placeholder="Enter CTC amount"
                 />
                 <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="inviteSent"
                        name="inviteSent"
                        checked={formData.inviteSent}
                        onChange={handleInputChange}
                        onBlur={(e) => handleFieldBlur('inviteSent', e.target.checked)}
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
                        !loading
                            ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={loading}
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
            {/* Validation Summary - Only show when form is submitted or fields are touched */}
            {/* {Object.keys(formErrors).length > 0 && (
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
            )} */}
        </div>
    );
}