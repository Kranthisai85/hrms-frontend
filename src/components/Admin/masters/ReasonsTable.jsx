import { Edit, Plus, Trash } from "lucide-react";
import toast from 'react-hot-toast';
import { reasonsService } from "../../../services/api";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useState } from "react";

export default function ReasonsTable({
  darkMode,
  resignationReasons,
  terminationReasons,
  resignationSearchTerm,
  terminationSearchTerm,
  setResignationSearchTerm,
  setTerminationSearchTerm,
  setResignationReasons,
  setTerminationReasons
}) {
  const [isCreateResignationReasonOpen, setIsCreateResignationReasonOpen] = useState(false);
  const [isCreateTerminationReasonOpen, setIsCreateTerminationReasonOpen] = useState(false);
  const [editingReason, setEditingReason] = useState(null);
  const [newReason, setNewReason] = useState({ name: "", type: "" });
  const [localLoading, setLocalLoading] = useState(false);

  const handleCreateReason = async (type) => {
    if (!newReason.name) {
      toast.error(`${type} reason name is required`);
      return;
    }
    const reasons = type === "Resignation" ? resignationReasons : terminationReasons;
    const isDuplicate = reasons.some(
      reason => reason.name.toLowerCase().trim() === newReason.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A ${type.toLowerCase()} reason with the name "${newReason.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await reasonsService.createReason({
        name: newReason.name,
        type: type
      });
      if (response.success) {
        if (type === "Resignation") {
          setResignationReasons([...resignationReasons, response.data]);
        } else {
          setTerminationReasons([...terminationReasons, response.data]);
        }
        setNewReason({ name: "", type: "" });
        setIsCreateResignationReasonOpen(false);
        setIsCreateTerminationReasonOpen(false);
        toast.success(`${type} reason created successfully`);
      } else {
        toast.error(response.message || `Failed to create ${type.toLowerCase()} reason`);
      }
    } catch (error) {
      toast.error(`Error creating ${type.toLowerCase()} reason`);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteReason = async (id, type) => {
    try {
      setLocalLoading(true);
      const response = await reasonsService.deleteReason(id);
      if (response.success) {
        if (type === "Resignation") {
          setResignationReasons(resignationReasons.filter((reason) => reason.id !== id));
        } else {
          setTerminationReasons(terminationReasons.filter((reason) => reason.id !== id));
        }
        toast.success(`${type} reason deleted successfully`);
      } else {
        toast.error(response.message || `Failed to delete ${type.toLowerCase()} reason`);
      }
    } catch (error) {
      toast.error(`Error deleting ${type.toLowerCase()} reason`);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditReason = (reason, type) => {
    setEditingReason(reason);
    setNewReason({ ...reason, type });
    if (type === "Resignation") {
      setIsCreateResignationReasonOpen(true);
    } else {
      setIsCreateTerminationReasonOpen(true);
    }
  };

  const handleUpdateReason = async (type) => {
    if (!newReason.name) {
      toast.error(`${type} reason name is required`);
      return;
    }
    const reasons = type === "Resignation" ? resignationReasons : terminationReasons;
    const isDuplicate = reasons.some(
      reason => reason.name.toLowerCase().trim() === newReason.name.toLowerCase().trim() && reason.id !== editingReason.id
    );
    if (isDuplicate) {
      toast.error(`A ${type.toLowerCase()} reason with the name "${newReason.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await reasonsService.updateReason(editingReason.id, {
        name: newReason.name,
        type: type
      });
      if (response.success) {
        if (type === "Resignation") {
          setResignationReasons(resignationReasons.map((reason) =>
            reason.id === editingReason.id ? response.data : reason
          ));
        } else {
          setTerminationReasons(terminationReasons.map((reason) =>
            reason.id === editingReason.id ? response.data : reason
          ));
        }
        setIsCreateResignationReasonOpen(false);
        setIsCreateTerminationReasonOpen(false);
        setEditingReason(null);
        setNewReason({ name: "", type: "" });
        toast.success(`${type} reason updated successfully`);
      } else {
        toast.error(response.message || `Failed to update ${type.toLowerCase()} reason`);
      }
    } catch (error) {
      toast.error(`Error updating ${type.toLowerCase()} reason`);
    } finally {
      setLocalLoading(false);
    }
  };

  const filteredResignationReasons = resignationReasons.filter(reason =>
    reason.name.toLowerCase().includes(resignationSearchTerm.toLowerCase())
  );

  const filteredTerminationReasons = terminationReasons.filter(reason =>
    reason.name.toLowerCase().includes(terminationSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-wrap gap-4">
      {/* First Reason Table: Resignation */}
      <div className="flex-1 min-w-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-black"}`}>Resignation</h2>
        </div>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <SearchBar
            darkMode={darkMode}
            searchTerm={resignationSearchTerm}
            setSearchTerm={setResignationSearchTerm}
          />
          <button
            className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => {
              setNewReason({ name: "", type: "Resignation" });
              setIsCreateResignationReasonOpen(true);
            }}
            disabled={localLoading}
          >
            <Plus className="mr-2" size={20} />
            Create Resignation Reason
          </button>
        </div>
        {!localLoading && filteredResignationReasons.length === 0 && (
          <div className="text-center py-8">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No resignation reasons found</p>
          </div>
        )}
        {localLoading && filteredResignationReasons.length === 0 && (
          <div className="text-center py-8">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading resignation reasons...</p>
          </div>
        )}
        {!localLoading && filteredResignationReasons.length > 0 && (
          <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Reason</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
              {filteredResignationReasons.map((reason, index) => (
                <tr key={reason.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                  <td className="px-6 py-2 border-b">{index + 1}</td>
                  <td className="px-6 py-2 border-b">{reason.name}</td>
                  <td className="px-6 py-2 border-b text-sm font-medium">
                    <button
                      onClick={() => handleEditReason(reason, "Resignation")}
                      className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                      disabled={localLoading}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteReason(reason.id, "Resignation")}
                      className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                      disabled={localLoading}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Second Reason Table: Termination */}
      <div className="flex-1 min-w-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-black"}`}>Termination</h2>
        </div>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <SearchBar
            darkMode={darkMode}
            searchTerm={terminationSearchTerm}
            setSearchTerm={setTerminationSearchTerm}
          />
          <button
            className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => {
              setNewReason({ name: "", type: "Termination" });
              setIsCreateTerminationReasonOpen(true);
            }}
            disabled={localLoading}
          >
            <Plus className="mr-2" size={20} />
            Create Termination Reason
          </button>
        </div>
        {!localLoading && filteredTerminationReasons.length === 0 && (
          <div className="text-center py-8">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No termination reasons found</p>
          </div>
        )}
        {localLoading && filteredTerminationReasons.length === 0 && (
          <div className="text-center py-8">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading termination reasons...</p>
          </div>
        )}
        {!localLoading && filteredTerminationReasons.length > 0 && (
          <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Reason</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
              {filteredTerminationReasons.map((reason, index) => (
                <tr key={reason.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                  <td className="px-6 py-2 border-b">{index + 1}</td>
                  <td className="px-6 py-2 border-b">{reason.name}</td>
                  <td className="px-6 py-2 border-b text-sm font-medium">
                    <button
                      onClick={() => handleEditReason(reason, "Termination")}
                      className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                      disabled={localLoading}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteReason(reason.id, "Termination")}
                      className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                      disabled={localLoading}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(isCreateResignationReasonOpen || isCreateTerminationReasonOpen) && (
        <Modal
          darkMode={darkMode}
          isOpen={isCreateResignationReasonOpen || isCreateTerminationReasonOpen}
          onClose={() => {
            setIsCreateResignationReasonOpen(false);
            setIsCreateTerminationReasonOpen(false);
            setEditingReason(null);
            setNewReason({ name: "", type: "" });
          }}
          title={editingReason ? `Edit ${newReason.type} Reason` : `Create ${newReason.type} Reason`}
          onSubmit={() => newReason.type === "Resignation" ? handleCreateReason("Resignation") : handleCreateReason("Termination")}
          submitText={editingReason ? "Update" : "Save"}
          onCancel={() => {
            setIsCreateResignationReasonOpen(false);
            setIsCreateTerminationReasonOpen(false);
            setEditingReason(null);
            setNewReason({ name: "", type: "" });
          }}
        >
          <input
            type="text"
            value={newReason.name}
            onChange={(e) => setNewReason({ ...newReason, name: e.target.value })}
            placeholder={`${newReason.type} Reason Name`}
            className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
          />
        </Modal>
      )}
    </div>
  );
}