import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const initialRoles = [
  { id: 1, name: 'Super Admin', type: 'Super Admin', permissions: {} },
  { id: 2, name: 'Company Admin', type: 'Company Admin', permissions: {} },
  { id: 3, name: 'Client HR', type: 'Client HR', permissions: {} },
  { id: 4, name: 'Client Employee', type: 'Client Employee', permissions: {} },
];

const initialUsers = [
  { id: 1, name: 'John Doe', role: 'Super Admin', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', role: 'Company Admin', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', role: 'Client HR', email: 'bob@client.com' },
  { id: 4, name: 'Alice Brown', role: 'Client Employee', email: 'alice@client.com' },
];

const mainNavigation = [
  'Home',
  'Masters',
  'User Roles',
  'Hiring',
  'Employee',
  'Attendance',
  'Payroll',
  'Reports',
  'Assets',
  "Comm's",
  'Utilities'
];

const mastersNavigation = [
  'Enterprise',
  'Company',
  'Branch',
  'Department',
  'Designation',
  'SubDepartment',
  'Grade',
  'EmploymentType',
  'EmploymentStatus',
  'Custom1',
  'Custom2'
];

const userRolesNavigation = ['User', 'Roles'];

const createInitialPermissions = () => {
  return mainNavigation.reduce((acc, page) => ({
    ...acc,
    [page]: { all: false, create: false, view: false, edit: false, delete: false }
  }), {});
};

export default function UserRoles() {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState(initialRoles.map(role => ({
    ...role,
    permissions: role.permissions && Object.keys(role.permissions).length > 0 ? role.permissions : createInitialPermissions()
  })));
  const [users, setUsers] = useState(initialUsers);
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [editingRole, setEditingRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    type: '',
    permissions: createInitialPermissions(),
  });
  const [newUser, setNewUser] = useState({
    name: '',
    role: '',
    email: '',
  });
  const [expandedAccordions, setExpandedAccordions] = useState([]);

  const handleSelectAllForPage = (page) => {
    setNewRole(prevRole => {
      const currentAll = prevRole.permissions[page].all;
      return {
        ...prevRole,
        permissions: {
          ...prevRole.permissions,
          [page]: {
            all: !currentAll,
            create: !currentAll,
            view: !currentAll,
            edit: !currentAll,
            delete: !currentAll
          }
        }
      };
    });
  };

  const handleSelectAllPages = () => {
    const areAllSelected = Object.values(newRole.permissions).every(page => 
      Object.values(page).every(Boolean)
    );

    setNewRole(prevRole => {
      const newPermissions = {};
      Object.keys(prevRole.permissions).forEach(page => {
        newPermissions[page] = {
          all: !areAllSelected,
          create: !areAllSelected,
          view: !areAllSelected,
          edit: !areAllSelected,
          delete: !areAllSelected
        };
      });
      return {
        ...prevRole,
        permissions: newPermissions
      };
    });
  };

  const handleTogglePermission = (page, action) => {
    setNewRole(prevRole => {
      const updatedPermissions = {
        ...prevRole.permissions[page],
        [action]: !prevRole.permissions[page][action]
      };

      updatedPermissions.all = ['create', 'view', 'edit', 'delete'].every(
        a => updatedPermissions[a]
      );

      return {
        ...prevRole,
        permissions: {
          ...prevRole.permissions,
          [page]: updatedPermissions
        }
      };
    });
  };

  const handleSelectAllForAction = (action) => {
    setNewRole(prevRole => {
      const newPermissions = {};
      Object.keys(prevRole.permissions).forEach(page => {
        newPermissions[page] = {
          ...prevRole.permissions[page],
          [action]: !Object.values(prevRole.permissions).every(p => p[action])
        };
        newPermissions[page].all = ['create', 'view', 'edit', 'delete'].every(
          a => newPermissions[page][a]
        );
      });
      return {
        ...prevRole,
        permissions: newPermissions
      };
    });
  };

  const handleAddRole = () => {
    if (editingRole) {
      setRoles(roles.map(role => role.id === editingRole.id ? { ...editingRole, ...newRole } : role));
      setEditingRole(null);
    } else {
      setRoles([...roles, { id: roles.length + 1, ...newRole }]);
    }
    setShowAddRoleForm(false);
    setNewRole({
      name: '',
      type: '',
      permissions: createInitialPermissions(),
    });
  };

  const handleAddUser = () => {
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? { ...editingUser, ...newUser } : user));
      setEditingUser(null);
    } else {
      setUsers([...users, { id: users.length + 1, ...newUser }]);
    }
    setShowAddUserForm(false);
    setNewUser({ name: '', role: '', email: '' });
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setNewRole({
      ...role,
      permissions: role.permissions || createInitialPermissions(),
    });
    setShowAddRoleForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
    setShowAddUserForm(true);
  };

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return activeTab === 'roles' 
      ? roles.slice(indexOfFirstItem, indexOfLastItem)
      : users.slice(indexOfFirstItem, indexOfLastItem);
  }, [activeTab, currentPage, roles, users, itemsPerPage]);

  const totalItems = activeTab === 'roles' ? roles.length : users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleAccordion = (section) => {
    setExpandedAccordions(prev => 
      prev.includes(section) 
        ? prev.filter(item => item !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="mx-auto px-2 py-2">
      <h1 className="text-xl font-bold mb-6">User Roles and Permissions</h1>
      <div className="flex mb-4">
        <button
          className={`px-3 py-1 text-sm ${activeTab === 'roles' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-l hover:bg-blue-600 transition-colors duration-200`}
          onClick={() => { setActiveTab('roles'); setCurrentPage(1); }}
        >
          Roles
        </button>
        <button
          className={`px-3 py-1 text-sm ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-r hover:bg-blue-600 transition-colors duration-200`}
          onClick={() => { setActiveTab('users'); setCurrentPage(1); }}
        >
          Users
        </button>
      </div>

      {activeTab === 'roles' && (
        <div>
          <button
            className="px-3 py-1 text-sm bg-green-500 text-white rounded mb-4 flex items-center hover:bg-green-600 transition-colors duration-200"
            onClick={() => { setEditingRole(null); setShowAddRoleForm(true); }}
          >
            <Plus size={16} className="mr-1" /> Add Role
          </button>
          <table className="w-full bg-white shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((role) => (
                <tr key={role.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{role.id}</td>
                  <td className="px-4 py-2 text-sm">{role.name}</td>
                  <td className="px-4 py-2 text-sm">{role.type}</td>
                  <td className="px-4 py-2 text-sm">
                    <button className="mr-2 text-blue-500 hover:text-blue-700 transition-colors duration-200" onClick={() => handleEditRole(role)}><Pencil size={16} /></button>
                    <button className="text-red-500 hover:text-red-700 transition-colors duration-200" onClick={() => handleDeleteRole(role.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <button
            className="px-3 py-1 text-sm bg-green-500 text-white rounded mb-4 flex items-center hover:bg-green-600 transition-colors duration-200"
            onClick={() => { setEditingUser(null); setShowAddUserForm(true); }}
          >
            <Plus size={16} className="mr-1" /> Add User
          </button>
          <table className="w-full bg-white shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{user.id}</td>
                  <td className="px-4 py-2 text-sm">{user.name}</td>
                  <td className="px-4 py-2 text-sm">{user.email}</td>
                  <td className="px-4 py-2 text-sm">{user.role}</td>
                  <td className="px-4 py-2 text-sm">
                    <button className="mr-2 text-blue-500 hover:text-blue-700 transition-colors duration-200" onClick={() => handleEditUser(user)}><Pencil size={16} /></button>
                    <button className="text-red-500 hover:text-red-700 transition-colors duration-200" onClick={() => handleDeleteUser(user.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <div className="flex items-center space-x-2">
          <button 
            className="px-2 py-1 border rounded text-sm hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 border rounded text-sm ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'} transition-colors duration-200`}
            >
              {page}
            </button>
          ))}
          <button 
            className="px-2 py-1 border rounded text-sm hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {showAddRoleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-2/3 max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">{editingRole ? 'Edit Role' : 'Add Role'}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role Type</label>
                <select
                  value={newRole.type}
                  onChange={(e) => setNewRole({ ...newRole, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                >
                  <option value="">Select Role Type</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Company Admin">Company Admin</option>
                  <option value="Client HR">Client HR</option>
                  <option value="Client Employee">Client Employee</option>
                </select>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Permissions</h3>
            <div className="overflow-y-auto flex-grow">
              <table className="w-full mb-4">
                <thead className="sticky top-0 bg-white">
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          onChange={handleSelectAllPages}
                          checked={Object.values(newRole.permissions).every(page => page.all)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2">All</span>
                      </div>
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          onChange={() => handleSelectAllForAction('create')}
                          checked={Object.values(newRole.permissions).every(page => page.create)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2">Create</span>
                      </div>
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          onChange={() => handleSelectAllForAction('view')}
                          checked={Object.values(newRole.permissions).every(page => page.view)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2">View</span>
                      </div>
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          onChange={() => handleSelectAllForAction('edit')}
                          checked={Object.values(newRole.permissions).every(page => page.edit)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2">Edit</span>
                      </div>
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          onChange={() => handleSelectAllForAction('delete')}
                          checked={Object.values(newRole.permissions).every(page => page.delete)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2">Delete</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mainNavigation.map((page) => (
                    <React.Fragment key={page}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm flex items-center">
                          {(page === 'Masters' || page === 'User Roles') && (
                            <button
                              onClick={() => toggleAccordion(page)}
                              className="mr-2"
                            >
                              {expandedAccordions.includes(page) ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          )}
                          {page}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={newRole.permissions[page]?.all || false}
                            onChange={() => handleSelectAllForPage(page)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </td>
                        {['create', 'view', 'edit', 'delete'].map((action) => (
                          <td key={action} className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={newRole.permissions[page]?.[action] || false}
                              onChange={() => handleTogglePermission(page, action)}
                              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          </td>
                        ))}
                      </tr>
                      {page === 'Masters' && expandedAccordions.includes('Masters') && (
                        mastersNavigation.map(subPage => (
                          <tr key={subPage} className="bg-gray-50">
                            <td className="px-4 py-2 text-sm pl-8">{subPage}</td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={newRole.permissions[subPage]?.all || false}
                                onChange={() => handleSelectAllForPage(subPage)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              />
                            </td>
                            {['create', 'view', 'edit', 'delete'].map((action) => (
                              <td key={action} className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={newRole.permissions[subPage]?.[action] || false}
                                  onChange={() => handleTogglePermission(subPage, action)}
                                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                      {page === 'User Roles' && expandedAccordions.includes('User Roles') && (
                        userRolesNavigation.map(subPage => (
                          <tr key={subPage} className="bg-gray-50">
                            <td className="px-4 py-2 text-sm pl-8">{subPage}</td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={newRole.permissions[subPage]?.all || false}
                                onChange={() => handleSelectAllForPage(subPage)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              />
                            </td>
                            {['create', 'view', 'edit', 'delete'].map((action) => (
                              <td key={action} className="px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={newRole.permissions[subPage]?.[action] || false}
                                  onChange={() => handleTogglePermission(subPage, action)}
                                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={handleAddRole} 
                className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
              >
                Save
              </button>
              <button 
                onClick={() => { setShowAddRoleForm(false); setEditingRole(null); }} 
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => { setShowAddUserForm(false); setEditingUser(null); }} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={handleAddUser} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200">Save</button>
              <button onClick={() => { setShowAddUserForm(false); setEditingUser(null); }} className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}