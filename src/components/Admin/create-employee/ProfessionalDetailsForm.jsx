import { PlusCircle } from 'lucide-react';
import { useCallback } from 'react';
import FloatingInput from '../FloatingInput.jsx';

export function ProfessionalDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // Ensure experiences is always an array
    const formData = {
        ...employeeData,
        experiences: employeeData.experiences || []
    };
    // (You can add validation logic here if needed)

    const handleInputChange = useCallback((e) => {
        const { name, checked } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: checked }));
    }, [setEmployeeData]);

    const handleNestedInputChange = useCallback((index, field, value) => {
        setEmployeeData(prev => ({
            ...prev,
            experiences: prev.experiences.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    }, [setEmployeeData]);

    const handleAddItem = useCallback(() => {
        setEmployeeData(prev => ({
            ...prev,
            experiences: [
                ...(prev.experiences || []),
                { companyName: '', designation: '', fromDate: '', toDate: '' },
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
        // Only send professional section fields
        const sectionData = {
            isFresher: formData.isFresher,
            experiences: formData.experiences,
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
            </div>
            {!formData.isFresher && (
                <div>
                    {formData.experiences.length === 0 && (
                        <p className="text-red-500 text-sm">
                            At least one experience is required if not a fresher.
                        </p>
                    )}
                    {formData.experiences.map((experience, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <FloatingInput
                                    id={`companyName-${index}`}
                                    label="Previous Company Name"
                                    value={experience.companyName}
                                    onChange={(e) => handleNestedInputChange(index, 'companyName', e.target.value)}
                                    required
                                />
                                <FloatingInput
                                    id={`designation-${index}`}
                                    label="Designation"
                                    value={experience.designation}
                                    onChange={(e) => handleNestedInputChange(index, 'designation', e.target.value)}
                                    required
                                />
                                <FloatingInput
                                    id={`fromDate-${index}`}
                                    label="From Date"
                                    type="date"
                                    value={experience.fromDate}
                                    onChange={(e) => handleNestedInputChange(index, 'fromDate', e.target.value)}
                                    required
                                />
                                <FloatingInput
                                    id={`toDate-${index}`}
                                    label="To Date"
                                    type="date"
                                    value={experience.toDate}
                                    onChange={(e) => handleNestedInputChange(index, 'toDate', e.target.value)}
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