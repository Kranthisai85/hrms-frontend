import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import FloatingInput from '../FloatingInput.jsx';
import SearchableSelect from '../SearchableSelect.jsx';
import { employeeService,API_URL } from '../../../services/api';

// List of all Indian states and union territories
const INDIAN_STATES = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Ladakh', label: 'Ladakh' },
    { value: 'Lakshadweep', label: 'Lakshadweep' },
    { value: 'Puducherry', label: 'Puducherry' }
];

// List of family relationships for emergency contact
const FAMILY_RELATIONS = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Grandfather', label: 'Grandfather' },
    { value: 'Grandmother', label: 'Grandmother' },
    { value: 'Uncle', label: 'Uncle' },
    { value: 'Aunt', label: 'Aunt' },
    { value: 'Cousin', label: 'Cousin' },
    { value: 'Father-in-law', label: 'Father-in-law' },
    { value: 'Mother-in-law', label: 'Mother-in-law' },
    { value: 'Brother-in-law', label: 'Brother-in-law' },   
    { value: 'Sister-in-law', label: 'Sister-in-law' },
    { value: 'Son-in-law', label: 'Son-in-law' },
    { value: 'Daughter-in-law', label: 'Daughter-in-law' },
    { value: 'Nephew', label: 'Nephew' },
    { value: 'Niece', label: 'Niece' }
];

export function PersonalDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    // State for pincode validation errors
    const [pincodeErrors, setPincodeErrors] = useState({
        pincode: '',
        permanentPincode: ''
    });

    // Create form data by reading from the correct sources
    const formData = {
        ...employeeData,
        // Present Address - read from nested address object
        address: employeeData.address?.address || '',
        city: employeeData.address?.city || '',
        state: employeeData.address?.state || '',
        country: employeeData.address?.country || 'India',
        pincode: employeeData.address?.pincode || '',
        
        // Permanent Address - read from nested address object
        permanentAddress: employeeData.address?.permanentAddress || '',
        permanentCity: employeeData.address?.permanentCity || '',
        permanentState: employeeData.address?.permanentState || '',
        permanentCountry: employeeData.address?.permanentCountry || 'India',
        permanentPincode: employeeData.address?.permanentPincode || '',
        
        // Emergency Contact - read from flat fields
        emergencyContactName: employeeData.emergencyContactName || '',
        emergencyContactPhone: employeeData.emergencyContactPhone || '',
        emergencyContactRelation: employeeData.emergencyContactRelation || '',
        
        // Other fields
        photo: employeeData.photo || null
    };
    // (You can add validation logic here if needed)



    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // Validation for pincode fields - only allow 6 digits
        if (name === 'pincode' || name === 'permanentPincode') {
            // Only allow numeric input and limit to 6 digits
            const numericValue = value.replace(/\D/g, '').slice(0, 6);
            const finalValue = numericValue;
            
            // Real-time validation
            let errorMessage = '';
            if (value && !/^[0-9]+$/.test(value)) {
                errorMessage = 'Only numeric values are allowed';
            } else if (value && value.length < 6) {
                errorMessage = 'Pincode must be 6 digits';
            } else if (value && value.length > 6) {
                errorMessage = 'Pincode cannot exceed 6 digits';
            }
            
            setPincodeErrors(prev => ({
                ...prev,
                [name]: errorMessage
            }));
            
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                setEmployeeData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: finalValue,
                    },
                }));
            } else {
                setEmployeeData(prev => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        [name]: finalValue,
                    },
                }));
            }
            return;
        }
        
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
            // Handle address fields by updating the address object
            if (['address', 'city', 'state', 'country', 'pincode', 
                 'permanentAddress', 'permanentCity', 'permanentState', 
                 'permanentCountry', 'permanentPincode'].includes(name)) {
                setEmployeeData(prev => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        [name]: value,
                    },
                }));
            } else {
                // Handle all other fields including emergency contact fields
                setEmployeeData(prev => ({ ...prev, [name]: value }));
            }
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

    // Validation function for pincode
    const validatePincode = (pincode) => {
        if (!pincode) return true; // Allow empty pincode
        return /^[0-9]{6}$/.test(pincode);
    };

    const handleSave = () => {
        // Check if there are any pincode errors
        if (pincodeErrors.pincode || pincodeErrors.permanentPincode) {
            return; // Don't save if there are validation errors
        }
        
        // Validate pincodes before saving
        const presentPincodeValid = validatePincode(formData.pincode);
        const permanentPincodeValid = validatePincode(formData.permanentPincode);
        
        if (!presentPincodeValid || !permanentPincodeValid) {
            return;
        }
        
        // Prepare data matching backend API expectations
        const sectionData = {
            // Photo - only send file path, not base64 data
            photo: formData.photo && !formData.photo.startsWith('data:') ? formData.photo : null,
            
            // Emergency Contact (matching backend field names)
            emergencyContactName: formData.emergencyContactName || '',
            emergencyContactPhone: formData.emergencyContactPhone || '',
            emergencyContactRelation: formData.emergencyContactRelation || '',
            
            // Present Address (matching backend field names)
            address: formData.address || '',
            city: formData.city || '',
            state: formData.state || '',
            country: formData.country || 'India',
            pincode: formData.pincode || '',
            
            // Permanent Address (matching backend field names)
            permanentAddress: formData.permanentAddress || '',
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
                <h3 className="font-semibold text-lg mb-5">Present Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <FloatingInput
                        name="address"
                        label="House Number/Street/Flat No"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        placeholder="House Number/Street/Flat No"
                    />
                    <FloatingInput
                        name="city"
                        label="City"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                        placeholder="City"
                    />
                    <SearchableSelect
                        id="state"
                        label="State"
                        value={formData.state || ''}
                        onChange={handleInputChange}
                        staticOptions={INDIAN_STATES}
                        darkMode={darkMode}
                    />
                    <FloatingInput
                        name="country"
                        label="Country"
                        value={formData.country || 'India'}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                    <FloatingInput
                        name="pincode"
                        label="Pincode"
                        value={formData.pincode || ''}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Enter 6-digit pincode"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        title="Please enter a 6-digit pincode"
                    />
                </div>
                {pincodeErrors.pincode && (
                    <div className="text-red-500 text-sm mt-1">{pincodeErrors.pincode}</div>
                )}
            </div>

            {/* Permanent Address Section */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-5">Permanent Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <FloatingInput
                        name="permanentAddress"
                        label="House Number/Street/Flat No"
                        value={formData.permanentAddress || ''}
                        onChange={handleInputChange}
                        placeholder="House Number/Street/Flat No"
                    />
                    <FloatingInput
                        name="permanentCity"
                        label="City"
                        value={formData.permanentCity || ''}
                        onChange={handleInputChange}
                        placeholder="City"
                    />
                    <SearchableSelect
                        id="permanentState"
                        label="State"
                        value={formData.permanentState || ''}
                        onChange={handleInputChange}
                        staticOptions={INDIAN_STATES}
                        darkMode={darkMode}
                    />
                    <FloatingInput
                        name="permanentCountry"
                        label="Country"
                        value={formData.permanentCountry || 'India'}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                    <FloatingInput
                        name="permanentPincode"
                        label="Pincode"
                        value={formData.permanentPincode || ''}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Enter 6-digit pincode"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        title="Please enter a 6-digit pincode"
                    />
                </div>
                {pincodeErrors.permanentPincode && (
                    <div className="text-red-500 text-sm mt-1">{pincodeErrors.permanentPincode}</div>
                )}
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FloatingInput
                        name="emergencyContactName"
                        label="Name"
                        value={formData.emergencyContactName || ''}
                        onChange={handleInputChange}
                        placeholder="Emergency Contact Name"
                    />
                    <FloatingInput
                        name="emergencyContactPhone"
                        label="Number"
                        value={formData.emergencyContactPhone || ''}
                        onChange={handleInputChange}
                        placeholder="Emergency Contact Number"
                    />
                    <SearchableSelect
                        id="emergencyContactRelation"
                        label="Relationship"
                        value={formData.emergencyContactRelation || ''}
                        onChange={handleInputChange}
                        staticOptions={FAMILY_RELATIONS}
                        darkMode={darkMode}
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