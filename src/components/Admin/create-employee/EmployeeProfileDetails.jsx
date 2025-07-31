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
            let response;
            // If Org tab and no employeeId, create
            if (section === 'org' && !employeeData.id) {
                response = await employeeService.createEmployee(sectionData);
                setEmployeeData(prev => ({ ...prev, ...response.data }));
                setFeedback({ [section]: { type: 'success', message: 'Employee created successfully.' } });
            } else {
                // Update: send only sectionData
                response = await employeeService.updateEmployee(employeeData.id, sectionData);
                setEmployeeData(prev => ({ ...prev, ...sectionData }));
                setFeedback({ [section]: { type: 'success', message: 'Section updated successfully.' } });
            }
        } catch (err) {
            setFeedback({ [section]: { type: 'error', message: err.message || 'Failed to save.' } });
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
            {employeeData.photo && (
                <div className="flex justify-end p-1">
                    <img src={employeeData.photo} alt="Employee" className="w-32 h-32 rounded-full object-cover" />
                </div>
            )}
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