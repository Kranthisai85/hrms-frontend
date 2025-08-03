import { PlusCircle } from 'lucide-react';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FloatingInput from '../FloatingInput.jsx';
import SearchableSelect from '../SearchableSelect.jsx';

export function FamilyDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // Ensure familyMembers is always an array
    const formData = {
        ...employeeData,
        familyMembers: employeeData.familyMembers || []
    };
    // (You can add validation logic here if needed)

    const handleInputChange = useCallback((e) => {
        const { name, checked } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [name]: checked,
            familyMembers: checked ? [] : prev.familyMembers,
        }));
    }, [setEmployeeData]);

    const handleNestedInputChange = useCallback((index, field, value) => {
        setEmployeeData(prev => ({
            ...prev,
            familyMembers: prev.familyMembers.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    }, [setEmployeeData]);

    const handleAddItem = useCallback(() => {
        setEmployeeData(prev => ({
            ...prev,
            familyMembers: [
                ...(prev.familyMembers || []),
                {
                    id: uuidv4(),
                    name: '',
                    dateOfBirth: '',
                    relationship: '',
                    gender: '',
                    phone: '',
                    nominee: false,
                    sharePercentage: 0,
                },
            ],
        }));
    }, [setEmployeeData]);

    const handleRemoveItem = useCallback((index) => {
        setEmployeeData(prev => ({
            ...prev,
            familyMembers: prev.familyMembers.filter((_, i) => i !== index),
        }));
    }, [setEmployeeData]);

    const handleSave = () => {
        // Only send family section fields
        const sectionData = {
            isOrphan: formData.isOrphan || false,
            familyMembers: (formData.familyMembers || []).map(({ id, ...rest }) => ({
                name: rest.name || '',
                dateOfBirth: rest.dateOfBirth || '',
                relationship: rest.relationship || '',
                gender: rest.gender || '',
                phone: rest.phone || '',
                nominee: rest.nominee || false,
                sharePercentage: rest.sharePercentage || 0,
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
                    {/* The original code had formErrors, but it's removed from the new_code.
                        Assuming the validation logic is now handled by onSaveSection or removed.
                        For now, we'll keep the structure but remove the error display. */}
                    {formData.familyMembers.map((member, index) => (
                        <div key={member.id} className="p-4 bg-gray-50 rounded-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                                <FloatingInput
                                    id={`familyName-${index}`}
                                    label="Name"
                                    value={member.name}
                                    onChange={(e) => handleNestedInputChange(index, 'name', e.target.value)}
                                    required
                                    // error={formErrors.familyMembers?.[index]?.name} // Removed as per new_code
                                />
                                <FloatingInput
                                    id={`familyDOB-${index}`}
                                    label="Date of Birth"
                                    type="date"
                                    value={member.dateOfBirth}
                                    onChange={(e) => handleNestedInputChange(index, 'dateOfBirth', e.target.value)}
                                    required
                                    // error={formErrors.familyMembers?.[index]?.dateOfBirth} // Removed as per new_code
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
                                    // error={formErrors.familyMembers?.[index]?.relationship} // Removed as per new_code
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
                                    // error={formErrors.familyMembers?.[index]?.gender} // Removed as per new_code
                                />
                                <FloatingInput
                                    id={`familyPhone-${index}`}
                                    label="Phone Number"
                                    value={member.phone}
                                    onChange={(e) => handleNestedInputChange(index, 'phone', e.target.value)}
                                    // error={formErrors.familyMembers?.[index]?.phone} // Removed as per new_code
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
                                        // error={formErrors.familyMembers?.[index]?.sharePercentage} // Removed as per new_code
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