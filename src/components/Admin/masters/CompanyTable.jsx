import { X } from "lucide-react";

export default function CompanyModal({
  darkMode,
  isEdit,
  formData,
  inviteAdmin,
  handleInputChange,
  handleLogoUpload,
  handleInviteAdminChange,
  handleSubmit,
  handleSaveNew,
  handleReset,
  handleClose
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl relative max-w-lg w-full`}>
        <button
          onClick={handleClose}
          className={`absolute top-2 right-2 ${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Company" : "Create Company"}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Company Code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Company Name"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PF Code</label>
            <input
              type="text"
              name="pfCode"
              value={formData.pfCode}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="PF Code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ESI Code</label>
            <input
              type="text"
              name="esiCode"
              value={formData.esiCode}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="ESI Code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Labour License</label>
            <input
              type="text"
              name="labourLicense"
              value={formData.labourLicense}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Labour License"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Domain Name</label>
            <input
              type="text"
              name="domainName"
              value={formData.domainName}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Domain Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Contact Person"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Website"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Super Admin ID</label>
            <input
              type="text"
              name="superAdminID"
              value={formData.superAdminID}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              placeholder="Super Admin ID"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className={`w-full p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
            />
            {formData.logo && (
              <img src={formData.logo} alt="Company Logo" className="mt-2 h-16 w-16 object-contain" />
            )}
          </div>
          <div className="col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={inviteAdmin}
                onChange={handleInviteAdminChange}
                className="mr-2"
              />
              Invite Admin
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleSubmit}
            className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-1 rounded`}
          >
            {isEdit ? "Update" : "Save"}
          </button>
          {!isEdit && (
            <button
              onClick={handleSaveNew}
              className={`${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-1 rounded`}
            >
              Save & New
            </button>
          )}
          <button
            onClick={handleReset}
            className={`${darkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-500 hover:bg-gray-600"} text-white px-4 py-1 rounded`}
          >
            Reset
          </button>
          <button
            onClick={handleClose}
            className={`${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-1 rounded`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}