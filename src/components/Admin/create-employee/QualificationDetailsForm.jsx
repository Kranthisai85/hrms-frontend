import { PlusCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import FloatingInput from '../FloatingInput.jsx';
import SearchableSelect from '../SearchableSelect.jsx';

export function QualificationDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // Ensure qualifications is always an array
    const formData = {
        ...employeeData,
        qualifications: employeeData.qualifications || []
    };
    
    // State for year validation errors
    const [yearErrors, setYearErrors] = useState({});
    // State for education validation errors
    const [educationErrors, setEducationErrors] = useState({
        educationStatus: '',
        qualifications: []
    });

    const handleInputChange = useCallback((e) => {
        const { name, checked } = e.target;
        setEmployeeData(prev => ({ 
            ...prev, 
            [name]: checked,
            qualifications: checked ? [] : prev.qualifications,
        }));
    }, [setEmployeeData]);

    const handleNestedInputChange = useCallback((index, field, value) => {
        // Special validation for year of passing
        if (field === 'yearOfPassing') {
            // Validate 4-digit numeric year
            if (value && !/^\d{4}$/.test(value)) {
                setYearErrors(prev => ({
                    ...prev,
                    [index]: 'Year must be exactly 4 digits (e.g., 2023)'
                }));
            } else {
                setYearErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[index];
                    return newErrors;
                });
            }
        }
        
        setEmployeeData(prev => ({
            ...prev,
            qualifications: prev.qualifications.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    }, [setEmployeeData]);

    // Validation function to check if qualification data is complete
    const validateQualification = (qualification) => {
        const errors = {};
        if (!qualification.degree || qualification.degree.trim() === '') {
            errors.degree = 'Degree is required';
        }
        if (!qualification.yearOfPassing) {
            errors.yearOfPassing = 'Year of passing is required';
        }
        if (!qualification.institution || qualification.institution.trim() === '') {
            errors.institution = 'Institution is required';
        }
        return errors;
    };

    // Validation function to check overall education validity
    const validateEducation = () => {
        const errors = {
            educationStatus: '',
            qualifications: []
        };

        // If not less than primary, must have at least one qualification with complete information
        if (!formData.lessThanPrimary) {
            if (!formData.qualifications || formData.qualifications.length === 0) {
                errors.educationStatus = 'Please either mark as less than primary education or add at least one qualification';
            } else {
                // Validate each qualification
                const qualificationErrors = formData.qualifications.map(qual => validateQualification(qual));
                errors.qualifications = qualificationErrors;
                
                // Check if at least one qualification has complete information
                const hasValidQualification = qualificationErrors.some(qualError => 
                    Object.keys(qualError).length === 0
                );
                
                if (!hasValidQualification) {
                    errors.educationStatus = 'Please provide complete information for at least one qualification';
                }
            }
        }

        setEducationErrors(errors);
        return Object.keys(errors.educationStatus).length === 0 && 
               errors.qualifications.every(qualError => Object.keys(qualError).length === 0);
    };

    const handleAddItem = useCallback(() => {
        setEmployeeData(prev => ({
            ...prev,
            qualifications: [
                ...(prev.qualifications || []),
                { 
                    degree: '', 
                    yearOfPassing: '', 
                    institution: '',
                    percentage: '',
                    specialization: ''
                },
            ],
        }));
    }, [setEmployeeData]);

    const handleRemoveItem = useCallback((index) => {
        setEmployeeData(prev => ({
            ...prev,
            qualifications: prev.qualifications.filter((_, i) => i !== index),
        }));
    }, [setEmployeeData]);

    const handleSave = () => {
        // Check if there are year validation errors
        if (Object.keys(yearErrors).length > 0) {
            return; // Don't save if there are validation errors
        }
        
        // Validate education requirements
        if (!validateEducation()) {
            return; // Don't save if education validation fails
        }
        
        // Only send qualification section fields
        const sectionData = {
            lessThanPrimary: formData.lessThanPrimary || false,
            qualifications: (formData.qualifications || []).map(qual => ({
                degree: qual.degree || '',
                yearOfPassing: qual.yearOfPassing || '',
                institution: qual.institution || '',
                percentage: qual.percentage || '',
                specialization: qual.specialization || '',
                user_id: employeeData.userId || employeeData.user?.id // Add user_id as required by backend
            })),
        };
        onSaveSection(sectionData);
    };

    return (
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
            {educationErrors.educationStatus && (
                <div className="text-red-500 text-sm mt-1">{educationErrors.educationStatus}</div>
            )}
            {formData.qualifications.map((qualification, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <SearchableSelect
                            id={`degree-${index}`}
                            label="Degree"
                            value={qualification.degree}
                            onChange={(e) => handleNestedInputChange(index, 'degree', e.target.value)}
                            staticOptions={[
                                { value: '10th', label: '10th / Matriculation' },
                                { value: '12th', label: '12th / Higher Secondary' },
                                { value: 'diploma', label: 'Diploma' },
                                { value: 'graduation', label: "Graduation / Bachelor's Degree" },
                                { value: 'postGraduation', label: "Post Graduation / Master's Degree" },
                                { value: 'doctorate', label: 'Doctorate / Ph.D.' },
                                { value: 'professional', label: 'Professional Certification' },
                                { value: 'others', label: 'Others' },
                            ]}
                            required
                            error={educationErrors.qualifications[index]?.degree}
                        />
                        <FloatingInput
                            id={`yearOfPassing-${index}`}
                            label="Year of Completion"
                            type="number"
                            value={qualification.yearOfPassing}
                            onChange={(e) => handleNestedInputChange(index, 'yearOfPassing', e.target.value)}
                            required
                            error={yearErrors[index] || educationErrors.qualifications[index]?.yearOfPassing}
                            maxLength={4}
                            placeholder="e.g., 2023"
                        />
                        <FloatingInput
                            id={`institution-${index}`}
                            label="Name of the Institution"
                            value={qualification.institution}
                            onChange={(e) => handleNestedInputChange(index, 'institution', e.target.value)}
                            required
                            error={educationErrors.qualifications[index]?.institution}
                        />
                        <FloatingInput
                            id={`percentage-${index}`}
                            label="Percentage"
                            type="number"
                            value={qualification.percentage}
                            onChange={(e) => handleNestedInputChange(index, 'percentage', e.target.value)}
                        />
                        <FloatingInput
                            id={`specialization-${index}`}
                            label="Specialization"
                            value={qualification.specialization}
                            onChange={(e) => handleNestedInputChange(index, 'specialization', e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleRemoveItem(index)}
                        className="mt-2 text-red-600 hover:text-red-800"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                onClick={handleAddItem}
                className="m-2 text-blue-600 hover:text-blue-800"
            >
                <PlusCircle className="inline-block mr-1" size={16} /> Add Education
            </button>
            <div className="mt-6 flex justify-end space-x-2">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={loading}
                >
                    {employeeData.id ? 'Update' : 'Save'}
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