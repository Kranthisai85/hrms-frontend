import { useCallback, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { branchService, categoryService, departmentService, designationService, gradesService, reasonsService, subDepartmentService } from "../../../services/api";
import BranchTable from "./BranchTable";
import DepartmentTable from "./DepartmentTable";
import DesignationTable from "./DesignationTable";
import SubDepartmentTable from "./SubDepartmentTable";
import GradeTable from "./GradeTable";
import CategoryTable from "./CategoryTable";
import ReasonsTable from "./ReasonsTable";
import CompanyModal from "./CompanyTable";
import Enterprise from "../Enterprise";
import Sidebar from "../Sidebar";

const initialCompanies = [
  { id: 1, code: "C001", name: "ABC Pvt Ltd", email: "abc@example.com", password: "password123", phone: "1234567890" },
  { id: 2, code: "C002", name: "XYZ Corp", email: "xyz@example.com", password: "password456", phone: "9876543210" },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: i + 3,
    code: `C00${i + 3}`,
    name: `Company ${i + 3}`,
    email: `company${i + 3}@example.com`,
    password: `password${i + 3}`,
    phone: `123456789${i}`,
  })),
];

export default function Masters({ darkMode, setCurrentPage, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState("enterprise");
  const [companies, setCompanies] = useState(initialCompanies);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [categories, setCategories] = useState([]);
  const [resignationReasons, setResignationReasons] = useState([]);
  const [terminationReasons, setTerminationReasons] = useState([]);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resignationSearchTerm, setResignationSearchTerm] = useState('');
  const [terminationSearchTerm, setTerminationSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    code: "", name: "", address: "", email: "", phone: "", password: "",
    pfCode: "", esiCode: "", labourLicense: "", domainName: "",
    contactPerson: "", website: "", superAdminID: "", logo: null,
  });
  const [inviteAdmin, setInviteAdmin] = useState(false);

  const handleSearchChange = useCallback((value) => setSearchTerm(value), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, logo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleInviteAdminChange = (e) => setInviteAdmin(e.target.checked);

  const handleCreateCompanySubmit = () => {
    const newCompany = { id: companies.length + 1, ...formData };
    setCompanies(prev => [...prev, newCompany]);
    handleCreateCompanyClose();
  };

  const handleSaveNew = () => {
    const newCompany = { id: companies.length + 1, ...formData };
    setCompanies(prev => [...prev, newCompany]);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      code: "", name: "", address: "", email: "", phone: "", password: "",
      pfCode: "", esiCode: "", labourLicense: "", domainName: "",
      contactPerson: "", website: "", superAdminID: "", logo: null,
    });
    setInviteAdmin(false);
  };

  const handleCreateCompanyClose = () => {
    setIsCreateCompanyOpen(false);
    handleReset();
  };

  const handleUpdateCompany = () => {
    setCompanies(prev => prev.map(company => 
      company.id === editingCompany.id ? { ...company, ...formData } : company
    ));
    setIsEditCompanyOpen(false);
    handleReset();
  };

  useEffect(() => {
    const fetchData = async (service, setter, errorMessage) => {
      try {
        setLoading(true);
        const response = await service();
        if (response.success) {
          setter(response.data);
        } else {
          toast.error(response.message || errorMessage);
        }
      } catch (error) {
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'branch') {
      fetchData(branchService.getBranches, setBranches, 'Error fetching branches');
    } else if (activeTab === 'department') {
      fetchData(departmentService.getDepartments, setDepartments, 'Error fetching departments');
    } else if (activeTab === 'designation') {
      fetchData(designationService.getDesignations, setDesignations, 'Error fetching designations');
    } else if (activeTab === 'sub Department') {
      fetchData(subDepartmentService.getAllSubDepartments, setSubDepartments, 'Error fetching sub-departments');
    } else if (activeTab === 'grade') {
      fetchData(gradesService.getGrades, setGrades, 'Error fetching grades');
    } else if (activeTab === 'category') {
      fetchData(categoryService.getAllCategories, setCategories, 'Error fetching categories');
    } else if (activeTab === 'reasons') {
      fetchData(reasonsService.getAllResignationReasons, setResignationReasons, 'Error fetching resignation reasons');
      fetchData(reasonsService.getAllTerminationReasons, setTerminationReasons, 'Error fetching termination reasons');
    }
  }, [activeTab]);

  const tabs = [
    "enterprise", "branch", "department", "designation", "sub Department",
    "grade", "category", "reasons"
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className={`h-full ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"}`}>
          <div className="mb-4 space-x-1 flex flex-wrap p-4">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`px-4 py-1 ${activeTab === tab ? 'bg-gray-100 font-semibold border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>

          <div className="px-4">
            {activeTab === "enterprise" && <Enterprise />}
            {activeTab === "branch" && (
              <BranchTable
                darkMode={darkMode}
                branches={branches}
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                loading={loading}
                setBranches={setBranches}
                departments={departments}
              />
            )}
            {activeTab === "department" && (
              <DepartmentTable
                darkMode={darkMode}
                departments={departments}
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                loading={loading}
                setDepartments={setDepartments}
              />
            )}
            {activeTab === "designation" && (
              <DesignationTable
                darkMode={darkMode}
                designations={designations}
                departments={departments}
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                setDesignations={setDesignations}
              />
            )}
            {activeTab === "sub Department" && (
              <SubDepartmentTable
                darkMode={darkMode}
                subDepartments={subDepartments}
                departments={departments}
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                setSubDepartments={setSubDepartments}
              />
            )}
            {activeTab === "grade" && (
              <GradeTable
                darkMode={darkMode}
                grades={grades}
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                setGrades={setGrades}
              />
            )}
            {activeTab === "category" && (
              <CategoryTable
                darkMode={darkMode}
                categories={categories}
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                setCategories={setCategories}
              />
            )}
            {activeTab === "reasons" && (
              <ReasonsTable
                darkMode={darkMode}
                resignationReasons={resignationReasons}
                terminationReasons={terminationReasons}
                resignationSearchTerm={resignationSearchTerm}
                terminationSearchTerm={terminationSearchTerm}
                setResignationSearchTerm={setResignationSearchTerm}
                setTerminationSearchTerm={setTerminationSearchTerm}
                setResignationReasons={setResignationReasons}
                setTerminationReasons={setTerminationReasons}
              />
            )}
          </div>

          {(isCreateCompanyOpen || isEditCompanyOpen) && (
            <CompanyModal
              darkMode={darkMode}
              isEdit={isEditCompanyOpen}
              formData={formData}
              inviteAdmin={inviteAdmin}
              handleInputChange={handleInputChange}
              handleLogoUpload={handleUpdateCompany}
              handleInviteAdminChange={handleInviteAdminChange}
              handleSubmit={isEditCompanyOpen ? handleUpdateCompany : handleCreateCompanySubmit}
              handleSaveNew={handleSaveNew}
              handleReset={handleReset}
              handleClose={() => isEditCompanyOpen ? setIsEditCompanyOpen(false) : handleCreateCompanyClose()}
            />
          )}
        </div>
      </div>
    </div>
  );
}