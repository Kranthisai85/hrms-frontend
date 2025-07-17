import { Edit, Plus, Trash } from "lucide-react";
import toast from 'react-hot-toast';
import { branchService } from "../../../services/api";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useState } from "react";

export default function BranchTable({ darkMode, branches, searchTerm, setSearchTerm, loading, setBranches }) {
  const [isCreateBranchOpen, setIsCreateBranchOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [newBranch, setNewBranch] = useState({ name: "", address: "" });
  const [localLoading, setLocalLoading] = useState(false);

  const handleCreateBranch = async () => {
    if (!newBranch.name) {
      toast.error('Branch name is required');
      return;
    }
    const isDuplicate = branches.some(
      branch => branch.name.toLowerCase() === newBranch.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A branch with the name "${newBranch.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await branchService.createBranch({
        name: newBranch.name,
        address: newBranch.address || 'No Address Provided',
        companyId: 1
      });
      if (response.success) {
        setBranches([...branches, response.data]);
        setNewBranch({ name: "", address: "" });
        setIsCreateBranchOpen(false);
        toast.success('Branch created successfully');
      } else {
        toast.error(response.message || 'Failed to create branch');
      }
    } catch (error) {
      toast.error('Error creating branch');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteBranch = async (id) => {
    try {
      setLocalLoading(true);
      const response = await branchService.deleteBranch(id);
      if (response.success) {
        setBranches(branches.filter((branch) => branch.id !== id));
        toast.success('Branch deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete branch');
      }
    } catch (error) {
      toast.error('Error deleting branch');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setNewBranch(branch);
    setIsCreateBranchOpen(true);
  };

  const handleUpdateBranch = async () => {
    if (!newBranch.name) {
      toast.error('Branch name is required');
      return;
    }
    const isDuplicate = branches.some(
      branch => branch.name.toLowerCase() === newBranch.name.toLowerCase().trim() && branch.id !== editingBranch.id
    );
    if (isDuplicate) {
      toast.error(`A branch with the name "${newBranch.name}" already exists.`);
      return;
    }
    try {
      setLocalLoading(true);
      const response = await branchService.updateBranch(editingBranch.id, {
        name: newBranch.name,
        address: newBranch.address || 'No Address Provided'
      });
      if (response.success) {
        setBranches(branches.map((branch) =>
          branch.id === editingBranch.id ? response.data : branch
        ));
        setIsCreateBranchOpen(false);
        setEditingBranch(null);
        setNewBranch({ name: "", address: "" });
        toast.success('Branch updated successfully');
      } else {
        toast.error(response.message || 'Failed to update branch');
      }
    } catch (error) {
      toast.error('Error updating branch');
    } finally {
      setLocalLoading(false);
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${loading || localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setIsCreateBranchOpen(true)}
          disabled={loading || localLoading}
        >
          <Plus className="mr-2" size={20} />
          {loading || localLoading ? 'Loading...' : 'Create Branch'}
        </button>
      </div>
      {loading && filteredBranches.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading branches...</p>
        </div>
      )}
      {!loading && filteredBranches.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No branches found</p>
        </div>
      )}
      {!loading && filteredBranches.length > 0 && (
        <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Address</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
            {filteredBranches.map((branch, index) => (
              <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">{branch.name}</td>
                <td className="px-6 py-2 whitespace-nowrap border-b">{branch.address}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                    disabled={loading || localLoading}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteBranch(branch.id)}
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
      {isCreateBranchOpen && (
        <Modal
          darkMode={darkMode}
          isOpen={isCreateBranchOpen}
          onClose={() => {
            setIsCreateBranchOpen(false);
            setEditingBranch(null);
            setNewBranch({ name: '', address: '' });
          }}
          title={editingBranch ? "Edit Branch" : "Create Branch"}
          onSubmit={editingBranch ? handleUpdateBranch : handleCreateBranch}
          submitText={editingBranch ? "Update" : "Save"}
          onCancel={() => {
            setIsCreateBranchOpen(false);
            setEditingBranch(null);
            setNewBranch({ name: '', address: '' });
          }}
        >
          <input
            type="text"
            value={newBranch.name}
            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            placeholder="Branch Name"
            className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
          />
          <input
            type="text"
            value={newBranch.address}
            onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
            placeholder="Branch Address"
            className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
          />
        </Modal>
      )}
    </div>
  );
}