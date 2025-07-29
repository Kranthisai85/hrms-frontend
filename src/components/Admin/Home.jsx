import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'

function Home({ darkMode, setCurrentPage, toggleDarkMode }) {
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col items-center justify-center h-full ${
            darkMode ? 'bg-[#1A1918] text-[#C0BFBD]' : 'bg-[#F5F5F5] text-[#1A1918]'
          }`}
        >
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1.3 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 30 }}
            className={`text-4xl font-bold mb-4 ${darkMode ? 'text-[#C8BCF6]' : 'text-[#1A1918]'}`}
          >
            Welcome to HR Management System
          </motion.h1>
          <p className="text-xl mb-8">
            Your comprehensive solution for HR operations by{' '}
            <small className="text-[#C8BCF6]">@Paytiemp Smartech Solutions</small>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {[
              { title: "Employee Management", description: "Streamline your workforce operations" },
              { title: "Time & Attendance", description: "Track and manage employee time efficiently" },
              { title: "Payroll Processing", description: "Simplify your payroll operations" }
            ].map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-lg ${
                  darkMode ? 'bg-[#1F1F22]' : 'bg-white'
                } shadow-lg`}
              >
                <h2 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-[#C8BCF6]' : 'text-[#1A1918]'}`}>
                  {card.title}
                </h2>
                <p className={darkMode ? 'text-[#C0BFBD]' : 'text-[#1A1918]'}>
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

Home.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
}

export default Home