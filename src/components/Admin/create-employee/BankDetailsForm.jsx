import { useCallback } from 'react';
import FloatingInput from '../FloatingInput.jsx';

export function BankDetailsForm({ employeeData, setEmployeeData, onSaveSection, loading, feedback, darkMode, onCancel }) {
    const formData = employeeData;
    // (You can add validation logic here if needed)

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: value }));
    }, [setEmployeeData]);

    const handleSave = () => {
        // Only send bank section fields - using API response field names
        const sectionData = {
            bankName: formData.bankName || '',
            accountNumber: formData.accountNumber || '',
            ifscCode: formData.ifscCode || '',
            branch: formData.branch || ''
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
                    error={formData.ifscCodeError}
                />
                <FloatingInput
                    id="branch"
                    label="Branch"
                    value={formData.branch}
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