import React, { useState, useRef, useEffect } from "react"
import { User, LogOut, ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function Navbar({ darkMode, handleLogout, companyName }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  const getCurrentPageName = () => {
    const path = location.pathname
    if (path === '/employee/home') return 'Home'
    if (path === '/employee/profile') return 'Profile'
    if (path === '/employee/attendance') return 'Attendance'
    if (path === '/employee/payroll') return 'Payroll'
    if (path === '/employee/reports') return 'Reports'
    return ''
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  return (
    <nav className={`shadow-sm z-10 sticky top-0 ${darkMode ? 'bg-[#1A1918] text-[#C0BFBD]' : 'bg-[#F5F5F5] text-[#1A1918]'}`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between h-20">
          <div className="flex flex-col justify-center">
            <div className="flex-shrink-0">
              <h2 className={`text-xl font-bold truncate ${darkMode ? 'text-[#C8BCF6]' : 'text-[#1A1918]'}`}>
                {companyName || "Employee Dashboard"} {/* Company name dynamically displayed */}
              </h2>
            </div>
            <div className={`flex items-center text-sm ${darkMode ? 'text-[#C0BFBD]' : 'text-[#1A1918]'}`}>
              <span className="font-medium"><b>Home</b></span>
              {getCurrentPageName() && location.pathname !== '/employee/home' && (
                <>
                  <span className="mx-2">&gt;&gt;</span>
                  <span>{getCurrentPageName()}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-label="User menu"
                aria-haspopup="true"
              >
                <span className={`text-sm mr-2 hidden sm:inline ${darkMode ? 'text-[#C0BFBD]' : 'text-[#1A1918]'}`}>
                  John Doe
                </span>
                <User className={`h-8 w-8 rounded-full p-1 ${darkMode ? 'bg-[#1F1F22] text-[#C8BCF6]' : 'bg-[#EFEFEF] text-[#1A1918]'}`} />
                <ChevronDown className={`ml-1 h-4 w-4 ${darkMode ? 'text-[#C0BFBD]' : 'text-[#1A1918]'}`} />
              </button>
              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? 'bg-[#1F1F22]' : 'bg-white'}`}>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsDropdownOpen(false)
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? 'text-[#C0BFBD] hover:bg-[#1A1918] hover:text-[#C8BCF6]' : 'text-[#1A1918] hover:bg-[#8d58ef] hover:text-[#000000]'}`}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
