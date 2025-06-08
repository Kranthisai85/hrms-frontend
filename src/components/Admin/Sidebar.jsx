import { BarChart2, CalendarClock, FileText, HandCoins, Moon, Sun, Users } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"

const navItems = [
  // { name: "Home", icon: <Home className="w-5 h-5" /> },
  { name: "Masters", icon: <FileText className="w-5 h-5" /> },
  // { name: "User Roles", icon: <UserCog  className="w-5 h-5" /> },
  // { name: "Hiring", icon: <UserRoundSearch className="w-5 h-5" /> },
  { name: "Employee", icon: <Users className="w-5 h-5" /> },
  { name: "Time & Attendance", icon: <CalendarClock className="w-5 h-5" /> },
  { name: "Payroll", icon: <HandCoins className="w-5 h-5" /> },
  { name: "Reports", icon: <BarChart2 className="w-5 h-5" /> },
  // { name: "Assets", icon: <Box className="w-5 h-5" /> },
  // { name: "Comm's", icon: <MessageSquare className="w-5 h-5" /> },
  // { name: "Utilities", icon: <Settings className="w-5 h-5" /> },
  // { name: "Help", icon: <HelpCircle className="w-5 h-5" /> },
]

export default function Sidebar({ setCurrentPage, darkMode, toggleDarkMode }) {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate("/home")
    setCurrentPage("Home")
  }

  return (
    <aside
      className={`w-16 h-screen px-2 sticky left-0 top-0 z-50 flex flex-col justify-between ${darkMode ? 'bg-[#1A1918]' : 'bg-[#F5F5F5]'
        }`}
    >
      <div className="flex flex-col items-center py-4">
        <button
          onClick={handleLogoClick}
          className={`mb-8 ${darkMode ? 'text-[#C8BCF6]' : 'text-[#1A1918]'}`}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>

        <nav className="flex flex-col items-center space-y-4">
          {navItems.map((item, index) => (
            <div key={index} className="relative group">
              <Link
                to={`/admin/${item.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                onClick={() => setCurrentPage(item.name)}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors duration-200 ${darkMode
                    ? 'text-[#C0BFBD] hover:bg-[#1F1F22] hover:text-[#C8BCF6]'
                    : 'text-[#1A1918] hover:bg-[#EFEFEF] hover:text-[#C8BCF6]'
                  }`}
              >
                {item.icon}
              </Link>
              <span
                className={`absolute left-full ml-2 px-2 py-1 rounded text-xs transition-opacity duration-200 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-[#1F1F22] text-[#C0BFBD]' : 'bg-[#EFEFEF] text-[#1A1918]'
                  }`}
              >
                {item.name}
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="mb-4 flex flex-col items-center space-y-2">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors duration-200 ${darkMode
              ? 'bg-[#1F1F22] text-[#a495e1] hover:bg-[#1F1F22]'
              : 'bg-[#EFEFEF] text-[#1A1918] hover:bg-[#EFEFEF] hover:text-[#C8BCF6]'
            }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </aside>
  )
}