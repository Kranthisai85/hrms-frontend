import { Edit, Plus, Trash } from "lucide-react";
import toast from 'react-hot-toast';
import { subDepartmentService } from "../../../services/api";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useState } from "react";

export default function SubDepartmentTable({ darkMode, subDepartments, departments, searchTerm, setSearchTerm, setSubDepartments }) {
  const [isCreateSubDepartmentOpen, setIsCreateSubDepartmentOpen] = useState(false);
  const [editingSubDepartment, setEditingSubDepartment] = useState(null);
  const [newSubDepartment, setNewSubDepartment] = useState({ name: "", departmentId: null });
  const [localLoading, setLocalLoading] = useState(false);

  const handleCreateSubDepartment = async () => {
    if (!newSubDepartment.name || !newSubDepartment.departmentId) {
      toast.error('Sub-department name and department are required');
      return;
    }
    const isDuplicate = subDepartments.some(
      sub => sub.name.toLowerCase().trim() === newSubDepartment.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A sub-department with the name "${newSubDepartment.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await subDepartmentService.createSubDepartment({
        name: newSubDepartment.name,
        departmentId: newSubDepartment.departmentId
      });
      if (response.success) {
        setSubDepartments([...subDepartments, response.data]);
        setNewSubDepartment({ name: "", departmentId: null });
        setIsCreateSubDepartmentOpen(false);
        toast.success('Sub-department created successfully');
      } else {
        toast.error(response.message || 'Failed to create sub-department');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error creating sub-department');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteSubDepartment = async (id) => {
    try {
      setLocalLoading(true);
      const response = await subDepartmentService.deleteSubDepartment(id);
      if (response.success) {
        setSubDepartments(subDepartments.filter((subDept) => subDept.id !== id));
        toast.success('Sub-department deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete sub-department');
      }
    } catch (error) {
      toast.error('Error deleting sub-department');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditSubDepartment = (subDepartment) => {
    setEditingSubDepartment(subDepartment);
    setNewSubDepartment(subDepartment);
    setIsCreateSubDepartmentOpen(true);
  };

  const handleUpdateSubDepartment = async () => {
    if (!newSubDepartment.name || !newSubDepartment.departmentId) {
      toast.error('Sub-department name and department are required');
      return;
    }
    const isDuplicate = subDepartments.some(
      sub => sub.name.toLowerCase().trim() === newSubDepartment.name.toLowerCase().trim() && sub.id !== editingSubDepartment.id
    );
    if (isDuplicate) {
      toast.error(`A sub-department with the name "${newSubDepartment.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await subDepartmentService.updateSubDepartment(editingSubDepartment.id, {
        name: newSubDepartment.name,
        departmentId: newSubDepartment.departmentId
      });
      if (response.success) {
        setSubDepartments(subDepartments.map((subDept) =>
          subDept.id === editingSubDepartment.id ? response.data : subDept
        ));
        setIsCreateSubDepartmentOpen(false);
        setEditingSubDepartment(null);
        setNewSubDepartment({ name: "", departmentId: null });
        toast.success('Sub-department updated successfully');
      } else {
        toast.error(response.message || 'Failed to update sub-department');
      }
    } catch (error) {
      toast.error('Error updating sub-department');
    } finally {
      setLocalLoading(false);
    }
  };

  const filteredSubDepartments = subDepartments.filter(subDepartment =>
    subDepartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departments.find(dept => (dept.id === subDepartment.department_id || dept.id === subDepartment.departmentId))?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setIsCreateSubDepartmentOpen(true)}
          disabled={localLoading}
        >
          <Plus className="mr-2" size={20} />
          Create Sub-Department
        </button>
      </div>
      {!localLoading && filteredSubDepartments.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No sub-departments found</p>
        </div>
      )}
      {localLoading && filteredSubDepartments.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading sub-departments...</p>
        </div>
      )}
      {!localLoading && filteredSubDepartments.length > 0 && (
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
            {filteredSubDepartments.map((subDepartment, index) => (
              <tr key={subDepartment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">{subDepartment.name}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">
                  {departments.find((dept) => (dept.id === subDepartment.department_id || dept.id === subDepartment.departmentId))?.name || 'N/A'}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                  <button
                    onClick={() => handleEditSubDepartment(subDepartment)}
                    className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                    disabled={localLoading}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubDepartment(subDepartment.id)}
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
      {isCreateSubDepartmentOpen && (
        <Modal
          darkMode={darkMode}
          isOpen={isCreateSubDepartmentOpen}
          onClose={() => {
            setIsCreateSubDepartmentOpen(false);
            setEditingSubDepartment(null);
            setNewSubDepartment({ name: "", departmentId: null });
          }}
          title={editingSubDepartment ? "Edit Sub-Department" : "Create Sub-Department"}
          onSubmit={editingSubDepartment ? handleUpdateSubDepartment : handleCreateSubDepartment}
          submitText={editingSubDepartment ? "Update" : "Save"}
          onCancel={() => {
            setIsCreateSubDepartmentOpen(false);
            setEditingSubDepartment(null);
            setNewSubDepartment({ name: "", departmentId: null });
          }}
        >
          <input
            type="text"
            value={newSubDepartment.name}
            onChange={(e) => setNewSubDepartment({ ...newSubDepartment, name: e.target.value })}
            placeholder="Sub-Department Name"
            className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
          />
          <select
            value={newSubDepartment.departmentId || ""}
            onChange={(e) => setNewSubDepartment({ ...newSubDepartment, departmentId: Number(e.target.value) })}
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