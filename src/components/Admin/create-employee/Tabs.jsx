export function Tabs({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'org', label: 'Org Details' },
        { id: 'personal', label: 'Personal' },
        { id: 'family', label: 'Family' },
        { id: 'bank', label: 'Bank' },
        { id: 'educational', label: 'Educational' },
        { id: 'professional', label: 'Profession' },
        { id: 'documents', label: 'Documents' },
    ];

    return (
        <div className="flex border-b">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`py-2 px-6 ${activeTab === tab.id
                            ? 'bg-gray-100 font-semibold border-b-2 border-blue-500'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}