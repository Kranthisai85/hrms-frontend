import React, { useState } from 'react';
import { FileUp, X, PlusCircle, Upload } from 'lucide-react';
import { format } from 'date-fns';

const FloatingInput = ({ id, label, value, onChange, type = 'text', required = false }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}{required && <span className="text-red-500">*</span>}
    </label>
  </div>
);

const FloatingSelect = ({ id, label, value, onChange, options, required = false }) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}{required && <span className="text-red-500">*</span>}
    </label>
  </div>
);

const FloatingTextArea = ({ id, label, value, onChange, required = false }) => (
  <div className="relative">
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      rows="3"
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
    ></textarea>
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}{required && <span className="text-red-500">*</span>}
    </label>
  </div>
);

export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState('org');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
const [formData, setFormData] = useState({
    employeeType: '',
    employeeStatus: '',

    // Org Details
    empCode: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    branch: '',
    designation: '',
    department: '',
    subDepartment: '',
    reportingManager: '',
    employeeType: '',
    employeeStatus: '',
    dateOfJoin: '',
    mobileNumber: '',
    personalEmail: '',
    officialEmail: '',
    bloodGroup: '',

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
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedInputChange = (section, index, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: prevData[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({ ...prevData, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (section) => {
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
  };

  const handleRemoveItem = (section, index) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: prevData[section].filter((_, i) => i !== index)
    }));
  };

  const handleSaveSection = (section) => {
    let isValid = true;
    let errorMessage = '';

    if (section === 'personal') {
      if (!formData.aadhaarNo || !formData.pan) {
        isValid = false;
        errorMessage = 'Aadhaar No and PAN are required.';
      }
    } else if (section === 'bank') {
      if (!formData.bankName || !formData.bankAccountNo || !formData.ifscCode) {
        isValid = false;
        errorMessage = 'All bank details are required.';
      }
    } else if (section === 'professional') {
      if (!formData.isFresher && formData.experiences.length === 0) {
        isValid = false;
        errorMessage = 'At least one experience is required if not a fresher.';
      }
    } else if (section === 'family') {
      if (!formData.isOrphan && formData.familyMembers.length === 0) {
        isValid = false;
        errorMessage = 'At least one family member is required if not orphan.';
      }
    } else if (section === 'documents') {
      if (uploadedDocuments.length === 0) {
        isValid = false;
        errorMessage = 'At least one document must be uploaded.';
      }
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    console.log(`Saving ${section} section:`, formData);
    // Implement the save logic here, e.g., API call to save the data
  };

  const handleDocumentUpload = (documentData) => {
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
  };

  const renderOrgDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FloatingInput
          id="empCode"
          label="Employee Code"
          value={formData.empCode}
          onChange={(e) => handleInputChange({ target: { name: 'empCode', value: e.target.value } })}
          required
        />
        <FloatingInput
          id="name"
          label="Name"
          value={formData.name}
          onChange={(e) => handleInputChange({ target: { name: 'name', value: e.target.value } })}
          required
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
          onChange={(e) => handleInputChange({ target: { name: 'dateOfBirth', value: e.target.value } })}
          required
        />
        <FloatingSelect
          id="branch"
          label="Branch"
          value={formData.branch}
          onChange={(e) => handleInputChange({ target: { name: 'branch', value: e.target.value } })}
          options={[
            { value: 'branch1', label: 'Branch 1' },
            { value: 'branch2', label: 'Branch 2' },
            // Add more branch options as needed
          ]}
          required
        />
        <FloatingSelect
          id="designation"
          label="Designation"
          value={formData.designation}
          onChange={(e) => handleInputChange({ target: { name: 'designation', value: e.target.value } })}
          options={[
            { value: 'manager', label: 'Manager' },
            { value: 'developer', label: 'Developer' },
            // Add more designation options as needed
          ]}
          required
        />
        <FloatingSelect
          id="department"
          label="Department"
          value={formData.department}
          onChange={(e) => handleInputChange({ target: { name: 'department', value: e.target.value } })}
          options={[
            { value: 'it', label: 'IT' },
            { value: 'hr', label: 'HR' },
            // Add more department options as needed
          ]}
          required
        />
        <FloatingSelect
          id="subDepartment"
          label="Sub Department"
          value={formData.subDepartment}
          onChange={(e) => handleInputChange({ target: { name: 'subDepartment', value: e.target.value } })}
          options={[
            { value: 'subDept1', label: 'Sub Department 1' },
            { value: 'subDept2', label: 'Sub Department 2' },
            // Add more sub-department options as needed
          ]}
        />
        <FloatingInput
          id="reportingManager"
          label="Reporting Manager"
          value={formData.reportingManager}
          onChange={(e) => handleInputChange({ target: { name: 'reportingManager', value: e.target.value } })}
          required
        />
        <FloatingSelect
          id="employeeType"
          label="Employee Type"
          value={formData.employeeType}
          onChange={(e) => handleInputChange({ target: { name: 'employeeType', value: e.target.value } })}
          options={[
            { value: 'fullTime', label: 'Full Time' },
            { value: 'partTime', label: 'Part Time' },
            { value: 'contract', label: 'Contract' },
          ]}
          required
        />
        <FloatingSelect
          id="employeeStatus"
          label="Employee Status"
          value={formData.employeeStatus}
          onChange={(e) => handleInputChange({ target: { name: 'employeeStatus', value: e.target.value } })}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'onLeave', label: 'On Leave' },
          ]}
          required
        />
        <FloatingInput
          id="dateOfJoin"
          label="Date of Join"
          type="date"
          value={formData.dateOfJoin}
          onChange={(e) => handleInputChange({ target: { name: 'dateOfJoin', value: e.target.value } })}
          required
        />
        <FloatingInput
          id="mobileNumber"
          label="Mobile Number"
          type="tel"
          value={formData.mobileNumber}
          onChange={(e) => handleInputChange({ target: { name: 'mobileNumber', value: e.target.value } })}
          required
        />
        <FloatingInput
          id="personalEmail"
          label="Personal Email"
          type="email"
          value={formData.personalEmail}
          onChange={(e) => handleInputChange({ target: { name: 'personalEmail', value: e.target.value } })}
          required
        />
        <FloatingInput
          id="officialEmail"
          label="Official Email"
          type="email"
          value={formData.officialEmail}
          onChange={(e) => handleInputChange({ target: { name: 'officialEmail', value: e.target.value } })}
          required
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
      </div>
      <button
        onClick={() => handleSaveSection('org')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Organization Details
      </button>
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
          <label htmlFor="photo-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" required>
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
      <h3 className="font-semibold text-lg">Identity Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FloatingInput
          id="aadhaarNo"
          label="Aadhaar No"
          value={formData.aadhaarNo}
          onChange={(e) => handleInputChange({ target: { name: 'aadhaarNo', value: e.target.value } })}
          required
        />
        <FloatingInput
          id="pan"
          label="PAN"
          value={formData.pan}
          onChange={(e) => handleInputChange({ target: { name: 'pan', value: e.target.value } })}
          required
        />
        
        <FloatingSelect
          id="maritalStatus"
          label="Marital Status"
          value={formData.maritalStatus}
          onChange={(e) => handleInputChange({ target: { name: 'maritalStatus', value: e.target.value } })}
          options={[
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married' },
            { value: 'divorced', label: 'Divorced' },
            { value: 'widowed', label: 'Widowed' },
          ]}
          required
        />
        <FloatingInput
          id="address"
          label="Address"
          value={formData.address}
          onChange={(e) => handleInputChange({ target: { name: 'address', value: e.target.value } })}
          required
        />
      </div>
    </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FloatingInput
            id="emergencyName"
            label="Emergency Contact Name"
            value={formData.emergencyContact.name}
            onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
            required
          />
          <FloatingInput
            id="emergencyNumber"
            label="Emergency Contact Number"
            type="tel"
            value={formData.emergencyContact.number}
            onChange={(e) => handleNestedInputChange('emergencyContact', 'number', e.target.value)}
            required
          />
          <FloatingInput
            id="emergencyRelationship"
            label="Emergency Contact Relationship"
            value={formData.emergencyContact.relationship}
            onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
            required
          />
        </div>
      </div>
      <button
        onClick={() => handleSaveSection('personal')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Personal Details
      </button>
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
          {formData.familyMembers.length === 0 && (
            <p className="text-red-500 text-sm">At least one family member (Father, Mother, Spouse, or Child) is required if not orphan.</p>
          )}
          {formData.familyMembers.map((member, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <FloatingInput
                  id={`familyName-${index}`}
                  label="Name"
                  value={member.name}
                  onChange={(e) => handleNestedInputChange('familyMembers', index, 'name', e.target.value)}
                  required
                />
                <FloatingInput
                  id={`familyDOB-${index}`}
                  label="Date of Birth"
                  type="date"
                  value={member.dateOfBirth}
                  onChange={(e) => handleNestedInputChange('familyMembers', index, 'dateOfBirth', e.target.value)}
                  required
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
            <PlusCircle className="inline-block " size={16} /> Add Family Member
          </button>
        </div>
      )}
      <button
        onClick={() => handleSaveSection('family')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Family Details
      </button>
    </div>
  );

  const renderBankDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FloatingInput
          id="bankName"
          label="Bank Name"
          value={formData.bankName}
          onChange={(e) => handleInputChange({ target: { name: 'bankName', value: e.target.value } })}
          required
        />
        <FloatingInput
          id="bankAccountNo"
          label="Bank Account No"
          value={formData.bankAccountNo}
          onChange={(e) => handleInputChange({ target: { name: 'bankAccountNo', value: e.target.value } })}
          required
        />
        <FloatingInput
          id="ifscCode"
          label="IFSC Code"
          value={formData.ifscCode}
          onChange={(e) => handleInputChange({ target: { name: 'ifscCode', value: e.target.value } })}
          required
        />
      </div>
      <button
        onClick={() => handleSaveSection('bank')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Bank Details
      </button>
    </div>
  );

  const renderQualificationDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="lessThanPrimary"
          checked={formData.lessThanPrimary}
          onChange={(e) => handleInputChange({ target: { name: 'lessThanPrimary', value: e.target.checked } })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <label htmlFor="lessThanPrimary" className="text-sm font-medium text-gray-700">
          Less than primary education
        </label>
      </div>
      {formData.qualifications.map((qualification, index) => (
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
            />
            <FloatingInput
              id={`yearOfPassing-${index}`}
              label="Year of Passing"
              type="number"
              value={qualification.yearOfPassing}
              onChange={(e) => handleNestedInputChange('qualifications', index, 'yearOfPassing', e.target.value)}
              required
            />
            <FloatingInput
              id={`institution-${index}`}
              label="Name of the Institution"
              value={qualification.institution}
              onChange={(e) => handleNestedInputChange('qualifications', index, 'institution', e.target.value)}
              required
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
      <button
        onClick={() => handleSaveSection('qualification')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Educational Details
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
          {formData.experiences.length === 0 && (
            <p className="text-red-500 text-sm">At least one experience is required if not a fresher.</p>
          )}
          {formData.experiences.map((experience, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInput
                  id={`companyName-${index}`}
                  label="Previous Company Name"
                  value={experience.companyName}
                  onChange={(e) => handleNestedInputChange('experiences', index, 'companyName', e.target.value)}
                  required
                />
                <FloatingInput
                  id={`designation-${index}`}
                  label="Designation"
                  value={experience.designation}
                  onChange={(e) => handleNestedInputChange('experiences', index, 'designation', e.target.value)}
                  required
                />
                <FloatingInput
                  id={`fromDate-${index}`}
                  label="From Date"
                  type="date"
                  value={experience.fromDate}
                  onChange={(e) => handleNestedInputChange('experiences', index, 'fromDate', e.target.value)}
                  required
                />
                <FloatingInput
                  id={`toDate-${index}`}
                  label="To Date"
                  type="date"
                  value={experience.toDate}
                  onChange={(e) => handleNestedInputChange('experiences', index, 'toDate', e.target.value)}
                  required
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
      <button
        onClick={() => handleSaveSection('professional')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Professional Details
      </button>
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

      <button
        onClick={() => handleSaveSection('documents')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Documents
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-8xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
              className={`py-2 px-6 ${
                activeTab === tab.id
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
            <p className="text-xs text-gray-500 mt-1">Max limit for each file is 10 MB</p>
          </div>

          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              rows="2"
              placeholder=" "
            ></textarea>
            <label
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Comment
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};
