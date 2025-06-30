import { PlusCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import FloatingInput from '../FloatingInput.jsx';

export function ProfessionalDetailsForm({ employee, onSave, onCancel }) {
    const initialFormData = {
        isFresher: employee?.isFresher || false,
        experiences: employee?.experiences || [],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = useCallback((e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    }, []);

    const handleNestedInputChange = useCallback((index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            experiences: prev.experiences.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    }, []);

    const handleAddItem = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            experiences: [
                ...prev.experiences,
                { companyName: '', designation: '', fromDate: '', toDate: '' },
            ],
        }));
    }, []);

    const handleRemoveItem = useCallback((index) => {
        setFormData((prev) => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index),
        }));
    }, []);

    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.isFresher && formData.experiences.length === 0) {
            errors.experiences = 'At least one experience is required if not a fresher.';
        }
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
                                    error={formErrors.experiences?.[index]?.companyName}
                                />
                                <FloatingInput
                                    id={`designation-${index}`}
                                    label="Designation"
                                    value={experience.designation}
                                    onChange={(e) => handleNestedInputChange(index, 'designation', e.target.value)}
                                    required
                                    error={formErrors.experiences?.[index]?.designation}
                                />
                                <FloatingInput
                                    id={`fromDate-${index}`}
                                    label="From Date"
                                    type="date"
                                    value={experience.fromDate}
                                    onChange={(e) => handleNestedInputChange(index, 'fromDate', e.target.value)}
                                    required
                                    error={formErrors.experiences?.[index]?.fromDate}
                                />
                                <FloatingInput
                                    id={`toDate-${index}`}
                                    label="To Date"
                                    type="date"
                                    value={experience.toDate}
                                    onChange={(e) => handleNestedInputChange(index, 'toDate', e.target.value)}
                                    required
                                    error={formErrors.experiences?.[index]?.toDate}
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
                >
                    {employee ? 'Update' : 'Save'}
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}