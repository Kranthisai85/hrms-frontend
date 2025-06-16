import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { authService } from "./services/api";

// Admin Components
import Home from "./components/Admin/Home";
import Navbar from "./components/Admin/Navbar";
import Sidebar from "./components/Admin/Sidebar";
// import UserRoles from "./components/Admin/UserRoles";
import Attendance from "./components/Admin/Attendance";
import Masters from "./components/Admin/Masters";
// import Hiring from "./components/Admin/Hiring";
// import { EmployeeProvider } from "./components/Admin/EmployeeContext";
import Employee from "./components/Admin/Employee";
import Payroll from "./components/Admin/Payroll";
import Reports from "./components/Admin/Reports";
// import Assets from "./components/Admin/Assets";
import LoginPage from "./components/auth/LoginPage";

// Employee Components
// import EmployeeDashboard from "./Employee/EmployeeDashboard";
import EmployeeAttendance from "./Employee/EmployeeAttendance";
import EmployeeHome from "./Employee/EmployeeHome";
import EmployeePayroll from "./Employee/EmployeePayroll";
import EmployeeProfile from "./Employee/EmployeeProfile";
import EmployeeReports from "./Employee/EmployeeReports";
// import EmployeeHelp from "./Employee/EmployeeHelp";
// import InvestmentDeclaration from "./Employee/InvestmentDeclaration";
import "./App.css";
import EmployeeNavbar from "./Employee/EmployeeNavbar";
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import Toast from './Toast';


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

  const handleLogin = (type) => {
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", type);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserType("");
    window.location.href = "/login"; // Force redirect to login
  };

  const renderAdminContent = (pageName) => {
    const props = { darkMode };
    switch (pageName) {
      case "Home":
        return <Home {...props} />;
      // case "User Roles":
      //   return <UserRoles {...props} />;
      case "Masters":
        return <Masters {...props} />;
      case "Time & Attendance":
        return <Attendance {...props} />;
      // case "Hiring":
      //   return <Hiring {...props} />;
      case "Employee":
        return <Employee {...props} />;
      case "Payroll":
        return <Payroll {...props} />;
      case "Reports":
        return <Reports {...props} />;
      // case "Assets":
      //   return <Assets {...props} />;
      // case "Help":
      //   return <Help {...props} />;
      default:
        return <Home {...props} />;
    }
  };

  return (
    <Router>
      <Toast />
      <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
        {isAuthenticated && (
          <>
            {userType === "admin" ? (
              <Sidebar
                setCurrentPage={setCurrentPage}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            ) : (
              <EmployeeSidebar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout} // Add this prop
              />
            )}
          </>
        )}
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
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-2">
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
                      {/* <Route
                        path="/user-roles"
                        element={renderAdminContent("User Roles")}
                      /> */}
                      <Route
                        path="masters"
                        element={renderAdminContent("Masters")}
                      />
                      <Route
                        path="time-attendance"
                        element={renderAdminContent("Time & Attendance")}
                      />
                      {/* <Route
                        path="hiring"
                        element={renderAdminContent("Hiring")}
                      /> */}
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
                      {/* <Route
                        path="assets"
                        element={renderAdminContent("Assets")}
                      /> */}
                      <Route path="help" element={renderAdminContent("Help")} />
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

                      {/* <Route
                        path="payroll/investment-declaration"
                        element={<InvestmentDeclaration />}
                      /> */}
                      <Route
                        path="attendance"
                        element={<EmployeeAttendance />}
                      />
                      {/* <Route path="help" element={<EmployeeHelp />} /> */}
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

              {/* Catch-all route */}
              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      isAuthenticated
                        ? userType === "admin"
                          ? "/admin/home"
                          : "/employee/home"
                        : "/login"
                    }
                    replace
                  />
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
