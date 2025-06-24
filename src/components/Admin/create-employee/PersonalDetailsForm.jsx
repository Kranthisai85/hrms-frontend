import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import FloatingInput from '../FloatingInput.jsx';

export function PersonalDetailsForm({ employee, onSave }) {
    const initialFormData = {
        photo: employee?.photo || null,
        address: employee?.address || '',

        emergencyContact: {
            name: employee?.emergencyContact?.name || '',
            number: employee?.emergencyContact?.number || '',
            relationship: employee?.emergencyContact?.relationship || '',
        },
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }, []);

    const handlePhotoUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.aadhaarNo) errors.aadhaarNo = 'Aadhaar No is required';
        if (!formData.pan) errors.pan = 'PAN is required';
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
                        error={formErrors.presentHouseNumber}
                    // darkMode={darkMode}
                    />
                    <FloatingInput
                        id="presentCity"
                        label="City"
                        value={formData.presentCity || ''}
                        onChange={handleInputChange}
                        error={formErrors.presentCity}
                    // darkMode={darkMode}
                    />
                    <FloatingInput
                        id="presentState"
                        label="State"
                        value={formData.presentState || ''}
                        onChange={handleInputChange}
                        error={formErrors.presentState}
                    // darkMode={darkMode}
                    />
                    <FloatingInput
                        id="presentPincode"
                        label="Pincode"
                        value={formData.presentPincode || ''}
                        onChange={handleInputChange}
                        error={formErrors.presentPincode}
                        type="text" // Using text to allow flexibility, can change to 'number' if only digits are needed
                    // darkMode={darkMode}
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
                        error={formErrors.permanentHouseNumber}
                    // darkMode={darkMode}
                    />
                    <FloatingInput
                        id="permanentCity"
                        label="City"
                        value={formData.permanentCity || ''}
                        onChange={handleInputChange}
                        error={formErrors.permanentCity}
                    // darkMode={darkMode}
                    />
                    <FloatingInput
                        id="permanentState"
                        label="State"
                        value={formData.permanentState || ''}
                        onChange={handleInputChange}
                        error={formErrors.permanentState}
                    // darkMode={darkMode}
                    />
                    <FloatingInput
                        id="permanentPincode"
                        label="Pincode"
                        value={formData.permanentPincode || ''}
                        onChange={handleInputChange}
                        error={formErrors.permanentPincode}
                        type="text" // Using text, can change to 'number' if needed
                    // darkMode={darkMode}
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
                        error={formErrors.emergencyContact?.name}
                    />
                    <FloatingInput
                        id="emergencyContactNumber"
                        label="Number"
                        name="emergencyContact.number"
                        value={formData.emergencyContact.number}
                        onChange={handleInputChange}
                        error={formErrors.emergencyContact?.number}
                    />
                    <FloatingInput
                        id="emergencyContactRelationship"
                        label="Relationship"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleInputChange}
                        error={formErrors.emergencyContact?.relationship}
                    />
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {employee ? 'Update' : 'Save'}
                </button>
            </div>
        </div>
    );
}