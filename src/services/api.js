import axios from 'axios';

// export const API_URL = 'https://admin.pacehrm.com/api/';
export const API_URL = 'http://localhost:3306/api/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token and frontend host
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add frontend host to headers for domain validation
    const frontendHost = window.location.host;
    config.headers['X-Frontend-Host'] = frontendHost;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Company services
export const companyService = {
  getCompanyData: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCompanyData: async (companyId, companyData) => {
    try {
      const response = await api.put(`/companies/${companyId}`, companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCompanyByDomain: async () => {
    try {
      const response = await api.get('/companies/test-domain');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Auth services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        // Fetch and store company data on successful login
        if (response.data.user && response.data.user.companyId) {
          try {
            const companyResponse = await companyService.getCompanyData(response.data.user.companyId);
            if (companyResponse.success) {
              localStorage.setItem('companyData', JSON.stringify(companyResponse.company));
            }
          } catch (companyError) {
            console.error('Failed to fetch company data:', companyError);
            // Don't fail the login if company data fetch fails
          }
        }
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('companyData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Employee services
export const employeeService = {
  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  uploadEmployeePhoto: async (employeeId, photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('employeeId', employeeId);
      
      const response = await api.post('/employees/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getEmployee: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  importEmployees: async (formData) => {
    const response = await api.post('/employees/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  exportEmployees: async () => {
    const response = await api.get('/employees/export', {
      responseType: 'blob'
    });
    return response;
  }
};

// Attendance services
export const attendanceService = {
  checkIn: async () => {
    const response = await api.post('/attendance/check-in');
    return response.data;
  },

  checkOut: async () => {
    const response = await api.put('/attendance/check-out');
    return response.data;
  },

  getAttendanceHistory: async () => {
    const response = await api.get('/attendance/history');
    return response.data;
  },

  getAttendanceStats: async () => {
    const response = await api.get('/attendance/stats');
    return response.data;
  },

  bulkMarkAttendance: async (attendanceData) => {
    const response = await api.post('/attendance/bulk-mark', attendanceData);
    return response.data;
  },

  lockAttendance: async (month, year) => {
    const response = await api.put(`/attendance/lock/${month}/${year}`);
    return response.data;
  },

  unlockAttendance: async (month, year) => {
    const response = await api.put(`/attendance/unlock/${month}/${year}`);
    return response.data;
  },

  importAttendance: async (formData) => {
    const response = await api.post('/attendance/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  exportAttendance: async (month, year) => {
    const response = await api.get(`/attendance/export/${month}/${year}`, {
      responseType: 'blob'
    });
    return response;
  },

  downloadTemplate: async () => {
    const response = await api.get('/attendance/template', {
      responseType: 'blob'
    });
    return response;
  }
};

// Payroll services
export const payrollService = {
  generatePayslip: async (payrollData) => {
    const response = await api.post('/payroll/generate', payrollData);
    return response.data;
  },

  getPayslips: async (employeeId) => {
    const response = await api.get(`/payroll/payslips/${employeeId}`);
    return response.data;
  },

  submitTaxDeclaration: async (declarationData) => {
    const response = await api.post('/payroll/tax-declaration', declarationData);
    return response.data;
  },

  getTaxDeclaration: async (employeeId) => {
    const response = await api.get(`/payroll/tax-declaration/${employeeId}`);
    return response.data;
  },

  updateTaxDeclarationStatus: async (id, status) => {
    const response = await api.put(`/payroll/tax-declaration/${id}`, { status });
    return response.data;
  },

  bulkImportDeclarations: async (formData) => {
    const response = await api.post('/payroll/declarations/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  exportDeclarations: async () => {
    const response = await api.get('/payroll/declarations/export', {
      responseType: 'blob'
    });
    return response;
  },

  bulkApproveDeclarations: async (declarationIds) => {
    const response = await api.put('/payroll/declarations/bulk-approve', { declarationIds });
    return response.data;
  },

  downloadDeclarationTemplate: async () => {
    const response = await api.get('/payroll/declarations/template', {
      responseType: 'blob'
    });
    return response;
  }
};

// Department services
export const departmentService = {
  createDepartment: async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  getDepartment: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  updateDepartment: async (id, departmentData) => {
    const response = await api.put(`/departments/${id}`, departmentData);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  }
};

export const subDepartmentService = {
  createSubDepartment: async (subDepartmentData) => {
    const response = await api.post('/sub-departments', subDepartmentData);
    return response.data;
  },

  getAllSubDepartments: async () => {
    const response = await api.get('/sub-departments');
    return response.data;
  },

  getSubDepartment: async (id) => {
    const response = await api.get(`/sub-departments/${id}`);
    return response.data;
  },

  updateSubDepartment: async (id, subDepartmentData) => {
    const response = await api.put(`/sub-departments/${id}`, subDepartmentData);
    return response.data;
  },

  deleteSubDepartment: async (id) => {
    const response = await api.delete(`/sub-departments/${id}`);
    return response.data;
  }
};

// Designation services
export const designationService = {
  createDesignation: async (designationData) => {
    const response = await api.post('/designations', designationData);
    return response.data;
  },

  getDesignations: async () => {
    const response = await api.get('/designations');
    return response.data;
  },

  getDesignation: async (id) => {
    const response = await api.get(`/designations/${id}`);
    return response.data;
  },

  updateDesignation: async (id, designationData) => {
    const response = await api.put(`/designations/${id}`, designationData);
    return response.data;
  },

  deleteDesignation: async (id) => {
    const response = await api.delete(`/designations/${id}`);
    return response.data;
  }
};

// Branch services
export const branchService = {
  createBranch: async (branchData) => {
    const response = await api.post('/branches', branchData);
    return response.data;
  },

  getBranches: async () => {
    const response = await api.get('/branches');
    return response.data;
  },

  getBranch: async (id) => {
    const response = await api.get(`/branches/${id}`);
    return response.data;
  },

  updateBranch: async (id, branchData) => {
    const response = await api.put(`/branches/${id}`, branchData);
    return response.data;
  },

  deleteBranch: async (id) => {
    const response = await api.delete(`/branches/${id}`);
    return response.data;
  }
};

// Grades services
export const gradesService = {
  createGrade: async (gradeData) => {
    const response = await api.post('/grades', gradeData);
    return response.data;
  },

  getGrades: async () => {
    const response = await api.get('/grades');
    return response.data;
  },

  updateGrade: async (id, gradeData) => {
    const response = await api.put(`/grades/${id}`, gradeData);
    return response.data;
  },

  deleteGrade: async (id) => {
    const response = await api.delete(`/grades/${id}`);
    return response.data;
  }
};

export const categoryService = {
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export const reasonsService = {
  createReason: async (reasonData) => {
    const response = await api.post('/reasons', reasonData);
    return response.data;
  },

  getAllTerminationReasons: async () => {
    const response = await api.get('/reasons/termination');
    return response.data;
  },

  getAllResignationReasons: async () => {
    const response = await api.get('/reasons/resignation');
    return response.data;
  },

  updateReason: async (id, reasonData) => {
    const response = await api.put(`/reasons/${id}`, reasonData);
    return response.data;
  },

  deleteReason: async (id) => {
    const response = await api.delete(`/reasons/${id}`);
    return response.data;
  }
};

// Error handling wrapper
const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  throw new Error(errorMessage);
};

// Add error handling to all service methods
Object.values([employeeService, attendanceService, payrollService, branchService, departmentService]).forEach(service => {
  Object.keys(service).forEach(key => {
    const originalMethod = service[key];
    service[key] = async (...args) => {
      try {
        return await originalMethod(...args);
      } catch (error) {
        handleApiError(error);
      }
    };
  });
});

export default api;
