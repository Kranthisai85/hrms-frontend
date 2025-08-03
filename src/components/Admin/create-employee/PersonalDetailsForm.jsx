import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import FloatingInput from '../FloatingInput.jsx';
import { employeeService,API_URL } from '../../../services/api';

export function PersonalDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // Ensure emergencyContact is always defined with proper fallbacks
    const formData = {
        ...employeeData,
        emergencyContact: {
            name: employeeData.emergencyContact?.name || '',
            number: employeeData.emergencyContact?.number || '',
            relationship: employeeData.emergencyContact?.relationship || ''
        }
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

    const handlePhotoUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Upload photo using service
                const response = await employeeService.uploadEmployeePhoto(employeeData.id, file);
                
                if (response.success) {
                    // Update employee data with the file path
                    setEmployeeData(prev => ({ 
                        ...prev, 
                        photo: response.photoPath 
                    }));
                    console.log('Photo uploaded successfully:', response.photoPath);
                } else {
                    console.error('Photo upload failed:', response.message);
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
            }
        }
    }, [setEmployeeData, employeeData.id]);

    const handleSave = () => {
        // Prepare data matching backend API expectations
        const sectionData = {
            // Photo - only send file path, not base64 data
            photo: formData.photo && !formData.photo.startsWith('data:') ? formData.photo : null,
            
            // Emergency Contact (matching backend field names)
            emergencyContactName: formData.emergencyContact?.name || '',
            emergencyContactPhone: formData.emergencyContact?.number || '',
            emergencyContactRelation: formData.emergencyContact?.relationship || '',
            
            // Present Address
            address: formData.presentHouseNumber || '',
            city: formData.presentCity || '',
            state: formData.presentState || '',
            country: formData.presentCountry || 'India',
            pincode: formData.presentPincode || '',
            
            // Permanent Address
            permanentAddress: formData.permanentHouseNumber || '',
            permanentCity: formData.permanentCity || '',
            permanentState: formData.permanentState || '',
            permanentCountry: formData.permanentCountry || 'India',
            permanentPincode: formData.permanentPincode || ''
        };
        
        console.log('Personal Details being sent to backend:', sectionData);
        onSaveSection(sectionData);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden relative">
                    {formData.photo ? (
                        <>
                            <img 
                                src={formData.photo.startsWith('data:') ? formData.photo : `${API_URL}uploads/employee-photos/${formData.photo}`} 
                                alt="Employee" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const fallback = e.target.parentElement.querySelector('.photo-fallback');
                                    if (fallback) {
                                        fallback.style.display = 'flex';
                                    }
                                }}
                            />
                            <div className="photo-fallback w-full h-full flex items-center justify-center text-gray-400 absolute inset-0" style={{ display: 'none' }}>
                                No Photo
                            </div>
                        </>
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
                        id="address"
                        label="House Number/Street/Flat No"
                        value={formData.address?.address || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="city"
                        label="City"
                        value={formData.address?.city || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="state"
                        label="State"
                        value={formData.address?.state || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="country"
                        label="Country"
                        value={formData.address?.country || 'India'}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="pincode"
                        label="Pincode"
                        value={formData.address?.pincode || ''}
                        onChange={handleInputChange}
                        type="text"
                    />
                </div>
            </div>

            {/* Permanent Address Section */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Permanent Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FloatingInput
                        id="permanentAddress"
                        label="House Number/Street/Flat No"
                        value={formData.address?.permanentAddress || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="permanentCity"
                        label="City"
                        value={formData.address?.permanentCity || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="permanentState"
                        label="State"
                        value={formData.address?.permanentState || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="permanentCountry"
                        label="Country"
                        value={formData.address?.permanentCountry || 'India'}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="permanentPincode"
                        label="Pincode"
                        value={formData.address?.permanentPincode || ''}
                        onChange={handleInputChange}
                        type="text"
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
                        value={formData.emergencyContact?.name || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="emergencyContactNumber"
                        label="Number"
                        name="emergencyContact.number"
                        value={formData.emergencyContact?.number || ''}
                        onChange={handleInputChange}
                    />
                    <FloatingInput
                        id="emergencyContactRelationship"
                        label="Relationship"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact?.relationship || ''}
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