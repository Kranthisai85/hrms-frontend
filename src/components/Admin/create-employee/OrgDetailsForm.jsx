import { useCallback } from 'react';
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
    const formErrors = {};
    // (You can add validation logic here if needed)

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, [setEmployeeData]);

    const handleSave = () => {
        // Only send org section fields - using API response field names
        const orgFields = [
            'employeeId','user','branchId','designationId','departmentId','subDepartmentId','gradeId','categoryId','reportingManagerId','employmentType','employmentStatus','joiningDate','email','inviteSent','confirmationDate','resignationDate','relievedDate','reason','aadharNumber','panNumber'
        ];
        const sectionData = {};
        orgFields.forEach(f => { 
            if (formData[f] !== undefined) {
                if (f === 'user') {
                    // Handle nested user object
                    sectionData[f] = formData[f];
                } else {
                    sectionData[f] = formData[f];
                }
            }
        });
        onSaveSection(sectionData);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInput
                    id="employeeId"
                    label="Employee Code"
                    value={formData.employeeId || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.employeeId}
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
                    value={formData.user?.date_of_birth}
                    onChange={(e) => {
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, date_of_birth: e.target.value }
                        }));
                    }}
                    required
                    error={formErrors.dateOfBirth}
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
                    value={formData.user?.phone}
                    onChange={(e) => {
                        setEmployeeData(prev => ({
                            ...prev,
                            user: { ...prev.user, phone: e.target.value }
                        }));
                    }}
                    required
                    error={formErrors.mobileNumber}
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
                />
                <FloatingInput
                    id="panNumber"
                    label="PAN"
                    value={formData.panNumber || ''}
                    onChange={handleInputChange}
                    required
                    error={formErrors.panNumber}
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
        </div>
    );
}