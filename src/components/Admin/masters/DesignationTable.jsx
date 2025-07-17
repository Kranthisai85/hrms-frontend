import { Edit, Plus, Trash } from "lucide-react";
import toast from 'react-hot-toast';
import { designationService } from "../../../services/api";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useState } from "react";

export default function DesignationTable({ darkMode, designations, departments, searchTerm, setSearchTerm, setDesignations }) {
  const [isCreateDesignationOpen, setIsCreateDesignationOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [newDesignation, setNewDesignation] = useState({ name: "", departmentId: null });
  const [localLoading, setLocalLoading] = useState(false);

  const handleCreateDesignation = async () => {
    if (!newDesignation.name || !newDesignation.departmentId) {
      toast.error('Designation name and department are required');
      return;
    }
    const isDuplicate = designations.some(
      des => des.name.toLowerCase().trim() === newDesignation.name.toLowerCase().trim()
    );
    if (isDuplicate)      {
      toast.error(`A designation with the name "${newDesignation.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await designationService.createDesignation({
        name: newDesignation.name,
        departmentId: newDesignation.departmentId
      });
      if (response.success) {
        setDesignations([...designations, response.data]);
        setNewDesignation({ name: "", departmentId: null });
        setIsCreateDesignationOpen(false);
        toast.success('Designation created successfully');
      } else {
        toast.error(response.message || 'Failed to create designation');
      }
    } catch (error) {
      toast.error('Error creating designation');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteDesignation = async (id) => {
    try {
      setLocalLoading(true);
      const response = await designationService.deleteDesignation(id);
      if (response.success) {
        setDesignations(designations.filter((desig) => desig.id !== id));
        toast.success('Designation deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete designation');
      }
    } catch (error) {
      toast.error('Error deleting designation');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditDesignation = (designation) => {
    setEditingDesignation(designation);
    setNewDesignation(designation);
    setIsCreateDesignationOpen(true);
  };

  const handleUpdateDesignation = async () => {
    if (!newDesignation.name || !newDesignation.departmentId) {
      toast.error('Designation name and department are required');
      return;
    }
    const isDuplicate = designations.some(
      des => des.name.toLowerCase().trim() === newDesignation.name.toLowerCase().trim() && des.id !== editingDesignation.id
    );
    if (isDuplicate) {
      toast.error(`A designation with the name "${newDesignation.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await designationService.updateDesignation(editingDesignation.id, {
        name: newDesignation.name,
        departmentId: newDesignation.departmentId
      });
      if (response.success) {
        setDesignations(designations.map(desig =>
          desig.id === editingDesignation.id ? response.data : desig
        ));
        setIsCreateDesignationOpen(false);
        setEditingDesignation(null);
        setNewDesignation({ name: "", departmentId: null });
        toast.success('Designation updated successfully');
      } else {
        toast.error(response.message || 'Failed to update designation');
      }
    } catch (error) {
      toast.error('Error updating designation');
    } finally {
      setLocalLoading(false);
    }
  };

  const filteredDesignations = designations.filter(designation =>
    designation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departments.find(dept => dept.id === designation.departmentId)?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setIsCreateDesignationOpen(true)}
          disabled={localLoading}
        >
          <Plus className="mr-2" size={20} />
          Create Designation
        </button>
      </div>
      {!localLoading && filteredDesignations.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No designations found</p>
        </div>
      )}
      {localLoading && filteredDesignations.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading designations...</p>
        </div>
      )}
      {!localLoading && filteredDesignations.length > 0 && (
        <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Department</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
            {filteredDesignations.map((designation, index) => (
              <tr key={designation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">{designation.name}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">
                  {departments.find((dept) => dept.id === designation.departmentId)?.name || 'N/A'}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                  <button
                    onClick={() => handleEditDesignation(designation)}
                    className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                    disabled={localLoading}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteDesignation(designation.id)}
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
      {isCreateDesignationOpen && (
        <Modal
          darkMode={darkMode}
          isOpen={isCreateDesignationOpen}
          onClose={() => {
            setIsCreateDesignationOpen(false);
            setEditingDesignation(null);
            setNewDesignation({ name: "", departmentId: null });
          }}
          title={editingDesignation ? "Edit Designation" : "Create Designation"}
          onSubmit={editingDesignation ? handleUpdateDesignation : handleCreateDesignation}
          submitText={editingDesignation ? "Update" : "Save"}
          onCancel={() => {
            setIsCreateDesignationOpen(false);
            setEditingDesignation(null);
            setNewDesignation({ name: "", departmentId: null });
          }}
        >
          <input
            type="text"
            value={newDesignation.name}
            onChange={(e) => setNewDesignation({ ...newDesignation, name: e.target.value })}
            placeholder="Designation Name"
            className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
          />
          <select
            value={newDesignation.departmentId || ""}
            onChange={(e) => setNewDesignation({ ...newDesignation, departmentId: Number(e.target.value) })}
            className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </Modal>
      )}
    </div>
  );
}