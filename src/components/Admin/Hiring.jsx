'use client'

import React, { useState } from 'react'
import { Search, List, Grid, MapPin, Users, Calendar, Plus, MoreVertical, ArrowLeft, Upload, X, ChevronDown } from 'lucide-react'

const initialVacancies = [
  {
    id: 1,
    title: "JavaScript Developer",
    icon: "JS",
    location: "Salt Lake City",
    date: "Aug, 24 2023",
    applicants: 45,
    newApplicants: 2,
    status: "OPEN",
    department: "Development",
    trend: [10, 15, 12, 18, 14, 16, 20],
    recentApplicants: [
      "/placeholder.svg?height=32&width=32",
      "/placeholder.svg?height=32&width=32",
      "/placeholder.svg?height=32&width=32"
    ]
  },
  {
    id: 2,
    title: "Project Manager",
    icon: "PM",
    location: "Remote",
    date: "Aug, 24 2023",
    applicants: 99,
    newApplicants: 2,
    status: "COMPLETED",
    department: "Project Management",
    trend: [25, 30, 28, 35, 32, 38, 40],
    recentApplicants: [
      "/placeholder.svg?height=32&width=32",
      "/placeholder.svg?height=32&width=32"
    ]
  },
  {
    id: 3,
    title: "iOS App Developer",
    icon: "iOS",
    location: "Singapore",
    date: "Sep, 12 2023",
    applicants: 20,
    newApplicants: 2,
    status: "OPEN",
    department: "Development",
    trend: [15, 20, 18, 25, 22, 28, 30],
    recentApplicants: [
      "/placeholder.svg?height=32&width=32",
      "/placeholder.svg?height=32&width=32",
      "/placeholder.svg?height=32&width=32"
    ]
  }
]

const departments = [
  "Development",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations"
]

const employmentTypes = [
  { id: 'fullTime', label: 'Full Time' },
  { id: 'partTime', label: 'Part Time' },
  { id: 'contract', label: 'Contract' },
  { id: 'freelance', label: 'Freelance' },
  { id: 'remote', label: 'Remote' }
]

const educationLevels = [
  "Higher",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "No requirements"
]

const suitableForOptions = [
  { id: 'student', label: 'A student' },
  { id: 'veteran', label: 'A veteran' },
  { id: 'disabilities', label: 'A person with disabilities' }
]

export default function HiringDashboard() {
  const [viewMode, setViewMode] = useState('list')
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [vacancies, setVacancies] = useState(initialVacancies)
  const [filters, setFilters] = useState({
    department: 'All Department',
    position: 'All Positions',
    location: 'Any Location',
    experience: 'Any Experience'
  })
  const [showAddVacancy, setShowAddVacancy] = useState(false)
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    description: '',
    image: null,
    employmentTypes: [],
    locations: [],
    salary: '',
    currency: 'EUR',
    salaryType: 'Hourly',
    hiringMultiple: false,
    workExperience: 'no experience required',
    education: 'Higher',
    suitableFor: [],
    responsibilities: '',
    duties: '',
    status: '',
    openingDate: '',
    closingDate: '',
    contactPerson: '',
    contactPhone: '',
    additionalContact: '',
    showContacts: false
  })
  const [locationSearch, setLocationSearch] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-emerald-100 text-emerald-800'
      case 'COMPLETED':
        return 'bg-amber-100 text-amber-800'
      case 'IN PROGRESS':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderTrendGraph = (trend) => (
    <div className="flex items-end h-8 gap-0.5">
      {trend.map((value, index) => (
        <div
          key={index}
          className="w-1 bg-blue-500/20"
          style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
        />
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-4 text-sm font-medium text-gray-500">Position Title</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Location</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Applicants</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Publication</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500">Last 7 days</th>
            <th className="text-left p-4 text-sm font-medium text-gray-500"></th>
          </tr>
        </thead>
        <tbody>
          {vacancies.map((vacancy) => (
            <tr key={vacancy.id} className="border-b border-gray-200">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center font-medium">
                    {vacancy.icon}
                  </div>
                  <span className="font-medium">{vacancy.title}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {vacancy.location}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  {vacancy.applicants}
                  {vacancy.newApplicants > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      +{vacancy.newApplicants} new
                    </span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vacancy.status)}`}>
                  {vacancy.status}
                </span>
              </td>
              <td className="p-4 text-gray-500">{vacancy.date}</td>
              <td className="p-4">{renderTrendGraph(vacancy.trend)}</td>
              <td className="p-4">
                <button className="p-2 rounded-lg hover:bg-gray-50">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 flex items-center justify-between border-t border-gray-200">
        <span className="text-sm text-gray-500">Show 1 to 8 of 50 entries</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border rounded">1</button>
        </div>
      </div>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vacancies.map((vacancy) => (
        <div key={vacancy.id} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center font-medium">
                {vacancy.icon}
              </div>
              <div>
                <h3 className="font-medium">{vacancy.title}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {vacancy.location}
                </div>
              </div>
            </div>
            <button className="p-1 rounded hover:bg-gray-50">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{vacancy.applicants} Appls</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vacancy.status)}`}>
              {vacancy.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {vacancy.recentApplicants.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt={`Recent applicant ${i + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
            {vacancy.newApplicants > 0 && (
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                +{vacancy.newApplicants} new
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  const addLocation = (location) => {
    if (location && !formData.locations.includes(location)) {
      setFormData({
        ...formData,
        locations: [...formData.locations, location]
      })
      setLocationSearch('')
    }
  }

  const removeLocation = (location) => {
    setFormData({
      ...formData,
      locations: formData.locations.filter(loc => loc !== location)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add form submission logic here
    console.log(formData)
    // After submission, you might want to add the new vacancy to the vacancies state
    // and return to the dashboard view
    setShowAddVacancy(false)
  }

  const renderAddVacancyForm = () => (
    <div className="h-full bg-white">
      <div className="border-b">
        <div className="max-w-8xl mx-auto px-2 py-1 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Create Vacancy</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddVacancy(false)}
              className="flex items-center px-4 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              form="vacancy-form"
              className="px-4 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <form id="vacancy-form" onSubmit={handleSubmit} className="max-w-8xl mx-auto px-2 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Left Column */}
          <div className="space-y-2">
            <section className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <button
                  type="button"
                  className="flex items-center px-4 py-1 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JOB TITLE
                  </label>
                  <input
                    type="text"
                    placeholder="Add position name"
                    className="w-full p-2.5 border rounded-lg"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JOB DEPARTMENT
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-2.5 border rounded-lg appearance-none bg-white"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="">Choose Category</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JOB DESCRIPTION
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter job description"
                    className="w-full p-2.5 border rounded-lg"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    For effective candidate selection, enhance the job description with comprehensive details
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    EMPLOYMENT TYPE
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Pick one or multiple options</p>
                  <div className="flex flex-wrap gap-3">
                    {employmentTypes.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600"
                          checked={formData.employmentTypes.includes(type.id)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...formData.employmentTypes, type.id]
                              : formData.employmentTypes.filter(t => t !== type.id)
                            setFormData({ ...formData, employmentTypes: types })
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JOB LOCATIONS
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Choose multiple options if available</p>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search for Location"
                      className="w-full pl-10 pr-4 py-1.5 border rounded-lg"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addLocation(locationSearch)
                        }
                      }}
                    />
                  </div>
                  {formData.locations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.locations.map((location) => (
                        <span
                          key={location}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-sm"
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {location}
                          <button
                            type="button"
                            onClick={() => removeLocation(location)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SALARY
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Choose how you prefer for this job</p>
                  <div className="flex gap-2">
                    <select
                      className="w-24 p-2.5 border rounded-lg"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Salary"
                      className="flex-1 p-2.5 border rounded-lg"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                    <select
                      className="w-32 p-2.5 border rounded-lg"
                      value={formData.salaryType}
                      onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
                    >
                      <option value="Hourly">Hourly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      checked={formData.hiringMultiple}
                      onChange={(e) => setFormData({ ...formData, hiringMultiple: e.target.checked })}
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Yes, I am hiring multiple candidates
                    </span>
                  </label>
                  <p className="mt-1 text-sm text-gray-500 ml-6">
                    This will be displayed on job page
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Dates and Status</h2>
              <p className="text-sm text-gray-500 mb-6">
                This section provides a snapshot of when the vacancy opened, any closing date (if applicable), and its current status in the hiring process
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VACANCY STATUS
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-2.5 border rounded-lg appearance-none bg-white"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="">Choose Status</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="closed">Closed</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Choose current stage</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OPENING & CLOSING DATE
                  </label>
                  <p className="text-sm text-gray-500 mb-2">(if applicable)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      className="p-2.5 border rounded-lg"
                      value={formData.openingDate}
                      onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                    />
                    <input
                      type="date"
                      className="p-2.5 border rounded-lg"
                      value={formData.closingDate}
                      onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <section className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Applicant requirements</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WORK EXPERIENCE
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Provide details about experience</p>
                  <div className="relative">
                    <select
                      className="w-full p-2.5 border rounded-lg appearance-none bg-white"
                      value={formData.workExperience}
                      onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                    >
                      <option value="no experience required">no experience required</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    EDUCATION
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Select Education</p>
                  <div className="relative">
                    <select
                      className="w-full p-2.5 border rounded-lg appearance-none bg-white"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    >
                      {educationLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    THE JOB IS SUITABLE FOR:
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Pick one or multiple options</p>
                  <div className="space-y-2 space-x-2">
                    {suitableForOptions.map((option) => (
                      <label key={option.id} className="flex-row items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600"
                          checked={formData.suitableFor.includes(option.id)}
                          onChange={(e) => {
                            const selected = e.target.checked
                              ? [...formData.suitableFor, option.id]
                              : formData.suitableFor.filter(id => id !== option.id)
                            setFormData({ ...formData, suitableFor: selected })
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RESPONSIBILITIES
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Main tasks that the candidate will be accountable for in this role:
                  </p>
                  <textarea
                    rows={4}
                    className="w-full p-2.5 border rounded-lg"
                    placeholder="Performing tasks related to...&#10;Organizing and coordinating...&#10;Analyzing and optimizing..."
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DUTIES
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    specific tasks and actions that the candidate will be responsible for on a day-to-day basis
                  </p>
                  <textarea
                    rows={4}
                    className="w-full p-2.5 border rounded-lg"
                    placeholder="Planning and executing...&#10;Ensuring the efficient functioning of...&#10;Supporting processes..."
                    value={formData.duties}
                    onChange={(e) => setFormData({ ...formData, duties: e.target.value })}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CONTACT PERSON
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Person to contact for inquiries</p>
                  <input
                    type="text"
                    placeholder="Position name"
                    className="w-full p-2.5 border rounded-lg"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CONTACT PHONE
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Phone for inquiries</p>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="w-full p-2.5 border rounded-lg"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ADDITIONAL CONTACT
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Extra contact info if needed</p>
                  <input
                    type="text"
                    placeholder="Skype, whatsapp, etc"
                    className="w-full p-2.5 border rounded-lg"
                    value={formData.additionalContact}
                    onChange={(e) => setFormData({ ...formData, additionalContact: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      checked={formData.showContacts}
                      onChange={(e) => setFormData({ ...formData, showContacts: e.target.checked })}
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Show the name and phone number on this job page
                    </span>
                  </label>
                  <p className="mt-1 text-sm text-gray-500 ml-6">
                    This will be displayed on job page
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  )

  if (showAddVacancy) {
    return renderAddVacancyForm()
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-8xl mx-auto p-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Vacancies</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
              className="p-2 rounded-lg bg-white border border-gray-200"
            >
              {viewMode === 'list' ? <Grid className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button >
            <button className="flex items-center gap-2 px-4 py-1 bg-white border border-gray-200 rounded-lg text-gray-700">
              <Calendar className="w-5 h-5" />
              Import
            </button>
            <button 
              onClick={() => setShowAddVacancy(true)}
              className="flex items-center gap-2 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Vacancy
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, position"
                  className="w-full pl-10 pr-4 py-1 rounded-lg bg-white border border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex rounded-lg bg-white border border-gray-200">
                {['all', 'open', 'completed', 'in-progress'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-1 ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    } rounded-lg capitalize`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
            {viewMode === 'list' ? renderListView() : renderCardView()}
          </div>
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Vacancies Filter</h2>
                <button className="text-blue-600 text-sm hover:underline">
                  CLEAR ALL
                </button>
              </div>
              {Object.entries(filters).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm mb-2 text-gray-600">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                    className="w-full p-2 rounded-lg bg-white border border-gray-200"
                  >
                    <option>{value}</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}