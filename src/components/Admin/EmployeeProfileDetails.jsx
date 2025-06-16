import { format } from 'date-fns';
import { FileUp, PlusCircle, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { branchService, categoryService, departmentService, designationService, employeeService, gradesService, reasonsService, subDepartmentService } from "../../services/api";
import SearchableSelect from './SearchableSelect'; // Import the new widget

// Helper components
const FloatingInput = ({ id, label, value, onChange, type = 'text', required = false, error }) => (
  <div className="relative mb-4">
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
    />
    <label
      htmlFor={id}
      className={`absolute text-sm ${error ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
    >
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const FloatingSelect = ({ id, label, value, onChange, options, required = false, error }) => (
  <div className="relative mb-4">
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      style={{ color: error ? '#ef4444' : '#6b7280' }}
      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <label
      htmlFor={id}
      className={`absolute text-sm ${error ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
    >
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default function EmployeeProfileDetails({
  employee,
  darkMode,
  onSave,
  onCancel,
  bloodGroupOptions,
  formId
}) {
  const [activeTab, setActiveTab] = useState('org');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]); // Added for branch dropdown
  const [branchLoading, setBranchLoading] = useState(false); // Added for loading state
  const [branchError, setBranchError] = useState(null);
  // Initialize formData with employee data or empty values
  const initialFormData = employee || {
    // Org Details
    empCode: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    branch: '',
    designation: '',
    department: '',
    subDepartment: '',
    grade: '',
    category: '',
    reportingManager: '',
    employeeType: '',
    employmentStatus: '',
    dateOfJoin: '',
    mobileNumber: '',
    personalEmail: '',
    officialEmail: '',
    bloodGroup: '',
    inviteSent: false,
    confirmationDate: '',
    resignationDate: '', // Added for resignation date
    relievedDate: '', // Added for relieved date
    reason: '',
    // Personal
    photo: null,
    identity: '',
    address: '',
    aadhaarNo: '',
    pan: '',
    maritalStatus: '',
    emergencyContact: {
      name: '',
      number: '',
      relationship: '',
    },

    // Family
    isOrphan: false,
    familyMembers: [],

    // Bank
    bankName: '',
    bankAccountNo: '',
    ifscCode: '',

    // Qualification
    lessThanPrimary: false,
    qualifications: [],

    // Profession
    isFresher: false,
    experiences: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    console.log('Form Data:', formData);
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const isCheckbox = type === 'checkbox';
    const val = isCheckbox ? checked : value;

    // Handle nested objects (e.g., emergencyContact.name)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: val
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: val
      }));
    }
  }, []);

  const handleNestedInputChange = useCallback((section, index, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: (Array.isArray(prevData[section]) ? prevData[section] : []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);


  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({ ...prevData, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAddItem = useCallback((section) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: [
        ...prevData[section],
        section === 'familyMembers'
          ? { name: '', dateOfBirth: '', relationship: '', gender: '', nominee: false, sharePercentage: 0 }
          : section === 'qualifications'
            ? { qualification: '', yearOfPassing: '', institution: '' }
            : { companyName: '', designation: '', fromDate: '', toDate: '' }
      ]
    }));
  }, []);

  const handleRemoveItem = useCallback((section, index) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: prevData[section].filter((_, i) => i !== index)
    }));
  }, []);

  const validateSection = useCallback(
    (section) => {
      const errors = {};
      if (section === 'org') {
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
      } else if (section === 'personal') {
        if (!formData.aadhaarNo) errors.aadhaarNo = 'Aadhaar No is required';
        if (!formData.pan) errors.pan = 'PAN is required';
      } else if (section === 'bank') {
        if (!formData.bankName) errors.bankName = 'Bank Name is required';
        if (!formData.bankAccountNo) errors.bankAccountNo = 'Bank Account No is required';
        if (!formData.ifscCode) errors.ifscCode = 'IFSC Code is required';
      }
      return errors;
    },
    [formData]
  );

  const handleSaveSection = useCallback((section) => {
    const errors = validateSection(section);
    if (Object.keys(errors).length === 0) {
      console.log(`Saving ${section} section:`, formData);
      onSave(formData);
    } else {
      setFormErrors(errors);
    }
  }, [formData, onSave, validateSection]);

  const handleDocumentUpload = useCallback((documentData) => {
    const existingDocIndex = uploadedDocuments.findIndex(doc => doc.documentName === documentData.documentName);
    if (existingDocIndex !== -1) {
      if (window.confirm(`A document of type "${documentData.documentName}" already exists. Do you want to replace it?`)) {
        const updatedDocuments = [...uploadedDocuments];
        updatedDocuments[existingDocIndex] = documentData;
        setUploadedDocuments(updatedDocuments);
      }
    } else {
      setUploadedDocuments(prev => [...prev, documentData]);
    }
  }, [uploadedDocuments]);

  // Render functions for each section
  const renderOrgDetails = () => (
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
        <FloatingSelect
          id="gender"
          label="Gender"
          value={formData.gender}
          onChange={(e) => handleInputChange({ target: { name: 'gender', value: e.target.value } })}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
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
        {/* <FloatingInput
          id="branch"
          label="Branch"
          value={formData.branch}
          onChange={handleInputChange}
          required
          error={formErrors.branch}
        /> */}
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
        {/* <FloatingInput
          id="designation"
          label="Designation"
          value={formData.designation}
          onChange={handleInputChange}
          required
          error={formErrors.designation}
        />
        <FloatingInput
          id="department"
          label="Department"
          value={formData.department}
          onChange={handleInputChange}
          required
          error={formErrors.department}
        />
        <FloatingInput
          id="subDepartment"
          label="Sub Department"
          value={formData.subDepartment}
          onChange={handleInputChange}
          error={formErrors.subDepartment}
        />
        <FloatingInput
          id="grade"
          label="Grade"
          value={formData.grade}
          onChange={handleInputChange}
          error={formErrors.grade}
        />
        <FloatingInput
          id="category"
          label="Category"
          value={formData.category}
          onChange={handleInputChange}
          error={formErrors.category}
        /> */}
        {/* <FloatingInput
          id="reportingManager"
          label="Reporting Manager"
          value={formData.reportingManager}
          onChange={handleInputChange}
          required
          error={formErrors.reportingManager}
        /> */}
        <FloatingInput
          id="dateOfJoin"
          label="Date of Join"
          type="date"
          value={formData.dateOfJoin}
          onChange={handleInputChange}
          required
          error={formErrors.dateOfJoin}
        />
        <FloatingSelect
          id="employeeType"
          label="Employee Type"
          value={formData.employeeType}
          onChange={(e) => handleInputChange({ target: { name: 'employeeType', value: e.target.value } })}
          options={[
            { value: 'full-time', label: 'Full-Time' },
            { value: 'part-time', label: 'Part-Time' },
            { value: 'contract', label: 'Contract' },
            { value: 'intern', label: 'Intern' },
          ]}
          required
          error={formErrors.employeeType}
        />

        {/* <FloatingSelect
          id="employmentStatus"
          label="Employment Status"
          value={formData.employmentStatus}
          // onChange={handleInputChange}
          onChange={(e) => handleInputChange({ target: { name: 'employmentStatus', value: e.target.value } })}

          // onChange={(e) => handleInputChange({ target: { name: 'bloodGroup', value: e.target.value } })}

          options={[
            { value: 'probation', label: 'Probation' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'resigned', label: 'Resigned' },
            { value: 'relieved', label: 'Relieved' },
            { value: 'terminated', label: 'Terminated' },
          ]}
          required
          error={formErrors.employmentStatus}
        /> */}
        <SearchableSelect
          id="employmentStatus"
          label="Employment Status"
          value={formData.employmentStatus}
          onChange={(e) => handleInputChange({ target: { name: 'employmentStatus', value: e.target.value } })}
          staticOptions={[
            { value: 'probation', label: 'Probation' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'resigned', label: 'Resigned' },
            { value: 'relieved', label: 'Relieved' },
            { value: 'terminated', label: 'Terminated' },
          ]}
          darkMode={darkMode}
          required
          error={formErrors.employmentStatus}
        />
        {formData.employmentStatus === 'confirmed' && (
          <div className="flex-1">
            <FloatingInput
              id="confirmationDate"
              label="Confirmation Date"
              type="date"
              value={formData.confirmationDate}
              onChange={handleInputChange}
              required
              error={formErrors.confirmationDate}
            />
          </div>
        )}
        {(formData.employmentStatus === 'resigned' || formData.employmentStatus === 'relieved') && (
          <>
            <div className="flex-1">
              <FloatingInput
                id="resignationDate"
                label="Date of Resignation"
                type="date"
                value={formData.resignationDate}
                onChange={handleInputChange}
                required
                error={formErrors.resignationDate}
              />
            </div>
            <div className="flex-1">
              <FloatingInput
                id="relievedDate"
                label="Date of Relieved"
                type="date"
                value={formData.relievedDate}
                onChange={handleInputChange}
                required
                error={formErrors.relievedDate}
              />
            </div>
            <div className="flex-1">
              <SearchableSelect
                id="reasonForResignation"
                label="Resignation Reason"
                value={formData.reason}
                onChange={handleInputChange}
                fetchOptions={reasonsService.getAllResignationReasons}
                darkMode={darkMode}
                required
                error={formErrors.category}
              />
            </div>
          </>
        )}
        {(formData.employmentStatus === 'terminated') && (
          <>
            <div className="flex-1">
              <FloatingInput
                id="relievedDate"
                label="Date of Relieved"
                type="date"
                value={formData.relievedDate}
                onChange={handleInputChange}
                required
                error={formErrors.relievedDate}
              />
            </div>
            <div className="flex-1">
              <SearchableSelect
                id="reasonForTermination"
                label="Termination Reason"
                value={formData.reason}
                onChange={handleInputChange}
                fetchOptions={reasonsService.getAllTerminationReasons}
                darkMode={darkMode}
                required
                error={formErrors.category}
              />
            </div>
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
        <FloatingSelect
          id="bloodGroup"
          label="Blood Group"
          value={formData.bloodGroup}
          onChange={(e) => handleInputChange({ target: { name: 'bloodGroup', value: e.target.value } })}
          options={[
            { value: 'N/A', label: 'N/A' },
            { value: 'A+', label: 'A+' },
            { value: 'A-', label: 'A-' },
            { value: 'B+', label: 'B+' },
            { value: 'B-', label: 'B-' },
            { value: 'AB+', label: 'AB+' },
            { value: 'AB-', label: 'AB-' },
            { value: 'O+', label: 'O+' },
            { value: 'O-', label: 'O-' },
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
          <label htmlFor="inviteSent" className="text-sm font-medium text-gray-700">Send Invite</label>
        </div>
      </div>
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
          {formData.photo ? (
            <img src={formData.photo} alt="Employee" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
          )}
        </div>
        <div>
          <label htmlFor="photo-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <Upload className="inline-block mr-2" size={16} />
            Upload Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Present Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FloatingInput
            id="address"
            label="Address"
            value={formData.address || ''}
            onChange={handleInputChange}
            error={formErrors.address}
          />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Present Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FloatingInput
            id="address"
            label="Address"
            value={formData.address || ''}
            onChange={handleInputChange}
            error={formErrors.address}
          />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Emergency Contact</h3>
        {/* In renderPersonalDetails() */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FloatingInput
            id="emergencyContactName"
            label="Name"
            name="emergencyContact.name"
            value={formData.emergencyContact?.name || ''}
            onChange={handleInputChange}
            error={formErrors.emergencyContact?.name}
          />
          <FloatingInput
            id="emergencyContactNumber"
            label="Number"
            name="emergencyContact.number"
            value={formData.emergencyContact?.number || ''}
            onChange={handleInputChange}
            error={formErrors.emergencyContact?.number}
          />
          <FloatingInput
            id="emergencyContactRelationship"
            label="Relationship"
            name="emergencyContact.relationship"
            value={formData.emergencyContact?.relationship || ''}
            onChange={handleInputChange}
            error={formErrors.emergencyContact?.relationship}
          />
        </div>
        {/* Add a dummy field to maintain grid layout for 4 columns */}
        <div></div>

      </div>
    </div>
  );


  const renderFamilyDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isOrphan"
            checked={formData.isOrphan}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="text-sm font-medium text-gray-700">Orphan</span>
        </label>
      </div>
      {!formData.isOrphan && (
        <div>
          {formData.familyMembers && formData.familyMembers.length === 0 && (
            <p className="text-red-500 text-sm">At least one family member (Father, Mother, Spouse, or Child) is required if not orphan.</p>
          )}
          {formData.familyMembers && formData.familyMembers.map((member, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <FloatingInput
                  id={`familyName-${index}`}
                  label="Name"
                  value={member.name}
                  onChange={(e) => handleNestedInputChange('familyMembers', index, 'name', e.target.value)}
                  required
                  error={formErrors.familyMembers?.[index]?.name}
                />
                <FloatingInput
                  id={`familyDOB-${index}`}
                  label="Date of Birth"
                  type="date"
                  value={member.dateOfBirth}
                  onChange={(e) => handleNestedInputChange('familyMembers', index, 'dateOfBirth', e.target.value)}
                  required
                  error={formErrors.familyMembers?.[index]?.dateOfBirth}
                />
                <FloatingSelect
                  id={`familyRelationship-${index}`}
                  label="Relationship"
                  value={member.relationship}
                  onChange={(e) => handleNestedInputChange('familyMembers', index, 'relationship', e.target.value)}
                  options={[
                    { value: 'Father', label: 'Father' },
                    { value: 'Mother', label: 'Mother' },
                    { value: 'Spouse', label: 'Spouse' },
                    { value: 'Child', label: 'Child' },
                  ]}
                  required
                  error={formErrors.familyMembers?.[index]?.relationship}
                />
                <FloatingSelect
                  id={`familyGender-${index}`}
                  label="Gender"
                  value={member.gender}
                  onChange={(e) => handleNestedInputChange('familyMembers', index, 'gender', e.target.value)}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  required
                  error={formErrors.familyMembers?.[index]?.gender}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`familyNominee-${index}`}
                    checked={member.nominee}
                    onChange={(e) => handleNestedInputChange('familyMembers', index, 'nominee', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <label htmlFor={`familyNominee-${index}`} className="text-sm font-medium text-gray-700">
                    Nominee
                  </label>
                </div>
                {member.nominee && (
                  <FloatingInput
                    id={`familyShare-${index}`}
                    label="Share Percentage"
                    type="number"
                    value={member.sharePercentage}
                    onChange={(e) => handleNestedInputChange('familyMembers', index, 'sharePercentage', e.target.value)}
                    required
                    error={formErrors.familyMembers?.[index]?.sharePercentage}
                  />
                )}
              </div>
              <button
                onClick={() => handleRemoveItem('familyMembers', index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem('familyMembers')}
            className="m-2 text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="inline-block mr-1" size={16} /> Add Family Member
          </button>
        </div>
      )}
    </div>
  );

  const renderBankDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FloatingInput
          id="bankName"
          label="Bank Name"
          value={formData.bankName}
          onChange={handleInputChange}
          required
          error={formErrors.bankName}
        />
        <FloatingInput
          id="bankAccountNo"
          label="Bank Account No"
          value={formData.bankAccountNo}
          onChange={handleInputChange}
          required
          error={formErrors.bankAccountNo}
        />
        <FloatingInput
          id="ifscCode"
          label="IFSC Code"
          value={formData.ifscCode}
          onChange={handleInputChange}
          required
          error={formErrors.ifscCode}
        />
      </div>
    </div>
  );

  const renderQualificationDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="lessThanPrimary"
          name="lessThanPrimary"
          checked={formData.lessThanPrimary}
          onChange={handleInputChange}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <label htmlFor="lessThanPrimary" className="text-sm font-medium text-gray-700">
          Less than primary education
        </label>
      </div>
      {formData.qualifications && formData.qualifications.map((qualification, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FloatingSelect
              id={`qualification-${index}`}
              label="Qualification"
              value={qualification.qualification}
              onChange={(e) => handleNestedInputChange('qualifications', index, 'qualification', e.target.value)}
              options={[
                { value: '10th', label: '10th / Matriculation' },
                { value: '12th', label: '12th / Higher Secondary' },
                { value: 'diploma', label: 'Diploma' },
                { value: 'graduation', label: 'Graduation / Bachelor\'s Degree' },
                { value: 'postGraduation', label: 'Post Graduation / Master\'s Degree' },
                { value: 'doctorate', label: 'Doctorate / Ph.D.' },
                { value: 'professional', label: 'Professional Certification' },
                { value: 'others', label: 'Others' },
              ]}
              required
              error={formErrors.qualifications?.[index]?.qualification}
            />
            <FloatingInput
              id={`yearOfPassing-${index}`}
              label="Year of Passing"
              type="number"
              value={qualification.yearOfPassing}
              onChange={(e) => handleNestedInputChange('qualifications', index, 'yearOfPassing', e.target.value)}
              required
              error={formErrors.qualifications?.[index]?.yearOfPassing}
            />
            <FloatingInput
              id={`institution-${index}`}
              label="Name of the Institution"
              value={qualification.institution}
              onChange={(e) => handleNestedInputChange('qualifications', index, 'institution', e.target.value)}
              required
              error={formErrors.qualifications?.[index]?.institution}
            />
          </div>
          <button
            onClick={() => handleRemoveItem('qualifications', index)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => handleAddItem('qualifications')}
        className="m-2 text-blue-600 hover:text-blue-800"
      >
        <PlusCircle className="inline-block mr-1" size={16} /> Add Education
      </button>
    </div>
  );

  const renderProfessionalDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFresher"
            checked={formData.isFresher}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="text-sm font-medium text-gray-700">Fresher</span>
        </label>
      </div>
      {!formData.isFresher && (
        <div>
          {formData.experiences && formData.experiences.length === 0 && (
            <p className="text-red-500 text-sm">At least one experience is required if not a fresher.</p>
          )}
          {formData.experiences && formData.experiences.map((experience, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInput
                  id={`companyName-${index}`}
                  label="Previous Company Name"
                  value={experience.companyName}
                  onChange={(e) => handleNestedInputChange('experiences', index, 'companyName', e.target.value)}
                  required
                  error={formErrors.experiences?.[index]?.companyName}
                />
                <FloatingInput
                  id={`designation-${index}`}
                  label="Designation"
                  value={experience.designation}
                  onChange={(e) => handleNestedInputChange('experiences', index, 'designation', e.target.value)}
                  required
                  error={formErrors.experiences?.[index]?.designation}
                />
                <FloatingInput
                  id={`fromDate-${index}`}
                  label="From Date"
                  type="date"
                  value={experience.fromDate}
                  onChange={(e) => handleNestedInputChange('experiences', index, 'fromDate', e.target.value)}
                  required
                  error={formErrors.experiences?.[index]?.fromDate}
                />
                <FloatingInput
                  id={`toDate-${index}`}
                  label="To Date"
                  type="date"
                  value={experience.toDate}
                  onChange={(e) => handleNestedInputChange('experiences', index, 'toDate', e.target.value)}
                  required
                  error={formErrors.experiences?.[index]?.toDate}
                />
              </div>
              <button
                onClick={() => handleRemoveItem('experiences', index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem('experiences')}
            className="m-2 text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="inline-block mr-1" size={16} /> Add Experience
          </button>
        </div>
      )}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Proof Documents</h3>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="text-green-500 flex items-center hover:text-green-600 text-sm"
        >
          <FileUp className="mr-1" size={16} />
          Drop Files Here
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sr. No.</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Document Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">File Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Updated</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Comments</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {uploadedDocuments.map((doc, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm">{doc.documentName}</td>
                <td className="px-4 py-2 text-sm">{doc.fileName}</td>
                <td className="px-4 py-2 text-sm">
                  {format(new Date(doc.lastUpdated), 'dd-MMM-yyyy')}
                </td>
                <td className="px-4 py-2 text-sm">{doc.comment}</td>
                <td className="px-4 py-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Uploaded
                  </span>
                </td>
              </tr>
            ))}
            {uploadedDocuments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No documents uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`mx-auto max-w-8xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {formData.photo && (
        <div className="flex justify-end p-1">
          <img src={formData.photo} alt="Employee" className="w-32 h-32 rounded-full object-cover" />
        </div>
      )}
      <div className="flex border-b">
        {[
          { id: 'org', label: 'Org Details' },
          { id: 'personal', label: 'Personal' },
          { id: 'family', label: 'Family' },
          { id: 'bank', label: 'Bank' },
          { id: 'educational', label: 'Educational' },
          { id: 'professional', label: 'Profession' },
          { id: 'documents', label: 'Documents' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-6 ${activeTab === tab.id
              ? 'bg-gray-100 font-semibold border-b-2 border-blue-500'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeTab === 'org' && renderOrgDetails()}
        {activeTab === 'personal' && renderPersonalDetails()}
        {activeTab === 'family' && renderFamilyDetails()}
        {activeTab === 'bank' && renderBankDetails()}
        {activeTab === 'educational' && renderQualificationDetails()}
        {activeTab === 'professional' && renderProfessionalDetails()}
        {activeTab === 'documents' && renderDocuments()}
      </div>

      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={() => handleSaveSection(activeTab)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {employee ? 'Update Employee' : 'Create Employee'}
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>

      <ProofDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
}

const ProofDocumentModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedDocument, setSelectedDocument] = useState('');
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) { // 10MB limit
      setFile(selectedFile);
    } else {
      alert('File size should not exceed 10MB');
    }
  };

  const handleUpload = () => {
    if (selectedDocument && file) {
      onUpload({
        documentName: selectedDocument,
        fileName: file.name,
        size: file.size,
        lastUpdated: new Date().toISOString(),
        comment
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Document</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="">Select document type</option>
              <option value="Aadhaar">Aadhaar</option>
              <option value="PAN">PAN</option>
              <option value="PAN & Aadhaar Linked">Pan & Aadhaar Linked Proof</option>
              <option value="Bank Proof">Proof of Bank Account</option>
              <option value="Graduation Certificate">Educational Certificate's</option>
              <option value="Signed Appointment Letter">Signed Appointment Letter</option>
              <option value="Form-11 (EPF)">Form-11 (EPF)</option>
              <option value="Form-2 (ESI)">Form-2 (ESI)</option>
              <option value="Form-F (POGA)">Form-F (POGA)</option>
              <option value="Form-Q (S&E Act)">Form-Q (S&E Act)</option>
            </select>
            <label
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Select Document
            </label>
          </div>

          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              File
            </label>
          </div>

          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              rows="3"
            />
            <label
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Comment (Optional)
            </label>
          </div>

          <button
            onClick={handleUpload}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};
