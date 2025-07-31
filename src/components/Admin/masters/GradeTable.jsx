import { Edit, Plus, Trash } from "lucide-react";
import toast from 'react-hot-toast';
import { gradesService } from "../../../services/api";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useState } from "react";

export default function GradeTable({ darkMode, grades, searchTerm, setSearchTerm, setGrades }) {
  const [isCreateGradeOpen, setIsCreateGradeOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [newGrade, setNewGrade] = useState({ name: "" });
  const [localLoading, setLocalLoading] = useState(false);

  const handleCreateGrade = async () => {
    if (!newGrade.name) {
      toast.error('Grade name is required');
      return;
    }
    const isDuplicate = grades.some(
      grade => grade.name.toLowerCase().trim() === newGrade.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A grade with the name "${newGrade.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await gradesService.createGrade({
        name: newGrade.name
      });
      if (response.success) {
        setGrades([...grades, response.data]);
        setNewGrade({ name: "" });
        setIsCreateGradeOpen(false);
        toast.success('Grade created successfully');
      } else {
        toast.error(response.message || 'Failed to create grade');
      }
    } catch (error) {
      toast.error('Error creating grade');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteGrade = async (id) => {
    try {
      setLocalLoading(true);
      const response = await gradesService.deleteGrade(id);
      if (response.success) {
        setGrades(grades.filter((grade) => grade.id !== id));
        toast.success('Grade deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete grade');
      }
    } catch (error) {
      toast.error('Error deleting grade');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setNewGrade(grade);
    setIsCreateGradeOpen(true);
  };

  const handleUpdateGrade = async () => {
    if (!newGrade.name) {
      toast.error('Grade name is required');
      return;
    }
    const isDuplicate = grades.some(
      grade => grade.name.toLowerCase().trim() === newGrade.name.toLowerCase().trim() && grade.id !== editingGrade.id
    );
    if (isDuplicate) {
      toast.error(`A grade with the name "${newGrade.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await gradesService.updateGrade(editingGrade.id, {
        name: newGrade.name
      });
      if (response.success) {
        setGrades(grades.map((grade) => (
          grade.id === editingGrade.id ? response.data : grade
        )));
        setIsCreateGradeOpen(false);
        setEditingGrade(null);
        setNewGrade({ name: "" });
        toast.success('Grade updated successfully');
      } else {
        toast.error(response.message || 'Failed to update grade');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error updating grade');
    } finally {
      setLocalLoading(false);
    }
  };

  const filteredGrades = grades.filter(grade =>
    grade.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setIsCreateGradeOpen(true)}
          disabled={localLoading}
        >
          <Plus className="mr-2" size={20} />
          Create Grade
        </button>
      </div>
      {!localLoading && filteredGrades.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No grades found</p>
        </div>
      )}
      {localLoading && filteredGrades.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading grades...</p>
        </div>
      )}
      {!localLoading && filteredGrades.length > 0 && (
        <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
            {filteredGrades.map((grade, index) => (
              <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">{grade.name}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                  <button
                    onClick={() => handleEditGrade(grade)}
                    className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                    disabled={localLoading}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteGrade(grade.id)}
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
      {isCreateGradeOpen && (
        <Modal
          darkMode={darkMode}
          isOpen={isCreateGradeOpen}
          onClose={() => {
            setIsCreateGradeOpen(false);
            setEditingGrade(null);
            setNewGrade({ name: "" });
          }}
          title={editingGrade ? "Edit Grade" : "Create Grade"}
          onSubmit={editingGrade ? handleUpdateGrade : handleCreateGrade}
          submitText={editingGrade ? "Update" : "Save"}
          onCancel={() => {
            setIsCreateGradeOpen(false);
            setEditingGrade(null);
            setNewGrade({ name: "" });
          }}
        >
          <input
            type="text"
            value={newGrade.name}
            onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
            placeholder="Grade Name"
            className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
          />
        </Modal>
      )}
    </div>
  );
}