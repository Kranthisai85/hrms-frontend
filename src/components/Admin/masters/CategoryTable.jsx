import { Edit, Plus, Trash } from "lucide-react";
import toast from 'react-hot-toast';
import { categoryService } from "../../../services/api";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useState } from "react";

export default function CategoryTable({ darkMode, categories, searchTerm, setSearchTerm, setCategories }) {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [localLoading, setLocalLoading] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }
    const isDuplicate = categories.some(
      category => category.name.toLowerCase().trim() === newCategory.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A category with the name "${newCategory.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await categoryService.createCategory({
        name: newCategory.name
      });
      if (response.success) {
        setCategories([...categories, response.data]);
        setNewCategory({ name: "" });
        setIsCreateCategoryOpen(false);
        toast.success('Category created successfully');
      } else {
        toast.error(response.message || 'Failed to create category');
      }
    } catch (error) {
      toast.error('Error creating category');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setLocalLoading(true);
      const response = await categoryService.deleteCategory(id);
      if (response.success) {
        setCategories(categories.filter((category) => category.id !== id));
        toast.success('Category deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete category');
      }
    } catch (error) {
      toast.error('Error deleting category');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
    setIsCreateCategoryOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }
    const isDuplicate = categories.some(
      category => category.name.toLowerCase().trim() === newCategory.name.toLowerCase().trim() && category.id !== editingCategory.id
    );
    if (isDuplicate) {
      toast.error(`A category with the name "${newCategory.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await categoryService.updateCategory(editingCategory.id, {
        name: newCategory.name
      });
      if (response.success) {
        setCategories(categories.map((category) =>
          category.id === editingCategory.id ? response.data : category
        ));
        setIsCreateCategoryOpen(false);
        setEditingCategory(null);
        setNewCategory({ name: "" });
        toast.success('Category updated successfully');
      } else {
        toast.error(response.message || 'Failed to update category');
      }
    } catch (error) {
      toast.error('Error updating category');
    } finally {
      setLocalLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setIsCreateCategoryOpen(true)}
          disabled={localLoading}
        >
          <Plus className="mr-2" size={20} />
          Create Category
        </button>
      </div>
      {!localLoading && filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No categories found</p>
        </div>
      )}
      {localLoading && filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading categories...</p>
        </div>
      )}
      {!localLoading && filteredCategories.length > 0 && (
        <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
            {filteredCategories.map((category, index) => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">{category.name}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                    disabled={localLoading}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
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
      {isCreateCategoryOpen && (
        <Modal
          darkMode={darkMode}
          isOpen={isCreateCategoryOpen}
          onClose={() => {
            setIsCreateCategoryOpen(false);
            setEditingCategory(null);
            setNewCategory({ name: "" });
          }}
          title={editingCategory ? "Edit Category" : "Create Category"}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          submitText={editingCategory ? "Update" : "Save"}
          onCancel={() => {
            setIsCreateCategoryOpen(false);
            setEditingCategory(null);
            setNewCategory({ name: "" });
          }}
        >
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Category Name"
            className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
          />
        </Modal>
      )}
    </div>
  );
}