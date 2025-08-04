import { BarChart2, CalendarClock, FileText, HandCoins, Moon, Sun, Users } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"

const navItems = [
  { name: "Masters", icon: <FileText className="w-5 h-5" /> },
  { name: "Employee", icon: <Users className="w-5 h-5" /> },
  // { name: "Time & Attendance", icon: <CalendarClock className="w-5 h-5" /> },
  // { name: "Payroll", icon: <HandCoins className="w-5 h-5" /> },
  // { name: "Reports", icon: <BarChart2 className="w-5 h-5" /> },
]

export default function Sidebar({ setCurrentPage, darkMode, toggleDarkMode }) {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate("/home")
    setCurrentPage("Home")
  }

  return (
    <aside className="w-44 h-screen bg-[#F5F5F5] shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4">
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={`/admin/${item.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                onClick={() => setCurrentPage(item.name)}
                className="flex items-center space-x-4 px-4 py-3.5 text-gray-700 hover:text-gray-900 hover:bg-white rounded-xl transition-all duration-200 group"
              >
                <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                  {item.icon}
                </span>
                <span className="font-medium text-sm">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Dark Mode Toggle */}
        {/* <div className="p-4 border-t border-gray-100">
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-4 w-full px-4 py-3.5 text-gray-700 hover:text-gray-900 hover:bg-white rounded-xl transition-all duration-200 group"
          >
            <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </span>
            <span className="font-medium text-sm">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div> */}
      </div>
    </aside>
  )
}