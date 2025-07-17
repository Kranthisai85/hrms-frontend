import { X } from "lucide-react";

export default function Modal({ darkMode, isOpen, onClose, title, children, onSubmit, submitText, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl relative max-w-md w-full`}>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 ${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onSubmit}
            className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-1 rounded`}
          >
            {submitText}
          </button>
          <button
            onClick={onCancel}
            className={`${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-1 rounded`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}