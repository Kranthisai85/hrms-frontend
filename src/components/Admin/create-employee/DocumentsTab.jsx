import { format } from 'date-fns';
import { FileUp } from 'lucide-react';

export function DocumentsTab({ uploadedDocuments, setIsUploadModalOpen }) {
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
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Document Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">File Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Updated</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Comments</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {uploadedDocuments.map((doc, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm">{index + 1}</td>
                                <td className="px-4 py-2 text-sm">{doc.documentName}</td>
                                <td className="px-4 py-2 text-sm">{doc.fileName}</td>
                                <td className="px-4 py-2 text-sm">{format(new Date(doc.lastUpdated), 'dd-MMM-yyyy')}</td>
                                <td className="px-4 py-2 text-sm">{doc.comment}</td>
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
        </div>
    );
}