import { PlusCircle } from 'lucide-react';
import { useCallback } from 'react';
import FloatingInput from '../FloatingInput.jsx';
import SearchableSelect from '../SearchableSelect.jsx';

export function QualificationDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // Ensure qualifications is always an array
    const formData = {
        ...employeeData,
        qualifications: employeeData.qualifications || []
    };
    // (You can add validation logic here if needed)

    const handleInputChange = useCallback((e) => {
        const { name, checked } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: checked }));
    }, [setEmployeeData]);

    const handleNestedInputChange = useCallback((index, field, value) => {
        setEmployeeData(prev => ({
            ...prev,
            qualifications: prev.qualifications.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    }, [setEmployeeData]);

    const handleAddItem = useCallback(() => {
        setEmployeeData(prev => ({
            ...prev,
            qualifications: [
                ...(prev.qualifications || []),
                { qualification: '', yearOfPassing: '', institution: '' },
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
        // Only send qualification section fields
        const sectionData = {
            lessThanPrimary: formData.lessThanPrimary,
            qualifications: formData.qualifications,
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
            {formData.qualifications.map((qualification, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <SearchableSelect
                            id={`qualification-${index}`}
                            label="Qualification"
                            value={qualification.qualification}
                            onChange={(e) => handleNestedInputChange(index, 'qualification', e.target.value)}
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
                        />
                        <FloatingInput
                            id={`yearOfPassing-${index}`}
                            label="Year of Passing"
                            type="number"
                            value={qualification.yearOfPassing}
                            onChange={(e) => handleNestedInputChange(index, 'yearOfPassing', e.target.value)}
                            required
                        />
                        <FloatingInput
                            id={`institution-${index}`}
                            label="Name of the Institution"
                            value={qualification.institution}
                            onChange={(e) => handleNestedInputChange(index, 'institution', e.target.value)}
                            required
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