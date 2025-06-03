'use client'

import { useState } from 'react'
import { ChevronLeft, MoreVertical, Plus, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function SuperAdmin({ darkMode }) {
  const [organizations, setOrganizations] = useState([
    {
      id: '60027689316',
      name: 'Paytiemp Smartech Solutions',
      logo: '/placeholder.svg',
      type: 'STANDARD',
      createdDate: '06/03/2024',
      edition: 'India',
      role: 'admin'
    }
  ])

  const [showDropdown, setShowDropdown] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateOrganizationOpen, setIsCreateOrganizationOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    logo: null,
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    pan: '',
    gstin: '',
    cin: '',
    tan: '',
    incorporation_date: '',
    business_type: '',
    industry: ''
  })

  const itemsPerPage = 4
  const totalPages = Math.ceil(organizations.length / itemsPerPage)

  const currentOrganizations = organizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateOrganization = (e) => {
    e.preventDefault()
    const newOrg = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      type: 'STANDARD',
      createdDate: new Date().toLocaleDateString(),
      edition: 'India',
      role: 'admin'
    }
    setOrganizations([...organizations, newOrg])
    handleCreateOrganizationClose()
  }

  const handleCreateOrganizationClose = () => {
    setIsCreateOrganizationOpen(false)
    setFormData({
      name: '',
      code: '',
      logo: null,
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      phone: '',
      email: '',
      website: '',
      pan: '',
      gstin: '',
      cin: '',
      tan: '',
      incorporation_date: '',
      business_type: '',
      industry: ''
    })
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/dashboard" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} flex items-center gap-1`}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <button
            onClick={() => setIsCreateOrganizationOpen(true)}
            className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded flex items-center`}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Organization
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Hi, Solutions!</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            You are a part of the following organizations. Go to the organization
            which you wish to access now.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentOrganizations.map((org) => (
            <div key={org.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16">
                    <Image
                      src={org.logo}
                      alt={org.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">{org.name}</h2>
                      <span className={`px-2 py-1 text-xs ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'} rounded`}>
                        {org.type}
                      </span>
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Organization created on {org.createdDate}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Organization ID: {org.id}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Edition: {org.edition}
                    </div>
                    <div className="text-sm">
                      You are an <span className="font-medium">{org.role}</span> in this organization
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/organization/${org.id}`}
                    className={`px-4 py-2 border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded`}
                  >
                    Go to Organization
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(org.id === showDropdown ? null : org.id)}
                      className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {showDropdown === org.id && (
                      <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg z-10`}>
                        <button className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          Edit Organization
                        </button>
                        <button className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}>
                          Delete Organization
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            Page {currentPage} of {totalPages} ({organizations.length} Organizations)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
            >
              <ChevronLeft size={12} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800')}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {isCreateOrganizationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-6 w-full max-w-2xl`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Organization</h2>
              <button onClick={() => setIsCreateOrganizationOpen(false)} className={`${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateOrganization} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Organization Name*</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="code" className="block text-sm font-medium mb-1">Organization Code*</label>
                  <input
                    id="code"
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="business_type" className="block text-sm font-medium mb-1">Business Type</label>
                  <input
                    id="business_type"
                    type="text"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium mb-1">Industry</label>
                  <input
                    id="industry"
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium mb-1">Organization Logo</label>
                  <input
                    id="logo"
                    type="file"
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium mb-1">Pincode</label>
                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium mb-1">Website</label>
                  <input
                    id="website"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pan" className="block text-sm font-medium mb-1">PAN</label>
                  <input
                    id="pan"
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="gstin" className="block text-sm font-medium mb-1">GSTIN</label>
                  <input
                    id="gstin"
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="cin" className="block text-sm font-medium mb-1">CIN</label>
                  <input
                    id="cin"
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="tan" className="block text-sm font-medium mb-1">TAN</label>
                  <input
                    id="tan"
                    type="text"
                    name="tan"
                    value={formData.tan}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="incorporation_date" className="block text-sm font-medium mb-1">Incorporation Date</label>
                  <input
                    id="incorporation_date"
                    type="date"
                    name="incorporation_date"
                    value={formData.incorporation_date}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOrganizationOpen(false)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

