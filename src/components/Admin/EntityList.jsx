import React, { useState } from 'react'

export default function EntityList({ entities, onEdit, onDelete, fields }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const handleEdit = (entity) => {
    setEditingId(entity.id)
    setEditForm(entity)
  }

  const handleSave = () => {
    onEdit(editingId, editForm)
    setEditingId(null)
    setEditForm({})
  }

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  return (
    <ul className="divide-y divide-gray-200">
      {entities.map(entity => (
        <li key={entity.id} className="py-4 flex justify-between items-center">
          {editingId === entity.id ? (
            <div className="flex space-x-2">
              {fields.map(field => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={editForm[field] || ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              ))}
              <button onClick={handleSave} className="text-indigo-600 hover:text-indigo-900">
                Save
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              {fields.map(field => (
                <span key={field}>{entity[field]}</span>
              ))}
            </div>
          )}
          <div className="flex space-x-2">
            {editingId !== entity.id && (
              <button onClick={() => handleEdit(entity)} className="text-indigo-600 hover:text-indigo-900">
                Edit
              </button>
            )}
            <button onClick={() => onDelete(entity.id)} className="text-red-600 hover:text-red-900">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}