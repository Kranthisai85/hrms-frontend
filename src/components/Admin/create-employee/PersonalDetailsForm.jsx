import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import FloatingInput from '../FloatingInput.jsx';

export function PersonalDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // Ensure emergencyContact is always defined
    const formData = {
        ...employeeData,
        emergencyContact: employeeData.emergencyContact || { name: '', number: '', relationship: '' }
    };
    // (You can add validation logic here if needed)

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEmployeeData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setEmployeeData(prev => ({ ...prev, [name]: value }));
        }
    }, [setEmployeeData]);

    const handlePhotoUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEmployeeData(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    }, [setEmployeeData]);

    const handleSave = () => {
        // Only send personal and address fields
        const personalFields = [
            'photo', 'maritalStatus', 'emergencyContactName', 'emergencyContactNumber', 'emergencyContactRelationship',
            'address', 'city', 'state', 'country', 'pincode',
            'permanentAddress', 'permanentCity', 'permanentState', 'permanentCountry', 'permanentPincode'
        ];
        const sectionData = {};
        personalFields.forEach(f => { if (formData[f] !== undefined) sectionData[f] = formData[f]; });
        onSaveSection(sectionData);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                    {formData.photo ? (
                        <img src={formData.photo} alt="Employee" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Photo
                        </div>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="photo-upload"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
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
                        id="presentHouseNumber"
                        label="House Number/Street/Flat No"
                        value={formData.presentHouseNumber || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="presentCity"
                        label="City"
                        value={formData.presentCity || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="presentState"
                        label="State"
                        value={formData.presentState || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="presentPincode"
                        label="Pincode"
                        value={formData.presentPincode || ''}
                        onChange={handleInputChange}
                        type="text" // Using text to allow flexibility, can change to 'number' if only digits are needed
                    />
                </div>
            </div>

            {/* Permanent Address Section */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Permanent Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FloatingInput
                        id="permanentHouseNumber"
                        label="House Number/Street/Flat No"
                        value={formData.permanentHouseNumber || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="permanentCity"
                        label="City"
                        value={formData.permanentCity || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="permanentState"
                        label="State"
                        value={formData.permanentState || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="permanentPincode"
                        label="Pincode"
                        value={formData.permanentPincode || ''}
                        onChange={handleInputChange}
                        type="text" // Using text, can change to 'number' if needed
                    />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FloatingInput
                        id="emergencyContactName"
                        label="Name"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="emergencyContactNumber"
                        label="Number"
                        name="emergencyContact.number"
                        value={formData.emergencyContact.number}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="emergencyContactRelationship"
                        label="Relationship"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
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