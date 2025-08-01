import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { authService } from "./services/api";

// Admin Components
import Home from "./components/Admin/Home";
import Navbar from "./components/Admin/Navbar";
import Sidebar from "./components/Admin/Sidebar";
import Attendance from "./components/Admin/Attendance";
import Employee from "./components/Admin/Employee";
import Payroll from "./components/Admin/Payroll";
import Reports from "./components/Admin/Reports";
import LoginPage from "./components/auth/LoginPage";

// Employee Components
import EmployeeAttendance from "./Employee/EmployeeAttendance";
import EmployeeHome from "./Employee/EmployeeHome";
import EmployeePayroll from "./Employee/EmployeePayroll";
import EmployeeProfile from "./Employee/EmployeeProfile";
import EmployeeReports from "./Employee/EmployeeReports";
import "./App.css";
import EmployeeNavbar from "./Employee/EmployeeNavbar";
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import Toast from "./Toast";
import Masters from "./components/Admin/masters/Masters";
import AuthHandler from "./components/auth/AuthHandler"; // New component for handling authentication

function ProtectedRoute({ children, allowedUserType }) {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (userType !== allowedUserType) {
      navigate(userType === "admin" ? "/admin/home" : "/employee/home");
    }
  }, [isAuthenticated, navigate, allowedUserType, userType]);

  return isAuthenticated && userType === allowedUserType ? children : null;
}

function URLParameterHandler({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const companyId = urlParams.get('companyId');
    const superAdminID = urlParams.get('superAdminID');
    const password = urlParams.get('password');

    console.log(companyId, superAdminID, password);

    if (companyId && superAdminID && password) {
      // Auto-login with URL parameters
      onLogin('admin', companyId, superAdminID);
      
      // Clear URL parameters after login
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Navigate to admin home
      navigate('/admin/home');
    }
  }, [location, onLogin, navigate]);

  return null;
}

function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType") || "";
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", String(newMode));
      return newMode;
    });
  };

  const handleLogin = (type, companyId, superAdminID) => {
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", type);
    localStorage.setItem("companyId", companyId);
    localStorage.setItem("superAdminID", superAdminID);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserType("");
    window.location.href = "/login"; // Force redirect to login
  };

  const renderAdminContent = (pageName) => {
    const props = {
      darkMode,
      setCurrentPage,
      toggleDarkMode,
    };
    switch (pageName) {
      case "Home":
        return <Home {...props} />;
      case "Masters":
        return <Masters {...props} />;
      case "Time & Attendance":
        return <Attendance {...props} />;
      case "Employee":
        return <Employee {...props} />;
      case "Payroll":
        return <Payroll {...props} />;
      case "Reports":
        return <Reports {...props} />;
      default:
        return <Home {...props} />;
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <Router>
        <Toast />
        <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
          <div className="flex items-center justify-center w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Processing authentication...</p>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <Toast />
      <AuthHandler
        setIsAuthenticated={setIsAuthenticated}
        setUserType={setUserType}
        setIsCheckingAuth={setIsCheckingAuth}
      />
      <URLParameterHandler onLogin={handleLogin} />
      <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
        <div className="flex flex-col flex-1 overflow-hidden">
          {isAuthenticated && (
            <>
              {userType === "admin" ? (
                <Navbar
                  currentPage={currentPage}
                  darkMode={darkMode}
                  handleLogout={handleLogout}
                />
              ) : (
                <EmployeeNavbar
                  currentPage={currentPage}
                  darkMode={darkMode}
                  handleLogout={handleLogout}
                />
              )}
            </>
          )}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <Routes>
              {/* Login Route */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate
                      to={
                        userType === "admin" ? "/admin/home" : "/employee/home"
                      }
                      replace
                    />
                  ) : (
                    <LoginPage onLogin={handleLogin} darkMode={darkMode} />
                  )
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedUserType="admin">
                    <Routes>
                      <Route
                        path="/home"
                        element={renderAdminContent("Home")}
                      />
                      <Route
                        path="masters"
                        element={renderAdminContent("Masters")}
                      />
                      <Route
                        path="time-attendance"
                        element={renderAdminContent("Time & Attendance")}
                      />
                      <Route
                        path="employee"
                        element={renderAdminContent("Employee")}
                      />
                      <Route
                        path="payroll"
                        element={renderAdminContent("Payroll")}
                      />
                      <Route
                        path="reports"
                        element={renderAdminContent("Reports")}
                      />
                    </Routes>
                  </ProtectedRoute>
                }
              />

              {/* Employee Routes */}
              <Route
                path="/employee/*"
                element={
                  <ProtectedRoute allowedUserType="employee">
                    <Routes>
                      <Route path="home" element={<EmployeeHome />} />
                      <Route path="profile" element={<EmployeeProfile />} />
                      <Route path="payroll" element={<EmployeePayroll />} />
                      <Route path="reports" element={<EmployeeReports />} />
                      <Route
                        path="attendance"
                        element={<EmployeeAttendance />}
                      />
                    </Routes>
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate
                      to={
                        userType === "admin" ? "/admin/home" : "/employee/home"
                      }
                      replace
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;