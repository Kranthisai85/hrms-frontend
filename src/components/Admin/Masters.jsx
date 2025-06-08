import { Edit, Plus, Search, Trash, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { branchService, categoryService, departmentService, designationService, gradesService, reasonsService, subDepartmentService } from "../../services/api"
import Enterprise from "./Enterprise"

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
]

// const initialDesignations = [
//   { id: 1, companyId: 1, departmentId: 1, name: "Sales Manager" },
//   { id: 2, companyId: 1, departmentId: 2, name: "HR Manager" },
//   { id: 3, companyId: 2, departmentId: 3, name: "Marketing Executive" },
//   { id: 4, companyId: 2, departmentId: 4, name: "Financial Analyst" },
// ]

// const initialSubDepartments = [
//   { id: 1, companyId: 1, departmentId: 2, name: "Recruitment" },
//   { id: 2, companyId: 1, departmentId: 2, name: "Training" },
//   { id: 3, companyId: 2, departmentId: 3, name: "Digital Marketing" },
//   { id: 4, companyId: 2, departmentId: 3, name: "Brand Management" },
// ]

// const initialGrades = [
//   { id: 1, name: "Grade A" },
//   { id: 2, name: "Grade B" },
//   { id: 3, name: "Grade C" },
//   { id: 4, name: "Grade D" },
// ]

const SearchBar = ({ darkMode, searchTerm, setSearchTerm }) => (
  <div className="relative mb-4 w-full max-w-md">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
    </div>
    <input
      type="text"
      className={`block w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        } transition duration-200`}
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);
export default function Masters({ darkMode }) {
  const [activeTab, setActiveTab] = useState("enterprise")
  const [companies, setCompanies] = useState(initialCompanies)
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [subDepartments, setSubDepartments] = useState([])
  const [grades, setGrades] = useState([])
  const [categories, setCategories] = useState([])
  const [resignationReasons, setResignationReasons] = useState([])
  const [terminationReasons, setTerminationReasons] = useState([])
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false)
  const [isCreateBranchOpen, setIsCreateBranchOpen] = useState(false)
  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false)
  const [isCreateDesignationOpen, setIsCreateDesignationOpen] = useState(false)
  const [isCreateSubDepartmentOpen, setIsCreateSubDepartmentOpen] = useState(false)
  const [isCreateGradeOpen, setIsCreateGradeOpen] = useState(false)
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [editingBranch, setEditingBranch] = useState(null)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [editingDesignation, setEditingDesignation] = useState(null)
  const [editingSubDepartment, setEditingSubDepartment] = useState(null)
  const [editingGrade, setEditingGrade] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingResignationReason, setEditingResignationReason] = useState(null)
  const [editingTerminationReason, setEditingTerminationReason] = useState(null)
  const [newBranch, setNewBranch] = useState({ name: "", address: "" })
  const [newDepartment, setNewDepartment] = useState({ name: "" })
  const [newDesignation, setNewDesignation] = useState({ name: "", departmentId: null })
  const [newSubDepartment, setNewSubDepartment] = useState({ name: "", departmentId: null })
  const [newGrade, setNewGrade] = useState({ name: "" })
  const [newCategory, setNewCategory] = useState({ name: "" })
  const [newResignationReason, setNewResignationReason] = useState({ name: "" })
  const [newTerminationReason, setNewTerminationReason] = useState({ name: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(7)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const [isCreateResignationReasonOpen, setIsCreateResignationReasonOpen] = useState(false);
  const [isCreateTerminateReasonOpen, setIsCreateTerminationReasonOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    pfCode: "",
    esiCode: "",
    labourLicense: "",
    domainName: "",
    contactPerson: "",
    website: "",
    superAdminID: "",
    logo: null,
  })
  const [inviteAdmin, setInviteAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInviteAdminChange = (e) => {
    setInviteAdmin(e.target.checked)
  }

  const handleCreateCompanySubmit = () => {
    const newCompany = { id: companies.length + 1, ...formData }
    setCompanies([...companies, newCompany])
    setSelectedCompanyId(newCompany.id)
    handleCreateCompanyClose()
  }

  const handleSaveNew = () => {
    const newCompany = { id: companies.length + 1, ...formData }
    setCompanies([...companies, newCompany])
    setSelectedCompanyId(newCompany.id)
    handleReset()
  }

  const handleReset = () => {
    setFormData({
      code: "",
      name: "",
      address: "",
      email: "",
      phone: "",
      password: "",
      pfCode: "",
      esiCode: "",
      labourLicense: "",
      domainName: "",
      contactPerson: "",
      website: "",
      superAdminID: "",
      logo: null,
    })
    setInviteAdmin(false)
  }

  const handleDelete = () => {
    // Implement delete functionality if needed
  }

  const handleCreateCompanyClose = () => {
    setIsCreateCompanyOpen(false)
    handleReset()
  }

  useEffect(() => {

    const fetchBranches = async () => {
      try {
        setLoading(true)
        const response = await branchService.getBranches()
        if (response.success) {
          setBranches(response.data)
        } else {
          toast.error(response.message || 'Failed to fetch branches')
        }
      } catch (error) {
        toast.error('Error fetching branches')
      } finally {
        setLoading(false)
      }
    }

    const fetchDepartments = async () => {
      try {
        setLoading(true)
        const response = await departmentService.getDepartments()
        if (response.success) {
          setDepartments(response.data)
        } else {
          toast.error(response.message || 'Failed to fetch departments')
        }
      } catch (error) {
        toast.error('Error fetching departments')
      } finally {
        setLoading(false)
      }
    }
    // fetchDepartments()


    const fetchSubDepartments = async () => {
      try {
        setLoading(true)
        const response = await subDepartmentService.getAllSubDepartments()
        if (response.success) {
          setSubDepartments(response.data)
        } else {
          toast.error(response.message || 'Failed to fetch departments')
        }
      } catch (error) {
        toast.error('Error fetching departments')
      } finally {
        setLoading(false)
      }
    }

    const fetchDesignations = async () => {
      try {
        setLoading(true)
        const response = await designationService.getDesignations()
        if (response.success) {
          setDesignations(response.data)
        } else {
          toast.error(response.message || 'Failed to fetch departments')
        }
      } catch (error) {
        toast.error('Error fetching departments')
      } finally {
        setLoading(false)
      }
    }

    const fetchGrades = async () => {
      try {
        setLoading(true)
        const response = await gradesService.getGrades()
        if (response.success) {
          setGrades(response.data)
        } else {
          toast.error(response.message || 'Failed to fetch departments')
        }
      } catch (error) {
        toast.error('Error fetching departments')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await categoryService.getAllCategories()
        if (response.success) {
          setCategories(response.data)
        } else {
          toast.error(response.message || 'Failed to fetch departments')
        }
      } catch (error) {
        toast.error('Error fetching departments')
      } finally {
        setLoading(false)
      }
    }

    const fetchTerminationReasons = async () => {
      try {
        setLoading(true)
        const response = await reasonsService.getAllTerminationReasons()
        if (response.success) {
          setTerminationReasons(response.data)
        } else {
          toast.error(response.message || 'Failed to fetch departments')
        }
      } catch (error) {
        toast.error('Error fetching departments')
      } finally {
        setLoading(false)
      }
    }
    const fetchResginationReasons = async () => {
      try {
        setLoading(true)
        const response = await reasonsService.getAllResignationReasons()
        if (response.success) {
          setResignationReasons(response.data)
        } else {
          toast.error(response.message || 'Failed to fetch departments')
        }
      } catch (error) {
        toast.error('Error fetching departments')
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'branch') {
      fetchBranches()
    } else if (activeTab === 'department') {
      fetchDepartments()
    } else if (activeTab === 'designation') {
      fetchDesignations()
    }
    else if (activeTab === 'sub Department') {
      fetchSubDepartments()
    }
    else if (activeTab === 'grade') {
      fetchGrades()
    }
    else if (activeTab === 'category') {
      fetchCategory()
    }
    else if (activeTab === 'reasons') {
      fetchResginationReasons()
      fetchTerminationReasons()
    }
  }, [activeTab])

  const handleCreateBranch = async () => {
    if (!newBranch.name) {
      toast.error('Branch name is required')
      return
    }
    const isDuplicate = branches.some(
      branch => branch.name.toLowerCase() === newBranch.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A branch with the name "${newBranch.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await branchService.createBranch({
        name: newBranch.name,
        address: newBranch.address || 'No Address Provided',
        companyId: 1 // Default company ID - can be made dynamic
      })

      if (response.success) {
        setBranches([...branches, response.data])
        setNewBranch({ name: "", address: "" })
        setIsCreateBranchOpen(false)
        toast.success('Branch created successfully')
      } else {
        toast.error(response.message || 'Failed to create branch')
      }
    } catch (error) {
      toast.error('Error creating branch')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepartment = async () => {
    if (!newDepartment.name) {
      toast.error('Department name is required')
      return
    }
    const isDuplicate = departments.some(
      dept => dept.name.toLowerCase() === newDepartment.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A department with the name "${newDepartment.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await departmentService.createDepartment({
        name: newDepartment.name,
        companyId: 1 // Default company ID - can be made dynamic later
      })

      if (response.success) {
        setDepartments([...departments, response.data])
        setNewDepartment({ name: "" })
        setIsCreateDepartmentOpen(false)
        toast.success('Department created successfully')
      } else {
        toast.error(response.message || 'Failed to create department')
      }
    } catch (error) {
      toast.error('Error creating department')
    } finally {
      setLoading(false)
    }
  }


  const handleCreateGrade = async () => {
    if (!newGrade.name) {
      toast.error('Grade name is required')
      return
    }
    const isDuplicate = grades.some(
      grade => grade.name.toLowerCase() === newGrade.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A grade with the name "${newGrade.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await gradesService.createGrade({
        name: newGrade.name,
      })

      if (response.success) {
        setGrades([...grades, response.data])
        setIsCreateGradeOpen(false)
        toast.success('Grade created successfully')
      } else {
        toast.error(response.message || 'Failed to create department')
      }
    } catch (error) {
      toast.error('Error creating department')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required')
      return
    }
    const isDuplicate = categories.some(
      cat => cat.name.toLowerCase() === newCategory.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A category with the name "${newCategory.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await categoryService.createCategory({
        name: newCategory.name,
      })

      if (response.success) {
        setCategories([...categories, response.data])
        setIsCreateCategoryOpen(false)
        toast.success('Category created successfully')
      } else {
        toast.error(response.message || 'Failed to create category')
      }
    } catch (error) {
      toast.error('Error creating category')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDesignation = async () => {
    if (!newDesignation.name || !newDesignation.departmentId) {
      toast.error('Designation name and department are required')
      return
    }
    const isDuplicate = designations.some(
      des => des.name.toLowerCase() === newDesignation.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A designation with the name "${newDesignation.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await designationService.createDesignation({
        name: newDesignation.name,
        departmentId: newDesignation.departmentId
      })

      if (response.success) {
        setDesignations([...designations, response.data])
        setNewDesignation({ name: "", departmentId: null })
        setIsCreateDesignationOpen(false)
        toast.success('Designation created successfully')
      } else {
        toast.error(response.message || 'Failed to create designation')
      }
    } catch (error) {
      toast.error('Error creating designation')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubDepartment = () => {
    if (newSubDepartment.name && newSubDepartment.departmentId) {
      const isDuplicate = subDepartments.some(
        sub => sub.name.toLowerCase() === newSubDepartment.name.toLowerCase().trim()
      );
      if (isDuplicate) {
        toast.error(`A sub-department with the name "${newSubDepartment.name}" already exists.`);
        return false;
      }
      setSubDepartments([...subDepartments, { id: subDepartments.length + 1, ...newSubDepartment }])
      setNewSubDepartment({ name: "", departmentId: null })
      setIsCreateSubDepartmentOpen(false)
    }
  }

  // const handleCreateGrade = () => {
  //   if (newGrade.name) {
  //     setGrades([...grades, { id: grades.length + 1, ...newGrade }])
  //     setNewGrade({ name: "" })
  //     setIsCreateGradeOpen(false)
  //   }
  // }

  const handleDeleteBranch = async (id) => {
    try {
      setLoading(true)
      const response = await branchService.deleteBranch(id)

      if (response.success) {
        setBranches(branches.filter((branch) => branch.id !== id))
        toast.success('Branch deleted successfully')
      } else {
        toast.error(response.message || 'Failed to delete branch')
      }
    } catch (error) {
      toast.error('Error deleting branch')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDepartment = async (id) => {
    try {
      setLoading(true)
      const response = await departmentService.deleteDepartment(id)

      if (response.success) {
        setDepartments(departments.filter((dept) => dept.id !== id))
        toast.success('Department deleted successfully')
      } else {
        toast.error(response.message || 'Failed to delete department')
      }
    } catch (error) {
      toast.error('Error deleting department')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDesignation = async (id) => {
    try {
      setLoading(true)
      const response = await designationService.deleteDesignation(id)

      if (response.success) {
        setDesignations(designations.filter((desig) => desig.id !== id))
        toast.success('Designation deleted successfully')
      } else {
        toast.error(response.message || 'Failed to delete designation')
      }
    } catch (error) {
      toast.error('Error deleting designation')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubDepartment = (id) => {
    setSubDepartments(subDepartments.filter((subDept) => subDept.id !== id))
  }

  const handleDeleteGrade = (id) => {
    setGrades(grades.filter((grade) => grade.id !== id))
  }

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  const handleEditBranch = (branch) => {
    setEditingBranch(branch)
    setNewBranch(branch)
    setIsCreateBranchOpen(true)
  }

  const handleEditDepartment = (department) => {
    setEditingDepartment(department)
    setNewDepartment(department)
    setIsCreateDepartmentOpen(true)
  }

  const handleEditDesignation = (designation) => {
    setEditingDesignation(designation)
    setNewDesignation(designation)
    setIsCreateDesignationOpen(true)
  }

  const handleEditSubDepartment = (subDepartment) => {
    setEditingSubDepartment(subDepartment)
    setNewSubDepartment(subDepartment)
    setIsCreateSubDepartmentOpen(true)
  }

  const handleEditGrade = (grade) => {
    setEditingGrade(grade)
    setNewGrade(grade)
    setIsCreateGradeOpen(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setNewCategory(category)
    setIsCreateGradeOpen(true)
  }
  const handleEditResignationReason = (reason) => {
    setEditingResignationReason(reason)
    setNewResignationReason(reason)
    setIsCreateResignationReasonOpen(true)
  }

  const handleEditTerminationReason = (reason) => {
    setEditingTerminationReason(reason)
    setNewTerminationReason(reason)
    setIsCreateTerminationReasonOpen(true)
  }

  const handleUpdateCompany = () => {
    setCompanies(companies.map((company) => (company.id === editingCompany.id ? { ...company, ...formData } : company)))
    setIsEditCompanyOpen(false)
    handleReset()
  }

  const handleUpdateBranch = async () => {
    if (!newBranch.name) {
      toast.error('Branch name is required')
      return
    }
    const isDuplicate = branches.some(
      branch => branch.name.toLowerCase() === newBranch.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A branch with the name "${newBranch.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await branchService.updateBranch(editingBranch.id, {
        name: newBranch.name,
        address: newBranch.address || 'No Address Provided'
      })

      if (response.success) {
        setBranches(branches.map((branch) =>
          branch.id === editingBranch.id ? response.data : branch
        ))
        setIsCreateBranchOpen(false)
        setEditingBranch(null)
        setNewBranch({ name: "", address: "" })
        toast.success('Branch updated successfully')
      } else {
        toast.error(response.message || 'Failed to update branch')
      }
    } catch (error) {
      toast.error('Error updating branch')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDepartment = async () => {
    if (!newDepartment.name) {
      toast.error('Department name is required')
      return
    }
    const isDuplicate = departments.some(
      dept => dept.name.toLowerCase() === newDepartment.name.toLowerCase().trim()
    );
    try {
      setLoading(true)
      const response = await departmentService.updateDepartment(editingDepartment.id, {
        name: newDepartment.name
      })

      if (response.success) {
        setDepartments(departments.map((dept) =>
          dept.id === editingDepartment.id ? response.data : dept
        ))
        setIsCreateDepartmentOpen(false)
        setEditingDepartment(null)
        setNewDepartment({ name: "" })
        toast.success('Department updated successfully')
      } else {
        toast.error(response.message || 'Failed to update department')
      }
    } catch (error) {
      toast.error('Error updating department')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDesignation = async () => {
    if (!newDesignation.name || !newDesignation.departmentId) {
      toast.error('Designation name and department are required')
      return
    }
    const isDuplicate = designations.some(
      des => des.name.toLowerCase() === newDesignation.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A designation with the name "${newDesignation.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await designationService.updateDesignation(editingDesignation.id, {
        name: newDesignation.name,
        departmentId: newDesignation.departmentId
      })

      if (response.success) {
        setDesignations(designations.map(desig =>
          desig.id === editingDesignation.id ? response.data : desig
        ))
        setIsCreateDesignationOpen(false)
        setEditingDesignation(null)
        setNewDesignation({ name: "", departmentId: null })
        toast.success('Designation updated successfully')
      } else {
        toast.error(response.message || 'Failed to update designation')
      }
    } catch (error) {
      toast.error('Error updating designation')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSubDepartment = () => {
    const isDuplicate = subDepartments.some(
      sub => sub.name.toLowerCase() === newSubDepartment.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A sub-department with the name "${newSubDepartment.name}" already exists.`);
      return false;
    }
    setSubDepartments(
      subDepartments.map((subDept) =>
        subDept.id === editingSubDepartment.id ? { ...subDept, ...newSubDepartment } : subDept,
      ),
    )
    setIsCreateSubDepartmentOpen(false)
    setEditingSubDepartment(null)
    setNewSubDepartment({ name: "", departmentId: null })
  }

  const handleUpdateGrade = () => {
    const isDuplicate = grades.some(
      grade => grade.name.toLowerCase() === newGrade.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`A grade with the name "${newGrade.name}" already exists.`);
      return false;
    }
    setGrades(grades.map((grade) => (grade.id === editingGrade.id ? { ...grade, ...newGrade } : grade)))
    setIsCreateGradeOpen(false)
    setEditingGrade(null)
    setNewGrade({ name: "" })
  }
  const handleUpdateCategory = () => {
    const isDuplicate = categories.some(
      cat => cat.name.toLowerCase() === newCategory.name.toLowerCase()
    );
    if (isDuplicate) {
      toast.error(`A category with the name "${newCategory.name}" already exists.`);
      return false;
    }
    setCategories(categories.map((grade) => (categories.id === editingCategory.id ? { ...categories, ...newCategory } : grade)))
    setIsCreateCategoryOpen(false)
    setEditingCategory(null)
    setNewCategory({ name: "" })
  }

  const handleUpdateResignationReason = (reason) => {
    const isDuplicate = resignationReasons.some(
      cat => cat.name.toLowerCase() === reason.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`"${reason.name}" reason already exists.`);
      return false;
    }
    setResignationReasons(resignationReasons.map((reason) => (resignationReasons.id === editingResignationReason.id ? { ...resignationReasons, ...reason } : reason)))
    setIsCreateResignationReasonOpen(false)
    setEditingResignationReason(null)
    setNewResignationReason({ name: "" })
  };

  const handleDeleteResignationReason = (id) => {
    setResignationReasons(resignationReasons.filter((reason) => reason.id !== id))
  };

  const handleUpdateTerminationReason = (reason) => {
    const isDuplicate = terminationReasons.some(
      cat => cat.name.toLowerCase() === reason.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`"${reason.name}" reason already exists.`);
      return false;
    }
    setTerminationReasons(terminationReasons.map((reason) => (terminationReasons.id === editingTerminationReason.id ? { ...terminationReasons, ...reason } : reason)))
    setIsCreateTerminationReasonOpen(false)
    setEditingTerminationReason(null)
    setNewTerminationReason({ name: "" })
  };
  const handleDeleteTerminationReason = (id) => {
    setTerminationReasons(terminationReasons.filter((reason) => reason.id !== id))
  };

  const handleCreateResignationReasons = async () => {
    if (!newResignationReason.name) {
      toast.error('Resignation name is required')
      return
    }
    const isDuplicate = resignationReasons.some(
      cat => cat.name.toLowerCase() === newResignationReason.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`"${newResignationReason.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await reasonsService.createReasons({
        name: newResignationReason.name,
        type: 'resignation'
      })

      if (response.success) {
        setResignationReasons([...resignationReasons, response.data])
        setIsCreateResignationReasonOpen(false)
        setNewResignationReason({ name: "" })
        toast.success('Resignation reason created successfully')
      } else {
        toast.error(response.message || 'Failed to create reason')
      }
    } catch (error) {
      toast.error('Error creating reason')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTerminationReasons = async () => {
    if (!newTerminationReason.name) {
      toast.error('Termination name is required')
      return
    }
    const isDuplicate = terminationReasons.some(
      cat => cat.name.toLowerCase() === newTerminationReason.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      toast.error(`"${newTerminationReason.name}" already exists.`);
      return false;
    }
    try {
      setLoading(true)
      const response = await reasonsService.createReasons({
        name: newTerminationReason.name,
        type: 'termination'
      })

      if (response.success) {
        setTerminationReasons([...terminationReasons, response.data])
        setIsCreateTerminationReasonOpen(false)
        setNewTerminationReason({ name: "" })
        toast.success('Termination reason created successfully')
      } else {
        toast.error(response.message || 'Failed to create reason')
      }
    } catch (error) {
      toast.error('Error creating reason')
    } finally {
      setLoading(false)
    }
  }


  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDesignations = designations.filter(designation =>
    designation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departments.find(dept => dept.id === designation.departmentId)?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubDepartments = subDepartments.filter(subDepartment =>
    subDepartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departments.find(dept => (dept.id === subDepartment.department_id || dept.id === subDepartment.departmentId))?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGrades = grades.filter(grade =>
    grade.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className={`p-2 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"}`}>
      <div className="mb-4 space-x-1 flex flex-wrap">
        {[
          "enterprise",
          "branch",
          "department",
          "designation",
          "sub Department",
          "grade",
          // "employment type",
          // "employment status",
          "category",
          "reasons"
          // "custom2",
        ].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1 ${activeTab === tab ? 'bg-gray-100 font-semibold border-b-2 border-blue-500'
              : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {activeTab === "enterprise" && <Enterprise />}

      {activeTab === "branch" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
            <button
              className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setIsCreateBranchOpen(true)}
              disabled={loading}
            >
              <Plus className="mr-2" size={20} />
              {loading ? 'Loading...' : 'Create Branch'}
            </button>
          </div>
          {loading && filteredBranches.length === 0 && (
            <div className="text-center py-8">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading branches...</p>
            </div>
          )}
          {!loading && filteredBranches.length > 0 && (
            <table
              className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}
            >
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
                        disabled={loading}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch.id)}
                        className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                        disabled={loading}
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredBranches.length === 0 && (
            <div className="text-center py-8">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No branches found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "department" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
            <button
              className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setIsCreateDepartmentOpen(true)}
              disabled={loading}
            >
              <Plus className="mr-2" size={20} />
              {loading ? 'Loading...' : 'Create Department'}
            </button>
          </div>
          {loading && filteredDepartments.length === 0 && (
            <div className="text-center py-8">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading departments...</p>
            </div>
          )}
          {!loading && filteredDepartments.length > 0 && (
            <table
              className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}
            >
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
                {filteredDepartments.map((department, index) => (
                  <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                    <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                    <td className="px-6 py-2 whitespace-nowrap border-b">{department.name}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                      <button
                        onClick={() => handleEditDepartment(department)}
                        className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                        disabled={loading}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department.id)}
                        className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                        disabled={loading}
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredDepartments.length === 0 && (
            <div className="text-center py-8">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No departments found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "designation" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
            <button
              className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200`}
              onClick={() => setIsCreateDesignationOpen(true)}
            >
              <Plus className="mr-2" size={20} />
              Create Designation
            </button>
          </div>
          <table
            className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}
          >
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
              {filteredDesignations.map((designation, index) => (
                <tr key={designation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                  <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                  <td className="px-6 py-2 whitespace-nowrap border-b">{designation.name}</td>
                  <td className="px-6 py-2 whitespace-nowrap border-b">
                    {departments.find((dept) => dept.id === designation.departmentId)?.name}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                    <button
                      onClick={() => handleEditDesignation(designation)}
                      className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteDesignation(designation.id)}
                      className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "sub Department" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
            <button
              className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200`}
              onClick={() => setIsCreateSubDepartmentOpen(true)}
            >
              <Plus className="mr-2" size={20} />
              Create Sub-Department
            </button>
          </div>
          <table
            className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}
          >
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
              {filteredSubDepartments.map((subDepartment, index) => (
                <tr key={subDepartment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                  <td className="px-6 py-2 whitespace-nowrap border-b">{index + 1}</td>
                  <td className="px-6 py-2 whitespace-nowrap border-b">{subDepartment.name}</td>
                  <td className="px-6 py-2 whitespace-nowrap border-b">
                    {departments.find((dept) => (dept.id === subDepartment.department_id || dept.id === subDepartment.departmentId))?.name}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium border-b">
                    <button
                      onClick={() => handleEditSubDepartment(subDepartment)}
                      className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2 transition duration-150`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSubDepartment(subDepartment.id)}
                      className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "grade" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
            <button
              className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200`}
              onClick={() => setIsCreateGradeOpen(true)}
            >
              <Plus className="mr-2" size={20} />
              Create Grade
            </button>
          </div>
          <table
            className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}
          >
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
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteGrade(grade.id)}
                      className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "category" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <SearchBar darkMode={darkMode} searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
            <button
              className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200`}
              onClick={() => setIsCreateCategoryOpen(true)}
            >
              <Plus className="mr-2" size={20} />
              Create Category
            </button>
          </div>
          <table
            className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}
          >
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
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"} transition duration-150`}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "reasons" && (
        <div className="flex flex-wrap gap-4">
          {/* First Reason Table */}
          <div className="flex-1 min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-black"}`}>Resignation</h2>
            </div>
            <button
              className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 mb-4`}
              onClick={() => setIsCreateResignationReasonOpen(true)}
            >
              <Plus className="mr-2" size={20} />
              Create Reason
            </button>
            <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Reason</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
                {resignationReasons.map((reason, index) => (
                  <tr key={reason.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                    <td className="px-6 py-2 border-b">{index + 1}</td>
                    <td className="px-6 py-2 border-b">{reason.name}</td>
                    <td className="px-6 py-2 border-b text-sm font-medium">
                      <button onClick={() => handleEditResignationReason(reason)} className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2`}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteResignationReason(reason.id)} className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"}`}>
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Second Reason Table */}
          <div className="flex-1 min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-black"}`}>Termination</h2>
            </div>
            <button
              className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-lg flex items-center transition duration-200 mb-4`}
              onClick={() => setIsCreateTerminationReasonOpen(true)}
            >
              <Plus className="mr-2" size={20} />
              Create Reason
            </button>
            <table className={`min-w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-lg shadow-sm`}>
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Reason</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider border-b">Action</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
                {terminationReasons.map((reason, index) => (
                  <tr key={reason.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                    <td className="px-6 py-2 border-b">{index + 1}</td>
                    <td className="px-6 py-2 border-b">{reason.name}</td>
                    <td className="px-6 py-2 border-b text-sm font-medium">
                      <button onClick={() => handleEditTerminationReason(reason)} className={`${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-900"} mr-2`}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteTerminationReason(reason.id)} className={`${darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-900"}`}>
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Placeholder for other tabs */}
      {/* {["employment type", "employment status", "category"].includes(activeTab) && (
        <div className="text-center py-8">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {activeTab.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Management
          </h2>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            This section is under development. Please check back later.
          </p>
        </div>
      )} */}

      {/* Create/Edit Company Modal */}
      {(isCreateCompanyOpen || isEditCompanyOpen) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg w-full max-w-2xl relative`}
          >
            <button
              className={`absolute top-2 right-2 ${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-800"}`}
              onClick={() => (isEditCompanyOpen ? setIsEditCompanyOpen(false) : handleCreateCompanyClose())}
            >
              <X className="w-6 h-6" />
            </button>
            <h4 className="text-2xl font-bold mb-4">
              {isEditCompanyOpen ? "Edit Company Information" : "Company General Information"}
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                {["code", "name", "address", "email", "phone", "pfCode", "esiCode"].map((field) => (
                  <div key={field} className="flex items-center">
                    <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} w-1/3`}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    <input
                      type="text"
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className={`border p-2 rounded w-2/3 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {["labourLicense", "domainName", "contactPerson", "website", "superAdminID", "password"].map(
                  (field) => (
                    <div key={field} className="flex items-center">
                      <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} w-1/3`}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </label>
                      <input
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className={`border p-2 rounded w-2/3 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
                      />
                    </div>
                  ),
                )}
                <div className="flex justify-between items-center mt-4">
                  <label className={`${darkMode ? "text-gray-300" : "text-gray-700"} w-1/3`}>Upload Logo:</label>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-2/3" />
                </div>

                {formData.logo && (
                  <div className="mt-4">
                    <h2 className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>Uploaded Logo:</h2>
                    <img
                      src={formData.logo || "/placeholder.svg"}
                      alt="Uploaded Logo"
                      className="border rounded-lg w-24 h-24"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input type="checkbox" checked={inviteAdmin} onChange={handleInviteAdminChange} className="mr-2" />
              <label className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>Invite Admin</label>
            </div>

            <div className="flex mt-6 space-x-4">
              {isEditCompanyOpen ? (
                <button
                  className={`${darkMode ? "bg-blue-600" : "bg-blue-500"} text-white px-4 py-1 rounded`}
                  onClick={handleUpdateCompany}
                >
                  Update
                </button>
              ) : (
                <>
                  <button
                    className={`${darkMode ? "bg-green-600" : "bg-green-500"} text-white px-4 py-1 rounded`}
                    onClick={handleCreateCompanySubmit}
                  >
                    Save
                  </button>
                  <button
                    className={`${darkMode ? "bg-blue-600" : "bg-blue-500"} text-white px-4 py-1 rounded`}
                    onClick={handleSaveNew}
                  >
                    Save & New
                  </button>
                </>
              )}
              <button
                className={`${darkMode ? "bg-yellow-600" : "bg-yellow-500"} text-white px-4 py-1 rounded`}
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className={`${darkMode ? "bg-red-600" : "bg-red-500"} text-white px-4 py-1 rounded`}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Branch Modal */}
      {isCreateBranchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl relative max-w-md w-full`}>
            <button
              onClick={() => {
                setIsCreateBranchOpen(false)
                setEditingBranch(null)
                setNewBranch({ name: '', address: '' })
              }}
              className={`absolute top-2 right-2 ${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingBranch ? "Edit Branch" : "Create Branch"}</h2>
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
            <div className="flex justify-end space-x-2">
              <button
                onClick={editingBranch ? handleUpdateBranch : handleCreateBranch}
                className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-1 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Processing...' : (editingBranch ? "Update" : "Save")}
              </button>
              <button
                onClick={() => {
                  setIsCreateBranchOpen(false)
                  setEditingBranch(null)
                  setNewBranch({ name: '', address: '' })
                }}
                className={`${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-1 rounded`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Department Modal */}
      {isCreateDepartmentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl relative max-w-md w-full`}>
            <button
              onClick={() => { setIsCreateDepartmentOpen(false); setEditingDepartment(null); setNewDepartment({ name: '' }) }}
              className={`absolute top-2 right-2 ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingDepartment ? 'Edit Department' : 'Create Department'}</h2>
            <input
              type="text"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
              placeholder="Department Name"
              className={`w-full p-2 border rounded mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
                className={`${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-1 rounded`}
              >
                {editingDepartment ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => { setIsCreateDepartmentOpen(false); setEditingDepartment(null); setNewDepartment({ name: '' }) }}
                className={`${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-1 rounded`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Designation Modal */}
      {isCreateDesignationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl relative max-w-md w-full`}>
            <button
              onClick={() => {
                setIsCreateDesignationOpen(false)
                setEditingDesignation(null)
                setNewDesignation({ name: "", departmentId: null })
              }}
              className={`absolute top-2 right-2 ${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingDesignation ? "Edit Designation" : "Create Designation"}</h2>
            <input
              type="text"
              value={newDesignation.name}
              onChange={(e) => setNewDesignation({ ...newDesignation, name: e.target.value })}
              placeholder="Designation Name"
              className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
            />
            <select
              value={newDesignation.departmentId || ""}
              onChange={(e) => setNewDesignation({ ...newDesignation, departmentId: Number(e.target.value) })}
              className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={editingDesignation ? handleUpdateDesignation : handleCreateDesignation}
                className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-1 rounded`}
              >
                {editingDesignation ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsCreateDesignationOpen(false)
                  setEditingDesignation(null)
                  setNewDesignation({ name: "", departmentId: null })
                }}
                className={`${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-1 rounded`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Sub-Department Modal */}
      {isCreateSubDepartmentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`${darkMode
            ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl relative max-w-md w-full`}>
            <button
              onClick={() => {
                setIsCreateSubDepartmentOpen(false)
                setEditingSubDepartment(null)
                setNewSubDepartment({ name: "", departmentId: null })
              }}
              className={`absolute top-2 right-2 ${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingSubDepartment ? "Edit Sub-Department" : "Create Sub-Department"}
            </h2>
            <input
              type="text"
              value={newSubDepartment.name}
              onChange={(e) => setNewSubDepartment({ ...newSubDepartment, name: e.target.value })}
              placeholder="Sub-Department Name"
              className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
            />
            <select
              value={newSubDepartment.departmentId || ""}
              onChange={(e) => setNewSubDepartment({ ...newSubDepartment, departmentId: Number(e.target.value) })}
              className={`w-full p-2 border rounded mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={editingSubDepartment ? handleUpdateSubDepartment : handleCreateSubDepartment}
                className={`${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-1 rounded`}
              >
                {editingSubDepartment ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsCreateSubDepartmentOpen(false)
                  setEditingSubDepartment(null)
                  setNewSubDepartment({ name: "", departmentId: null })
                }}
                className={`${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-1 rounded`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Grade Modal */}
      {isCreateGradeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-md w-full">
            <button
              onClick={() => {
                setIsCreateGradeOpen(false)
                setEditingGrade(null)
                setNewGrade({ name: "" })
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingGrade ? "Edit Grade" : "Create Grade"}</h2>
            <input
              type="text"
              value={newGrade.name}
              onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
              placeholder="Grade Name"
              className="w-full p-2 border rounded mb-4 bg-white border-gray-300 text-gray-800"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={editingGrade ? handleUpdateGrade : handleCreateGrade}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                {editingGrade ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsCreateGradeOpen(false)
                  setEditingGrade(null)
                  setNewGrade({ name: "" })
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateCategoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-md w-full">
            <button
              onClick={() => {
                setIsCreateCategoryOpen(false)
                setEditingCategory(null)
                setNewCategory({ name: "" })
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingCategory ? "Edit Category" : "Create Category"}</h2>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Category Name"
              className="w-full p-2 border rounded mb-4 bg-white border-gray-300 text-gray-800"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                {editingCategory ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsCreateCategoryOpen(false)
                  setEditingCategory(null)
                  setNewCategory({ name: "" })
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isCreateResignationReasonOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-md w-full">
            <button
              onClick={() => {
                setIsCreateResignationReasonOpen(false)
                setEditingResignationReason(null)
                setNewResignationReason({ name: "" })
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingResignationReason ? "Edit Resignation Reason" : "Create Resignation Reason"}</h2>
            <input
              type="text"
              value={newResignationReason.name}
              onChange={(e) => setNewResignationReason({ ...newResignationReason, name: e.target.value })}
              placeholder="Reason Name"
              className="w-full p-2 border rounded mb-4 bg-white border-gray-300 text-gray-800"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={editingResignationReason ? handleUpdateResignationReason : handleCreateResignationReasons}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                {editingResignationReason ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsCreateResignationReasonOpen(false)
                  setEditingResignationReason(null)
                  setNewResignationReason({ name: "" })
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isCreateTerminateReasonOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-md w-full">
            <button
              onClick={() => {
                setIsCreateTerminationReasonOpen(false)
                setEditingTerminationReason(null)
                setNewTerminationReason({ name: "" })
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingTerminationReason ? "Edit Termination Reason" : "Create Termination Reason"}</h2>
            <input
              type="text"
              value={newTerminationReason.name}
              onChange={(e) => setNewTerminationReason({ ...newTerminationReason, name: e.target.value })}
              placeholder="Reason Name"
              className="w-full p-2 border rounded mb-4 bg-white border-gray-300 text-gray-800"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={editingTerminationReason ? handleUpdateTerminationReason : handleCreateTerminationReasons}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                {editingTerminationReason ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsCreateTerminationReasonOpen(false)
                  setEditingTerminationReason(null)
                  setNewTerminationReason({ name: "" })
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

