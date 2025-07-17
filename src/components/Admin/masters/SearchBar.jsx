import { Search } from "lucide-react";

export default function SearchBar({ darkMode, searchTerm, setSearchTerm }) {
  return (
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
}