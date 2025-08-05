import { useCallback, useState } from 'react';
import FloatingInput from '../FloatingInput.jsx';

export function BankDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    const formData = employeeData;
    
    // State for IFSC validation errors
    const [ifscError, setIfscError] = useState('');

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // Special validation for IFSC code
        if (name === 'ifscCode') {
            // Convert to uppercase and remove spaces
            const cleanValue = value.toUpperCase().replace(/\s/g, '');
            
            // Validate alphanumeric and length
            if (cleanValue && !/^[A-Z0-9]+$/.test(cleanValue)) {
                setIfscError('IFSC code should contain only letters and numbers');
            } else if (cleanValue && cleanValue.length !== 11) {
                setIfscError('IFSC code must be exactly 11 characters');
            } else {
                setIfscError('');
            }
            
            // Update with cleaned value
            setEmployeeData(prev => ({ ...prev, [name]: cleanValue }));
        } else {
            setEmployeeData(prev => ({ ...prev, [name]: value }));
        }
    }, [setEmployeeData]);

    const handleSave = () => {
        // Check if there are IFSC validation errors
        if (ifscError) {
            return; // Don't save if there are validation errors
        }
        
        // Only send bank section fields - using API response field names
        const sectionData = {
            bankName: formData.bankName || '',
            accountNumber: formData.accountNumber || '',
            ifscCode: formData.ifscCode || '',
            bankBranch: formData.bankBranch || ''
        };
        onSaveSection(sectionData);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInput
                    id="bankName"
                    label="Bank Name"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    required
                    error={formData.bankNameError}
                />
                <FloatingInput
                    id="accountNumber"
                    label="Bank Account No"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    required
                    error={formData.accountNumberError}
                />
                <FloatingInput
                    id="ifscCode"
                    label="IFSC Code"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    required
                    error={ifscError || formData.ifscCodeError}
                    maxLength={11}
                    placeholder="e.g., SBIN0001234"
                />
                <FloatingInput
                    id="bankBranch"
                    label="Branch"
                    value={formData.bankBranch}
                    onChange={handleInputChange}
                    required
                    error={formData.branchError}
                />
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