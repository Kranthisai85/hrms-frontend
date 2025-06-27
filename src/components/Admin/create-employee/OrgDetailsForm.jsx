import { useCallback, useState } from 'react';
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

export function OrgDetailsForm({ employee, onSave, darkMode }) {
    const initialFormData = {
        empCode: employee?.employeeId || '',
        name: employee?.user?.name || '',
        gender: employee?.user.gender || '', // Not present in employee object; stays as is
        dateOfBirth: employee?.user.date_of_birth || '', // Not present in employee object; stays as is
        branch: employee?.branchId || '',
        designation: employee?.designationId || '',
        department: employee?.departmentId || '',
        subDepartment: employee?.subDepartmentId || '',
        grade: employee?.gradeId || '',
        category: employee?.categoryId || '',
        reportingManager: employee?.reportingManagerId || '',
        employeeType: employee?.employmentType || '',
        employmentStatus: employee?.employmentStatus || '',
        dateOfJoin: employee?.joiningDate || '',
        mobileNumber: employee?.user.phone || '', // Not present; adjust if available elsewhere
        personalEmail: employee?.user.email || '', // Not present; adjust if available elsewhere
        officialEmail: employee?.email || '',
        bloodGroup: employee?.bloodGroup || '', // Not present; stays as is
        inviteSent: employee?.inviteSent || false,
        confirmationDate: employee?.confirmationDate || '',
        resignationDate: employee?.resignationDate || '',
        relievedDate: employee?.relievedDate || '',
        reason: employee?.reason || '',
        aadhaarNo: employee?.aadharNumber || '',
        pan: employee?.panNumber || '',
    };


    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);


    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.empCode) errors.empCode = 'Employee Code is required';
        if (!formData.name) errors.name = 'Name is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of Birth is required';
        if (!formData.branch) errors.branch = 'Branch is required';
        if (!formData.designation) errors.designation = 'Designation is required';
        if (!formData.department) errors.department = 'Department is required';
        if (!formData.subDepartment) errors.subDepartment = 'Sub Department is required';
        if (!formData.grade) errors.grade = 'Grade is required';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.reportingManager) errors.reportingManager = 'Reporting Manager is required';
        if (!formData.employeeType) errors.employeeType = 'Employee Type is required';
        if (!formData.employmentStatus) errors.employmentStatus = 'Employment Status is required';
        if (!formData.dateOfJoin) errors.dateOfJoin = 'Date of Join is required';
        if (formData.employmentStatus === 'confirmed' && !formData.confirmationDate) {
            errors.confirmationDate = 'Confirmation Date is required';
        }
        if (
            (formData.employmentStatus === 'resigned' || formData.employmentStatus === 'relieved') &&
            !formData.resignationDate
        ) {
            errors.resignationDate = 'Date of Resignation is required';
        }
        if (formData.employmentStatus === 'relieved' && !formData.relievedDate) {
            errors.relievedDate = 'Date of Relieved is required';
        }
        if (!formData.mobileNumber) errors.mobileNumber = 'Mobile Number is required';
        if (!formData.officialEmail) errors.officialEmail = 'Official Email is required';
        return errors;
    }, [formData]);

    const handleSave = () => {
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            onSave(formData);
        } else {
            setFormErrors(errors);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInput
                    id="empCode"
                    label="Employee Code"
                    value={formData.empCode}
                    onChange={handleInputChange}
                    required
                    error={formErrors.empCode}
                />
                <FloatingInput
                    id="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    error={formErrors.name}
                />
                <SearchableSelect
                    id="gender"
                    label="Gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange({ target: { name: 'gender', value: e.target.value } })}
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
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    error={formErrors.dateOfBirth}
                />
                <SearchableSelect
                    id="branch"
                    label="Branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    fetchOptions={branchService.getBranches}
                    darkMode={darkMode}
                    required
                    error={formErrors.branch}
                />
                <SearchableSelect
                    id="designation"
                    label="Designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    fetchOptions={designationService.getDesignations}
                    darkMode={darkMode}
                    required
                    error={formErrors.designation}
                />
                <SearchableSelect
                    id="department"
                    label="Department"
                    value={formData.department}
                    onChange={handleInputChange}
                    fetchOptions={departmentService.getDepartments}
                    darkMode={darkMode}
                    required
                    error={formErrors.department}
                />
                <SearchableSelect
                    id="subDepartment"
                    label="Sub Department"
                    value={formData.subDepartment}
                    onChange={handleInputChange}
                    fetchOptions={subDepartmentService.getAllSubDepartments}
                    darkMode={darkMode}
                    required
                    error={formErrors.subDepartment}
                />
                <SearchableSelect
                    id="grade"
                    label="Grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    fetchOptions={gradesService.getGrades}
                    darkMode={darkMode}
                    required
                    error={formErrors.grade}
                />
                <SearchableSelect
                    id="category"
                    label="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    fetchOptions={categoryService.getAllCategories}
                    darkMode={darkMode}
                    required
                    error={formErrors.category}
                />
                <SearchableSelect
                    id="reportingManager"
                    label="Reporting Manager"
                    value={formData.reportingManager}
                    onChange={handleInputChange}
                    error={formErrors.reportingManager}
                    fetchOptions={employeeService.getEmployees}
                    darkMode={darkMode}
                    isEmployee={true}
                    required
                />
                <FloatingInput
                    id="dateOfJoin"
                    label="Date of Join"
                    type="date"
                    value={formData.dateOfJoin}
                    onChange={handleInputChange}
                    required
                    error={formErrors.dateOfJoin}
                />
                <SearchableSelect
                    id="employeeType"
                    label="Employee Type"
                    value={formData.employeeType}
                    onChange={(e) => handleInputChange({ target: { name: 'employeeType', value: e.target.value } })}
                    staticOptions={[
                        { value: 'Full-time', label: 'Full-Time' },
                        { value: 'Part-time', label: 'Part-Time' },
                        { value: 'Contract', label: 'Contract' },
                        { value: 'Intern', label: 'Intern' },
                    ]}
                    required
                    error={formErrors.employeeType}
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
                        />
                        <FloatingInput
                            id="relievedDate"
                            label="Date of Relieved"
                            type="date"
                            value={formData.relievedDate}
                            onChange={handleInputChange}
                            required
                            error={formErrors.relievedDate}
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
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                    error={formErrors.mobileNumber}
                />
                <FloatingInput
                    id="personalEmail"
                    label="Personal Email"
                    type="email"
                    value={formData.personalEmail}
                    onChange={handleInputChange}
                    required
                    error={formErrors.personalEmail}
                />
                <FloatingInput
                    id="officialEmail"
                    label="Official Email"
                    type="email"
                    value={formData.officialEmail}
                    onChange={handleInputChange}
                    required
                    error={formErrors.officialEmail}
                />
                <SearchableSelect
                    id="bloodGroup"
                    label="Blood Group"
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange({ target: { name: 'bloodGroup', value: e.target.value } })}
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
                    id="aadhaarNo"
                    label="Aadhaar No"
                    value={formData.aadhaarNo || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.aadhaarNo}
                />
                <FloatingInput
                    id="pan"
                    label="PAN"
                    value={formData.pan || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.pan}
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {employee ? 'Update ' : 'Create '} {"Employee"}
                </button>
            </div>
        </div>
    );
}