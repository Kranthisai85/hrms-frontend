import { format } from 'date-fns';
import { FileUp } from 'lucide-react';

export function DocumentsTab({ employeeData, setEmployeeData, onSaveSection, loading, feedback, setIsUploadModalOpen, darkMode, onCancel }) {
    // Ensure uploadedDocuments is always an array
    const uploadedDocuments = employeeData.documents || [];

    const handleSave = () => {
        // Only send documents section fields
        const sectionData = {
            documents: (uploadedDocuments || []).map(doc => ({
                documentName: doc.type || '',
                fileName: doc.documentNumber || '',
                lastUpdated: doc.issueDate || new Date().toISOString(),
                comment: doc.description || '',
                user_id: employeeData.userId || employeeData.user?.id // Add user_id as required by backend
            })),
        };
        onSaveSection(sectionData);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Proof Documents</h3>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-green-500 flex items-center hover:text-green-600 text-sm"
                >
                    <FileUp className="mr-1" size={16} />
                    Drop Files Here
                </button>
            </div>
            <div className="border rounded-lg overflow-hidden" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sr. No.</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Document Type</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Document Number</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Issue Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Expiry Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {uploadedDocuments.map((doc, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm">{index + 1}</td>
                                <td className="px-4 py-2 text-sm">{doc.type}</td>
                                <td className="px-4 py-2 text-sm">{doc.documentNumber}</td>
                                <td className="px-4 py-2 text-sm">{doc.issueDate ? format(new Date(doc.issueDate), 'dd-MMM-yyyy') : '-'}</td>
                                <td className="px-4 py-2 text-sm">{doc.expiryDate ? format(new Date(doc.expiryDate), 'dd-MMM-yyyy') : '-'}</td>
                                <td className="px-4 py-2 text-sm">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                        Uploaded
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {uploadedDocuments.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                                    No documents uploaded yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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