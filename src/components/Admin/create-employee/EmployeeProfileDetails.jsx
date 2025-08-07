import { useState, useEffect } from 'react';
import { BankDetailsForm } from './BankDetailsForm.jsx';
import { DocumentsTab } from './DocumentsTab.jsx';
import { FamilyDetailsForm } from './FamilyDetailsForm.jsx';
import { OrgDetailsForm } from './OrgDetailsForm.jsx';
import { PersonalDetailsForm } from './PersonalDetailsForm.jsx';
import { ProfessionalDetailsForm } from './ProfessionalDetailsForm.jsx';
import { ProofDocumentModal } from './ProofDocumentModal.jsx';
import { QualificationDetailsForm } from './QualificationDetailsForm.jsx';
import { Tabs } from './Tabs.jsx';
import { employeeService } from '../../../services/api';

export default function EmployeeProfileDetails({
    employee,
    darkMode,
    onCancel
}) {
    // Centralized state for all employee data
    const [employeeData, setEmployeeData] = useState(employee || {});
    const [activeTab, setActiveTab] = useState('org');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({}); // { tab: { type: 'success'|'error', message: '' } }

    // Update employeeData when employee prop changes
    useEffect(() => {
        if (employee) {
            // Transform the API response to match our form structure
            // const transformedEmployee = {
            //     // Basic employee fields
            //     id: employee.id,
            //     employeeId: employee.employeeId,
            //     userId: employee.userId,
            //     departmentId: employee.departmentId,
            //     designationId: employee.designationId,
            //     branchId: employee.branchId,
            //     subDepartmentId: employee.subDepartmentId,
            //     gradeId: employee.gradeId,
            //     categoryId: employee.categoryId,
            //     reportingManagerId: employee.reportingManagerId,
            //     joiningDate: employee.joiningDate,
            //     employmentStatus: employee.employmentStatus,
            //     employmentType: employee.employmentType,
            //     photo: employee.photo,
                
            //     // User details (nested)
            //     user: employee.user || {},
                
            //     // Department, designation, branch details (nested objects)
            //     department: employee.department || {},
            //     designation: employee.designation || {},
            //     branch: employee.branch || {},
            //     reportingManager: employee.reportingManager || {},
                
            //     // Address details (nested)
            //     address: employee.address || {},
                
            //     // Arrays
            //     familyMembers: employee.familyMembers || [],
            //     qualifications: employee.qualifications || [],
            //     experiences: employee.experiences || [],
            //     documents: employee.documents || [],
                
            //     // Bank details (nested)
            //     bankDetails: employee.bankDetails || {},
                
            //     // Map address fields to form structure (from address object)
            //     presentHouseNumber: employee.address?.address || '',
            //     presentCity: employee.address?.city || '',
            //     presentState: employee.address?.state || '',
            //     presentCountry: employee.address?.country || 'India',
            //     presentPincode: employee.address?.pincode || '',
                
            //     permanentHouseNumber: employee.address?.permanentAddress || '',
            //     permanentCity: employee.address?.permanentCity || '',
            //     permanentState: employee.address?.permanentState || '',
            //     permanentCountry: employee.address?.permanentCountry || 'India',
            //     permanentPincode: employee.address?.permanentPincode || '',
                
            //     // Emergency contact (if available in the response)
            //     emergencyContact: employee.emergencyContact || { name: '', number: '', relationship: '' },
                
            //     // Bank details mapping (from employee object)
            //     bankName: employee.bankName || '',
            //     accountNumber: employee.accountNumber || '',
            //     ifscCode: employee.ifscCode || '',
            //     branch: employee.branch || '',
                
            //     // Additional fields from API response
            //     aadharNumber: employee.aadharNumber || '',
            //     panNumber: employee.panNumber || '',
            //     email: employee.email || employee.user?.email || '',
            //     inviteSent: employee.inviteSent || false,
            //     confirmationDate: employee.confirmationDate || '',
            //     resignationDate: employee.resignationDate || '',
            //     relievedDate: employee.relievedDate || '',
            //     reason: employee.reason || '',
                
            //     // Checkbox fields
            //     isOrphan: employee.isOrphan || false,
            //     lessThanPrimary: employee.lessThanPrimary || false,
            //     isFresher: employee.isFresher || false,
            // };
            
            console.log('Transformed employee data:', employee);
                setEmployeeData(employee);
        }
    }, [employee]);

    // Helper to update only a section of employeeData
    const updateSection = (sectionData) => {
        setEmployeeData(prev => ({ ...prev, ...sectionData }));
    };

    // Save handler for each tab
    const handleSaveSection = async (section, sectionData) => {
        setLoading(true);
        setFeedback({});
        try {
            console.log(`Saving ${section} section:`, sectionData);
            let response;
            // If Org tab and no employeeId, create
            if (section === 'org' && !employeeData.id) {
                response = await employeeService.createEmployee(sectionData);
                setEmployeeData(prev => ({ ...prev, ...response.data }));
                setFeedback({ [section]: { type: 'success', message: 'Employee created successfully.' } });
            } else {
                // Update: send only sectionData
                response = await employeeService.updateEmployee(employeeData.id, sectionData);
                console.log('Backend response:', response);
                setEmployeeData(prev => ({ ...prev, ...sectionData }));
                setFeedback({ [section]: { type: 'success', message: 'Section updated successfully.' } });
            }
        } catch (err) {
            console.error('Save error:', err);
            console.error('Error structure:', {
                message: err.message,
                response: err.response,
                errors: err.errors,
                data: err.data
            });
            
            // Check if this is a validation error (400 status) that should be handled by the form
            if (err.response?.status === 400 && err.response?.data?.errors) {
                console.log('Validation errors found:', err.response.data.errors);
                // For validation errors, let the form component handle them
                // Don't set feedback, let the error bubble up to the form
                throw err; // Re-throw so the form can handle it
            } else if (err.message === 'Validation failed' && err.errors) {
                console.log('Validation errors in err.errors:', err.errors);
                // Handle case where error is thrown by handleApiError but still has errors
                const validationError = new Error('Validation failed');
                validationError.response = {
                    status: 400,
                    data: { errors: err.errors }
                };
                throw validationError;
            } else if (err.message === 'Validation failed' && err.data?.errors) {
                console.log('Validation errors in err.data.errors:', err.data.errors);
                // Handle case where error data is in err.data
                const validationError = new Error('Validation failed');
                validationError.response = {
                    status: 400,
                    data: { errors: err.data.errors }
                };
                throw validationError;
            } else {
                // For other errors (500, network, etc.), show feedback
                setFeedback({ [section]: { type: 'error', message: err.message || 'Failed to save.' } });
            }
        } finally {
            setLoading(false);
        }
    };

    // Document upload handler (for Documents tab)
    const handleDocumentUpload = (documentData) => {
        const docs = employeeData.documents || [];
        const existingDocIndex = docs.findIndex(doc => doc.documentName === documentData.documentName);
        let updatedDocuments;
        if (existingDocIndex !== -1) {
            if (window.confirm(`A document "${documentData.documentName}" already exists. Do you want to replace it?`)) {
                updatedDocuments = [...docs];
                updatedDocuments[existingDocIndex] = documentData;
            } else {
                return;
            }
        } else {
            updatedDocuments = [...docs, documentData];
        }
        setEmployeeData(prev => ({ ...prev, documents: updatedDocuments }));
    };

    return (
        <div className={`mx-auto max-w-8xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-6">
                {activeTab === 'org' && (
                    <OrgDetailsForm
                        employeeData={employeeData}
                        setEmployeeData={setEmployeeData}
                        onSaveSection={(data) => handleSaveSection('org', data)}
                        loading={loading}
                        feedback={feedback['org']}
                        darkMode={darkMode}
                        onCancel={onCancel}
                    />
                )}
                {activeTab === 'personal' && (
                    <PersonalDetailsForm
                        employeeData={employeeData}
                        setEmployeeData={setEmployeeData}
                        onSaveSection={(data) => handleSaveSection('personal', data)}
                        loading={loading}
                        feedback={feedback['personal']}
                        darkMode={darkMode}
                        onCancel={onCancel}
                    />
                )}
                {activeTab === 'family' && (
                    <FamilyDetailsForm
                        employeeData={employeeData}
                        setEmployeeData={setEmployeeData}
                        onSaveSection={(data) => handleSaveSection('family', data)}
                        loading={loading}
                        feedback={feedback['family']}
                        darkMode={darkMode}
                        onCancel={onCancel}
                    />
                )}
                {activeTab === 'bank' && (
                    <BankDetailsForm
                        employeeData={employeeData}
                        setEmployeeData={setEmployeeData}
                        onSaveSection={(data) => handleSaveSection('bank', data)}
                        loading={loading}
                        feedback={feedback['bank']}
                        darkMode={darkMode}
                        onCancel={onCancel}
                    />
                )}
                {activeTab === 'educational' && (
                    <QualificationDetailsForm
                        employeeData={employeeData}
                        setEmployeeData={setEmployeeData}
                        onSaveSection={(data) => handleSaveSection('educational', data)}
                        loading={loading}
                        feedback={feedback['educational']}
                        darkMode={darkMode}
                        onCancel={onCancel}
                    />
                )}
                {activeTab === 'professional' && (
                    <ProfessionalDetailsForm
                        employeeData={employeeData}
                        setEmployeeData={setEmployeeData}
                        onSaveSection={(data) => handleSaveSection('professional', data)}
                        loading={loading}
                        feedback={feedback['professional']}
                        darkMode={darkMode}
                        onCancel={onCancel}
                    />
                )}
                {activeTab === 'documents' && (
                    <DocumentsTab
                        employeeData={employeeData}
                        setEmployeeData={setEmployeeData}
                        onSaveSection={(data) => handleSaveSection('documents', data)}
                        loading={loading}
                        feedback={feedback['documents']}
                        setIsUploadModalOpen={setIsUploadModalOpen}
                        darkMode={darkMode}
                        onCancel={onCancel}
                    />
                )}
            </div>
            <ProofDocumentModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleDocumentUpload}
                onCancel={onCancel}
            />
        </div>
    );
}