import { useState } from 'react';
import { BankDetailsForm } from './BankDetailsForm.jsx';
import { DocumentsTab } from './DocumentsTab.jsx';
import { FamilyDetailsForm } from './FamilyDetailsForm.jsx';
import { OrgDetailsForm } from './OrgDetailsForm.jsx';
import { PersonalDetailsForm } from './PersonalDetailsForm.jsx';
import { ProfessionalDetailsForm } from './ProfessionalDetailsForm.jsx';
import { ProofDocumentModal } from './ProofDocumentModal.jsx';
import { QualificationDetailsForm } from './QualificationDetailsForm.jsx';
import { Tabs } from './Tabs.jsx';

export default function EmployeeProfileDetails({
    employee,
    darkMode,
    onSave,
    onCancel
}) {

    const [activeTab, setActiveTab] = useState('org');
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleDocumentUpload = (documentData) => {
        const existingDocIndex = uploadedDocuments.findIndex(
            (doc) => doc.documentName === documentData.documentName
        );
        if (existingDocIndex !== -1) {
            if (
                window.confirm(
                    `A document "${documentData.documentName}" already exists. Do you want to replace it?`
                )
            ) {
                const updatedDocuments = [...uploadedDocuments];
                updatedDocuments[existingDocIndex] = documentData;
                setUploadedDocuments(updatedDocuments);
            }
        } else {
            setUploadedDocuments((prev) => [...prev, documentData]);
        }
    };


    return (
        <div
            className={`mx-auto max-w-8xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        >
            {employee?.photo && (
                <div className="flex justify-end p-1">
                    <img
                        src={employee.photo}
                        alt="Employee"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>
            )}
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-6">
                {activeTab === 'org' && (
                    <OrgDetailsForm
                        employee={employee}
                        onSave={onSave}
                        darkMode={darkMode}
                        onCancel={onCancel}
                    />
                )}
                {activeTab === 'personal' && (
                    <PersonalDetailsForm employee={employee} onSave={onSave} onCancel={onCancel} />
                )}
                {activeTab === 'family' && (
                    <FamilyDetailsForm employee={employee} onSave={onSave} onCancel={onCancel} />
                )}
                {activeTab === 'bank' && (
                    <BankDetailsForm employee={employee} onSave={onSave} onCancel={onCancel} />
                )}
                {activeTab === 'educational' && (
                    <QualificationDetailsForm employee={employee} onSave={onSave} onCancel={onCancel} />
                )}
                {activeTab === 'professional' && (
                    <ProfessionalDetailsForm employee={employee} onSave={onSave} onCancel={onCancel} />
                )}
                {activeTab === 'documents' && (
                    <DocumentsTab
                        uploadedDocuments={uploadedDocuments}
                        setIsUploadModalOpen={setIsUploadModalOpen}
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