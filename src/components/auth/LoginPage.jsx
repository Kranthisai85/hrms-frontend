import React, { useState, useEffect } from 'react';
import { authService, companyService } from '../../services/api';

export default function LoginPage({ onLogin, darkMode }) {
  const [userType, setUserType] = useState('admin');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);

  // Fetch company info based on current domain
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const data = await companyService.getCompanyByDomain();
        
        if (data.success && data.data && data.data.company) {
          setCompanyInfo(data.data.company);
        } else {
          console.warn('Company info not found or invalid response');
        }
      } catch (error) {
        console.error('Failed to fetch company info:', error);
        // Don't show error to user, just log it
      } finally {
        setCompanyLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(credentials.email, credentials.password);
      if (response.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', userType);
        onLogin(userType);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Company Info Display */}
        {!companyLoading && companyInfo && (
          <div className="text-center mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-1">
                Welcome to
              </h3>
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {companyInfo.name}
              </h2>
              {/* <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                {companyInfo.domain}
              </p> */}
            </div>
          </div>
        )}
        
        {companyLoading && (
          <div className="text-center mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-32 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 mx-auto"></div>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                User Type
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
