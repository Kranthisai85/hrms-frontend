import { useEffect, useState } from 'react';
import { companyService } from '../../services/api';

export default function Enterprise({ darkMode }) {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    email: '',
    mobile: '',
    pfCode: '',
    esiCode: '',
    labourLicense: '',
    domainName: '',
    contactPerson: '',
    website: '',
    superAdminID: '',
    password: '',
    logo: null,
  });

  // Fetch company data from API
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // First check if company data is already in localStorage
        const storedCompanyData = localStorage.getItem('companyData');
        if (storedCompanyData) {
          const data = JSON.parse(storedCompanyData);
          setFormData({
            companyName: data.name,
            address: data.address,
            email: data.email,
            mobile: data.phone,
            pfCode: data.pfCode,
            esiCode: data.esiCode,
            labourLicense: data.labourLicense,
            domainName: data.domainName,
            contactPerson: data.contactPerson,
            website: data.website,
            superAdminID: data.superAdminID,
            password: data.password,
            logo: data.logo || null, // Handle empty logo
          });
          return;
        }

        // If not in localStorage, fetch from API
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.companyId) {
          const response = await companyService.getCompanyData(user.companyId);
          if (response.success) {
            const data = response.company;
            localStorage.setItem("companyData", JSON.stringify(data));
            setFormData({
              companyName: data.name,
              address: data.address,
              email: data.email,
              mobile: data.phone,
              pfCode: data.pfCode,
              esiCode: data.esiCode,
              labourLicense: data.labourLicense,
              domainName: data.domainName,
              contactPerson: data.contactPerson,
              website: data.website,
              superAdminID: data.superAdminID,
              password: data.password,
              logo: data.logo || null, // Handle empty logo
            });
          }
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <div className={`container mx-auto p-6 ${darkMode ? 'bg-[#f3f4f6] text-[#D3D9E9]' : 'bg-[#f3f4f6] text-[#31293F]'} rounded-lg shadow-lg`}>
      <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-[#A6A9C8]' : 'text-[#31293F]'}`}>Enterprise Details</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputField label="Company Name" name="companyName" value={formData.companyName} darkMode={darkMode} />
          <InputField label="Address" name="address" value={formData.address} darkMode={darkMode} />
          <InputField label="Email ID" name="email" value={formData.email} darkMode={darkMode} />
          <InputField label="Mobile Number" name="mobile" value={formData.mobile} darkMode={darkMode} />
          <InputField label="PF Code No." name="pfCode" value={formData.pfCode} darkMode={darkMode} />
          <InputField label="ESI Code No." name="esiCode" value={formData.esiCode} darkMode={darkMode} />
          {/* {formData.logo && (
            <div className="mt-4">
              <h2 className={`${darkMode ? 'text-[#A6A9C8]' : 'text-[#31293F]'}`}>Uploaded Logo:</h2>
              <img src={formData.logo} alt="Uploaded Logo" className="border rounded-lg w-24 h-24" />
            </div>
          )} */}
          {formData.logo && (
            <div className="mt-4 flex items-center space-x-28">
              <h2 className={`${darkMode ? 'text-[#A6A9C8]' : 'text-[#31293F]'}`}>Uploaded Logo:</h2>
              <img
                src={formData.logo}
                alt="Uploaded Logo"
                className="border rounded-lg w-24 h-24 object-contain"
              />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <InputField label="Labour License No." name="labourLicense" value={formData.labourLicense} darkMode={darkMode} />
          <InputField label="Domain Name" name="domainName" value={formData.domainName} darkMode={darkMode} />
          <InputField label="Contact Person" name="contactPerson" value={formData.contactPerson} darkMode={darkMode} />
          <InputField label="Website" name="website" value={formData.website} darkMode={darkMode} />
          <InputField label="Super Admin ID" name="superAdminID" value={formData.superAdminID} darkMode={darkMode} />
          <InputField label="Password" name="password" value={formData.password} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, darkMode }) {
  return (
    <div className="flex justify-between items-center">
      <label className={`${darkMode ? 'text-[#A6A9C8]' : 'text-[#31293F]'} w-1/3`}>{label}:</label>
      <input
        name={name}
        type="text"
        value={value}
        readOnly
        className={`border p-2 rounded w-2/3 ${darkMode ? 'bg-[#554D74] text-[#D3D9E9] border-[#796EA8]' : 'bg-[#D3D9E9] text-[#31293F] border-[#554D74]'}`}
      />
    </div>
  );
}