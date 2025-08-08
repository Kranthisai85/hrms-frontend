import { format } from 'date-fns';
import { FileUp, Eye, Download, Trash2 } from 'lucide-react';
import { API_URL } from '../../../services/api';

export function DocumentsTab({ employeeData, setEmployeeData, onSaveSection, loading, feedback, setIsUploadModalOpen, darkMode, onCancel }) {
    // Ensure uploadedDocuments is always an array
    const uploadedDocuments = employeeData.documents || [];

    const handleSave = () => {
        // Only send documents section fields
        const sectionData = {
            documents: (uploadedDocuments || []).map(doc => ({
                documentName: doc.documentName || doc.type || '',
                fileName: doc.fileName || doc.documentNumber || '',
                size: doc.size || 0,
                lastUpdated: doc.lastUpdated || doc.issueDate || new Date().toISOString(),
                comment: doc.comment || doc.description || '',
                user_id: employeeData.userId || employeeData.user?.id // Add user_id as required by backend
            })),
        };
        onSaveSection(sectionData);
    };

    const handleViewDocument = (document) => {
        if (document.fileName) {
            const fileUrl = `${API_URL}uploads/employee-documents/${document.fileName}`;
            window.open(fileUrl, '_blank');
        }
    };

    const handleDownloadDocument = (document) => {
        if (document.fileName) {
            const fileUrl = `${API_URL}uploads/employee-documents/${document.fileName}`;
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = document.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDeleteDocument = (index) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            const updatedDocuments = uploadedDocuments.filter((_, i) => i !== index);
            setEmployeeData(prev => ({ ...prev, documents: updatedDocuments }));
        }
    };

    const getFileIcon = (fileName) => {
        if (!fileName) return '📄';
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
            return '🖼️';
        } else if (extension === 'pdf') {
            return '📄';
        } else {
            return '📎';
        }
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
                    Add Files Here
                </button>
            </div>
            <div className="border rounded-lg overflow-hidden" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sr. No.</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Document Type</th>
                            {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">File Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Size</th> */}
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Upload Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {uploadedDocuments.map((doc, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm">{index + 1}</td>
                                <td className="px-4 py-2 text-sm">
                                    <div className="flex items-center">
                                        <span className="mr-2">{getFileIcon(doc.fileName)}</span>
                                        {doc.documentName || doc.type}
                                    </div>
                                </td>
                                {/* <td className="px-4 py-2 text-sm">
                                    <div className="max-w-xs truncate" title={doc.fileName || doc.documentNumber}>
                                        {doc.fileName || doc.documentNumber || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'N/A'}
                                </td> */}
                                <td className="px-4 py-2 text-sm">
                                    {doc.lastUpdated || doc.issueDate ? 
                                        format(new Date(doc.lastUpdated || doc.issueDate), 'dd-MMM-yyyy') : 
                                        'N/A'
                                    }
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleViewDocument(doc)}
                                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                            title="View Document"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadDocument(doc)}
                                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                            title="Download Document"
                                        >
                                            <Download size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDocument(index)}
                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                            title="Delete Document"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
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