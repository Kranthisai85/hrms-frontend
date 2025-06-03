import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Clock, User, Sun, Moon, HandCoins, BarChart2} from 'lucide-react';

export default function EmployeeSidebar({ darkMode, toggleDarkMode, handleLogout }) {
  const navigate = useNavigate();

  // const handleLogoutClick = () => {
  //   if (handleLogout) {
  //     handleLogout();
  //     navigate('/login'); // Ensure navigation to login after logout
  //   } else {
  //     console.error("handleLogout is not defined");
  //   }
  // };

  return (
    <aside className="w-52 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-xl mt-14 mb font-bold text-gray-800 dark:text-white">Employee Portal</h2>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link
            to="/employee/home"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-3" />
            Home
          </Link>
          <Link
            to="/employee/profile"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </Link>
          
          <Link
            to="/employee/attendance"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Clock className="w-5 h-5 mr-3" />
            Attendance
          </Link>
          <Link
            to="/employee/payroll"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HandCoins className="w-5 h-5 mr-3" />
            Payroll
          </Link>
          <Link
            to="/employee/reports"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <BarChart2 className="w-5 h-5 mr-3" />
            Reports
          </Link>
          {/* <Link
            to="/employee/help"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HelpCircle className="w-5 h-5 mr-3" />
            Help
          </Link> */}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
{/* 
          <button
            onClick={handleLogoutClick}
            className="flex items-center w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button> */}
        </div>
      </div>
    </aside>
  );
}
