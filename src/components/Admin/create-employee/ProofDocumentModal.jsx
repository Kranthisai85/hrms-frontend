import { X } from 'lucide-react';
import { useState } from 'react';

export function ProofDocumentModal({ isOpen, onClose, onUpload, onCancel }) {
    const [selectedDocument, setSelectedDocument] = useState('');
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) {
            setFile(selectedFile);
        } else {
            alert('File size should not exceed 10MB');
        }
    };

    const handleUpload = () => {
        if (selectedDocument && file) {
            onUpload({
                documentName: selectedDocument,
                fileName: file.name,
                size: file.size,
                lastUpdated: new Date().toISOString(),
                comment,
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Upload Document</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="relative">
                        <select
                            value={selectedDocument}
                            onChange={(e) => setSelectedDocument(e.target.value)}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        >
                            <option value="">Select document type</option>
                            <option value="Aadhaar">Aadhaar</option>
                            <option value="PAN">PAN</option>
                            <option value="PAN & Aadhaar Linked">Pan & Aadhaar Linked Proof</option>
                            <option value="Bank Proof">Proof of Bank Account</option>
                            <option value="Graduation Certificate">Educational Certificate's</option>
                            <option value="Signed Appointment Letter">Signed Appointment Letter</option>
                            <option value="Form-11 (EPF)">Form-11 (EPF)</option>
                            <option value="Form-2 (ESI)">Form-2 (ESI)</option>
                            <option value="Form-F (POGA)">Form-F (POGA)</option>
                            <option value="Form-Q (S&E Act)">Form-Q (S&E Act)</option>
                        </select>
                        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                            Select Document
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        />
                        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                            File
                        </label>
                    </div>
                    <div className="relative">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            rows="3"
                        />
                        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                            Comment (Optional)
                        </label>
                    </div>
                    <button
                        onClick={handleUpload}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Upload
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}