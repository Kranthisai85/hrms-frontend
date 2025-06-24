import { PlusCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique keys
import FloatingInput from '../FloatingInput.jsx';
import SearchableSelect from '../SearchableSelect.jsx';

export function FamilyDetailsForm({ employee, onSave, onCancel }) {
    // Initialize form data with employee data or defaults
    const initialFormData = {
        isOrphan: employee?.isOrphan || false,
        familyMembers: employee?.familyMembers?.map((member) => ({
            ...member,
            id: member.id || uuidv4(), // Ensure each family member has a unique ID
        })) || [],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    // Handle checkbox changes (e.g., isOrphan)
    const handleInputChange = useCallback((e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
            // Clear family members if isOrphan is checked
            familyMembers: checked ? [] : prev.familyMembers,
        }));
        // Clear errors when isOrphan changes
        setFormErrors({});
    }, []);

    // Handle changes to nested family member fields
    const handleNestedInputChange = useCallback((index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            familyMembers: prev.familyMembers.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    }, []);

    // Add a new family member with a unique ID
    const handleAddItem = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            familyMembers: [
                ...prev.familyMembers,
                {
                    id: uuidv4(),
                    name: '',
                    dateOfBirth: '',
                    relationship: '',
                    gender: '',
                    nominee: false,
                    sharePercentage: 0,
                },
            ],
        }));
    }, []);

    // Remove a family member by index
    const handleRemoveItem = useCallback((index) => {
        setFormData((prev) => ({
            ...prev,
            familyMembers: prev.familyMembers.filter((_, i) => i !== index),
        }));
        // Clear errors for the removed member
        setFormErrors((prev) => {
            const newErrors = { ...prev };
            if (newErrors.familyMembers) {
                newErrors.familyMembers = newErrors.familyMembers.filter((_, i) => i !== index);
            }
            return newErrors;
        });
    }, []);

    // Validate form data
    const validateForm = useCallback(() => {
        const errors = { familyMembers: [] };
        if (!formData.isOrphan && formData.familyMembers.length === 0) {
            errors.familyMembersGeneral = 'At least one family member (Father, Mother, Spouse, or Child) is required if not orphan.';
        }

        // Validate each family member
        formData.familyMembers.forEach((member, index) => {
            const memberErrors = {};
            if (!member.name) memberErrors.name = 'Name is required';
            if (!member.dateOfBirth) memberErrors.dateOfBirth = 'Date of Birth is required';
            if (!member.relationship) memberErrors.relationship = 'Relationship is required';
            if (!member.gender) memberErrors.gender = 'Gender is required';
            if (member.nominee && !member.sharePercentage) {
                memberErrors.sharePercentage = 'Share Percentage is required for nominees';
            }
            if (Object.keys(memberErrors).length > 0) {
                errors.familyMembers[index] = memberErrors;
            }
        });

        // Return empty object if no errors
        return Object.keys(errors.familyMembers).length > 0 || errors.familyMembersGeneral
            ? errors
            : {};
    }, [formData]);

    // Handle form submission
    const handleSave = () => {
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            // Remove temporary IDs before saving
            const cleanedFormData = {
                ...formData,
                familyMembers: formData.familyMembers.map(({ id, ...rest }) => rest),
            };
            onSave(cleanedFormData);
            setFormErrors({});
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
                    {formErrors.familyMembersGeneral && (
                        <p className="text-red-500 text-sm">{formErrors.familyMembersGeneral}</p>
                    )}
                    {formData.familyMembers.map((member, index) => (
                        <div key={member.id} className="p-4 bg-gray-50 rounded-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                <FloatingInput
                                    id={`familyName-${index}`}
                                    label="Name"
                                    value={member.name}
                                    onChange={(e) => handleNestedInputChange(index, 'name', e.target.value)}
                                    required
                                    error={formErrors.familyMembers?.[index]?.name}
                                />
                                <FloatingInput
                                    id={`familyDOB-${index}`}
                                    label="Date of Birth"
                                    type="date"
                                    value={member.dateOfBirth}
                                    onChange={(e) => handleNestedInputChange(index, 'dateOfBirth', e.target.value)}
                                    required
                                    error={formErrors.familyMembers?.[index]?.dateOfBirth}
                                />
                                <SearchableSelect
                                    id={`familyRelationship-${index}`}
                                    label="Relationship"
                                    value={member.relationship}
                                    onChange={(e) => handleNestedInputChange(index, 'relationship', e.target.value)}
                                    staticOptions={[
                                        { value: 'Father', label: 'Father' },
                                        { value: 'Mother', label: 'Mother' },
                                        { value: 'Spouse', label: 'Spouse' },
                                        { value: 'Child', label: 'Child' },
                                    ]}
                                    required
                                    error={formErrors.familyMembers?.[index]?.relationship}
                                />
                                <SearchableSelect
                                    id={`familyGender-${index}`}
                                    label="Gender"
                                    value={member.gender}
                                    onChange={(e) => handleNestedInputChange(index, 'gender', e.target.value)}
                                    staticOptions={[
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
                                        onChange={(e) => handleNestedInputChange(index, 'nominee', e.target.checked)}
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
                                        onChange={(e) => handleNestedInputChange(index, 'sharePercentage', e.target.value)}
                                        required
                                        error={formErrors.familyMembers?.[index]?.sharePercentage}
                                    />
                                )}
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
                        <PlusCircle className="inline-block mr-1" size={16} /> Add Family Member
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