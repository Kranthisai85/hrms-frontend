import { useCallback, useState } from 'react';
import FloatingInput from '../FloatingInput.jsx';

export function BankDetailsForm({ employee, onSave }) {
    const initialFormData = {
        bankName: employee?.bankName || '',
        bankAccountNo: employee?.bankAccountNo || '',
        ifscCode: employee?.ifscCode || '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.bankName) errors.bankName = 'Bank Name is required';
        if (!formData.bankAccountNo) errors.bankAccountNo = 'Bank Account No is required';
        if (!formData.ifscCode) errors.ifscCode = 'IFSC Code is required';
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInput
                    id="bankName"
                    label="Bank Name"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    required
                    error={formErrors.bankName}
                />
                <FloatingInput
                    id="bankAccountNo"
                    label="Bank Account No"
                    value={formData.bankAccountNo}
                    onChange={handleInputChange}
                    required
                    error={formErrors.bankAccountNo}
                />
                <FloatingInput
                    id="ifscCode"
                    label="IFSC Code"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    required
                    error={formErrors.ifscCode}
                />
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