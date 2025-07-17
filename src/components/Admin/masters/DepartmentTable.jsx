import { Edit, Plus, Trash } from "lucide-react";
import toast from 'react-hot-toast';
import { departmentService } from "../../../services/api";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useState } from "react";

export default function DepartmentTable({ darkMode, departments, searchTerm, setSearchTerm, loading, setDepartments }) {
  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({ name: "" });
  const [localLoading, setLocalLoading] = useState(false);

  const handleCreateDepartment = async () => {
    if (!newDepartment.name) {
      toast.error('Department name is required');
      return;
    }
    const isDuplicate = departments.some(
      dept => dept.name.toLowerCase().trim() === newDepartment.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A department with the name "${newDepartment.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await departmentService.createDepartment({
        name: newDepartment.name,
      });
      if (response.success) {
        setDepartments([...departments, response.data]);
        setNewDepartment({ name: "" });
        setIsCreateDepartmentOpen(false);
        toast.success('Department created successfully');
      } else {
        toast.error(response.message || 'Failed to create department');
      }
    } catch (error) {
      toast.error('Error creating department');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      setLocalLoading(true);
      const response = await departmentService.deleteDepartment(id);
      if (response.success) {
        setDepartments(departments.filter((dept) => dept.id !== id));
        toast.success('Department deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete department');
      }
    } catch (error) {
      toast.error('Error deleting department');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setNewDepartment(department);
    setIsCreateDepartmentOpen(true);
  };

  const handleUpdateDepartment = async () => {
    if (!newDepartment.name) {
      toast.error('Department name is required');
      return;
    }
    const isDuplicate = departments.some(
      dept => dept.name.toLowerCase().trim() === newDepartment.name.toLowerCase().trim() && dept.id !== editingDepartment.id
    );
    if (isDuplicate) {
      toast.error(`A department with the name "${newDepartment.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await departmentService.updateDepartment(editingDepartment.id, {
        name: newDepartment.name
      });
      if (response.success) {
        setDepartments(departments.map((dept) =>
          dept.id === editingDepartment.id ? response.data : dept
        ));
        setIsCreateDepartmentOpen(false);
        setEditingDepartment(null);
        setNewDepartment({ name: "" });
        toast.success('Department updated successfully');
      } else {
        toast.error(response.message || 'Failed to update department');
      }
    } catch (error) {
      toast.error('Error updating department');
    } finally {
      setLocalLoading(false);
    }
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${loading || localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setIsCreateDepartmentOpen(true)}
          disabled={loading || localLoading}
        >
          <Plus className="mr-2" size={20} />
          {loading || localLoading ? 'Loading...' : 'Create Department'}
        </button>
      </div>
      {loading && filteredDepartments.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading departments...</p>
        </div>
      )}
      {!loading && filteredDepartments.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No departments found</p>
        </div>
      )}
      {!loading && filteredDepartments.length > 0 && (
        <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
            {filteredDepartments.map((department, index) => (
              <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">{department.name}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                  <button
                    onClick={() => handleEditDepartment(department)}
                    className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                    disabled={loading || localLoading}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(department.id)}
                    className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                    disabled={loading || localLoading}
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isCreateDepartmentOpen && (
        <Modal
          darkMode={darkMode}
          isOpen={isCreateDepartmentOpen}
          onClose={() => {
            setIsCreateDepartmentOpen(false);
            setEditingDepartment(null);
            setNewDepartment({ name: '' });
          }}
          title={editingDepartment ? 'Edit Department' : 'Create Department'}
          onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
          submitText={editingDepartment ? 'Update' : 'Save'}
          onCancel={() => {
            setIsCreateDepartmentOpen(false);
            setEditingDepartment(null);
            setNewDepartment({ name: '' });
          }}
        >
          <input
            type="text"
            value={newDepartment.name}
            onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            placeholder="Department Name"
            className={`w-full p-2 border rounded mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
          />
        </Modal>
      )}
    </div>
  );
}