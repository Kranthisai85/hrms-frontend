import { useState } from 'react';

const FloatingInput = ({
    id,
    label,
    value,
    onChange,
    type = 'text',
    required = false,
    error,
    darkMode,
    small = false
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Determine if the label should be in the "floating" state (top) or inside the input
    const isLabelFloating = isFocused || value;

    return (
        <div className="relative mb-4">
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={required}
                className={`block text-sm w-full rounded-lg border p-3.5 
                    ${error ? 'border-red-500' : isFocused ? 'border-blue-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-0
                    ${'bg-white text-gray-900'}
                    ${error ? 'hover:border-red-500' : 'hover:border-blue-600'}`}
                style={{
                    boxShadow: isFocused ? '0 0 0 1px #2563eb' : 'none',
                }}
            />
            {/* ${small ? 'w-1/2' : ''} // Conditional width */}
            <label
                htmlFor={id}
                className={`absolute text-sm 
                    ${error ? 'text-red-500' : isFocused ? 'text-blue-600' : 'text-gray-500'}
                    duration-300 transform 
                    ${isLabelFloating ? '-translate-y-4 scale-75' : 'translate-y-2 scale-100'}
                    top-2 z-10 origin-[0]
                    ${'bg-white'} px-2 left-1`}
            >
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default FloatingInput;