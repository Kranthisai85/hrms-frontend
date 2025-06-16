import { useEffect, useState } from 'react';
import Select from 'react-select';

const SearchableSelect = ({
    id,
    label,
    value,
    onChange,
    fetchOptions,
    darkMode,
    staticOptions, // Added to support static options
    required = false,
    isEmployee = false,
    error,
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const loadOptions = async () => {
            if (staticOptions) {
                // Use static options if provided
                setOptions(staticOptions);
                return;
            }
            setLoading(true);
            try {
                const response = await fetchOptions();
                const data = response.data;
                const formattedOptions = data.map(item => ({
                    value: item.id,
                    label: isEmployee ? `${item.employeeId} - ${item.firstName} ${item.lastName}` : item.name,
                }));
                setOptions(formattedOptions);
            } catch (error) {
                console.error(`Failed to fetch ${label}:`, error);
                setFetchError(`Failed to load ${label.toLowerCase()}. Please try again.`);
            } finally {
                setLoading(false);
            }
        };
        loadOptions();
    }, [fetchOptions, label]);

    return (
        <div className="relative mb-4">
            <Select
                id={id}
                name={id}
                value={options.find(option => option.value === value) || null}
                onChange={(selectedOption) =>
                    onChange({
                        target: { name: id, value: selectedOption ? selectedOption.value : '' },
                    })
                }
                options={options}
                placeholder={`Select ${label}`}
                isSearchable
                isLoading={loading}
                isDisabled={loading || !!fetchError}
                classNamePrefix="react-select"
                className={`text-sm ${error ? 'border-red-500' : ''}`}
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        border: error
                            ? '1px solid #ef4444'
                            : state.isFocused
                                ? '1px solid #2563eb'
                                : '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none',
                        '&:hover': {
                            border: error ? '1px solid #ef4444' : '1px solid #2563eb',
                        },
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                    }),
                    menu: (provided) => ({
                        ...provided,
                        zIndex: 20,
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                            ? darkMode
                                ? '#3b82f6'
                                : '#2563eb'
                            : state.isFocused
                                ? darkMode
                                    ? '#4b5563'
                                    : '#f3f4f6'
                                : darkMode
                                    ? '#1f2937'
                                    : '#ffffff',
                        color: darkMode ? '#ffffff' : '#111827',
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        color: darkMode ? '#ffffff' : '#111827',
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        color: error ? '#ef4444' : '#6b7280',
                    }),
                }}
            />
            <label
                htmlFor={id}
                className={`absolute text-sm ${error ? 'text-red-500' : 'text-gray-500'
                    } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] ${darkMode ? 'bg-gray-800' : 'bg-white'
                    } px-2 peer-focus:text-blue-600 left-1`}
            >
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            {fetchError && <p className="mt-1 text-xs text-red-500">{fetchError}</p>}
        </div>
    );
};

export default SearchableSelect;