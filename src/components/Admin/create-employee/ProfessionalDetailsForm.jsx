import { PlusCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import FloatingInput from '../FloatingInput.jsx';

export function ProfessionalDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // Ensure experiences is always an array
    const formData = {
        ...employeeData,
        experiences: employeeData.experiences || []
    };
    
    // State for professional validation errors
    const [professionalErrors, setProfessionalErrors] = useState({
        fresherStatus: '',
        experiences: []
    });

    const handleInputChange = useCallback((e) => {
        const { name, checked } = e.target;
        setEmployeeData(prev => ({ 
            ...prev, 
            [name]: checked,
            experiences: checked ? [] : prev.experiences,
        }));
    }, [setEmployeeData]);

    const handleNestedInputChange = useCallback((index, field, value) => {
        setEmployeeData(prev => ({
            ...prev,
            experiences: prev.experiences.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    }, [setEmployeeData]);

    // Validation function to check if experience data is complete
    const validateExperience = (experience) => {
        const errors = {};
        if (!experience.company || experience.company.trim() === '') {
            errors.company = 'Company name is required';
        }
        if (!experience.position || experience.position.trim() === '') {
            errors.position = 'Position is required';
        }
        if (!experience.fromDate) {
            errors.fromDate = 'From date is required';
        }
        if (!experience.toDate) {
            errors.toDate = 'To date is required';
        }
        return errors;
    };

    // Validation function to check overall professional validity
    const validateProfessional = () => {
        const errors = {
            fresherStatus: '',
            experiences: []
        };

        // If not fresher, must have at least one experience with complete information
        if (!formData.isFresher) {
            if (!formData.experiences || formData.experiences.length === 0) {
                errors.fresherStatus = 'Please either mark as fresher or add at least one experience';
            } else {
                // Validate each experience
                const experienceErrors = formData.experiences.map(exp => validateExperience(exp));
                errors.experiences = experienceErrors;
                
                // Check if at least one experience has complete information
                const hasValidExperience = experienceErrors.some(expError => 
                    Object.keys(expError).length === 0
                );
                
                if (!hasValidExperience) {
                    errors.fresherStatus = 'Please provide complete information for at least one experience';
                }
            }
        }

        setProfessionalErrors(errors);
        return Object.keys(errors.fresherStatus).length === 0 && 
               errors.experiences.every(expError => Object.keys(expError).length === 0);
    };

    const handleAddItem = useCallback(() => {
        setEmployeeData(prev => ({
            ...prev,
            experiences: [
                ...(prev.experiences || []),
                { 
                    company: '', 
                    position: '', 
                    fromDate: '', 
                    toDate: '',
                    description: ''
                },
            ],
        }));
    }, [setEmployeeData]);

    const handleRemoveItem = useCallback((index) => {
        setEmployeeData(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index),
        }));
    }, [setEmployeeData]);

    const handleSave = () => {
        // Validate professional requirements
        if (!validateProfessional()) {
            return; // Don't save if professional validation fails
        }
        
        // Only send professional section fields
        const sectionData = {
            isFresher: formData.isFresher || false,
            experiences: (formData.experiences || []).map(exp => ({
                company: exp.company || '',
                position: exp.position || '',
                fromDate: exp.fromDate || '',
                toDate: exp.toDate || '',
                description: exp.description || '',
                user_id: employeeData.userId || employeeData.user?.id // Add user_id as required by backend
            })),
        };
        onSaveSection(sectionData);
    };

    return (
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
                {professionalErrors.fresherStatus && (
                    <div className="text-red-500 text-sm mt-1">{professionalErrors.fresherStatus}</div>
                )}
            </div>
            {!formData.isFresher && (
                <div>
                    {formData.experiences.map((experience, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <FloatingInput
                                    id={`company-${index}`}
                                    label="Previous Company Name"
                                    value={experience.company}
                                    onChange={(e) => handleNestedInputChange(index, 'company', e.target.value)}
                                    required
                                    error={professionalErrors.experiences[index]?.company}
                                />
                                <FloatingInput
                                    id={`position-${index}`}
                                    label="Position"
                                    value={experience.position}
                                    onChange={(e) => handleNestedInputChange(index, 'position', e.target.value)}
                                    required
                                    error={professionalErrors.experiences[index]?.position}
                                />
                                <FloatingInput
                                    id={`fromDate-${index}`}
                                    label="From Date"
                                    type="date"
                                    value={experience.fromDate}
                                    onChange={(e) => handleNestedInputChange(index, 'fromDate', e.target.value)}
                                    required
                                    error={professionalErrors.experiences[index]?.fromDate}
                                />
                                <FloatingInput
                                    id={`toDate-${index}`}
                                    label="To Date"
                                    type="date"
                                    value={experience.toDate}
                                    onChange={(e) => handleNestedInputChange(index, 'toDate', e.target.value)}
                                    required
                                    error={professionalErrors.experiences[index]?.toDate}
                                />
                                <FloatingInput
                                    id={`description-${index}`}
                                    label="Description"
                                    value={experience.description}
                                    onChange={(e) => handleNestedInputChange(index, 'description', e.target.value)}
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
                        <PlusCircle className="inline-block mr-1" size={16} /> Add Experience
                    </button>
                </div>
            )}
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