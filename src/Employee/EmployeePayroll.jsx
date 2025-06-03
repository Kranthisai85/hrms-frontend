import { useState } from "react"
import { FileUp, X } from "lucide-react"
import { format } from "date-fns"

const FloatingInput = ({ id, label, value, onChange, type = "text", required = false }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
  </div>
)

const FloatingTextArea = ({ id, label, value, onChange, required = false }) => (
  <div className="relative">
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      rows="3"
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
    ></textarea>
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
  </div>
)

export default function EmployeePayroll() {
  const [selectedYear, setSelectedYear] = useState("2024-25")
  const [taxRegime, setTaxRegime] = useState("new")
  const [activeTab, setActiveTab] = useState("investment-declaration")
  const [activeInnerTab, setActiveInnerTab] = useState("house-rent")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [investmentDeclaration, setInvestmentDeclaration] = useState({
    houseRent: {
      cityType: "metro",
      rentPaid: "",
      periods: [],
      landlordPan: "",
      address: "",
    },
    section80C: {
      lifeInsurance: "",
      ppf: "",
      vpf: "",
      pensionFund: "",
      nsc: "",
      nscInterest: "",
      ulip: "",
      elss: "",
      tuitionFees: "",
      houseLoanPrincipal: "",
      registrationCharges: "",
      sukanyaSamriddhi: "",
      infrastructureBonds: "",
      fixedDeposit: "",
    },
    sectionVIA: {
      section80D: {
        self: "",
        parents: "",
        isSelfSeniorCitizen: false,
        isParentsSeniorCitizen: false,
        preventiveHealthCheckup: "",
      },
      section80DD: "",
      section80E: "",
      section80U: "",
      section80CCD1B: "",
      section80EE: "",
      section80DDB: "",
    },
    houseProperty: {
      propertyType: "self-occupied",
      loanTakenBeforeApril1999: false,
      interest: "",
      rentalIncome: "",
      address: "",
    },
  })

  const handleInputChange = (section, field, value) => {
    setInvestmentDeclaration((prev) => {
      if (typeof field === "string") {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        }
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field[0]]: {
              ...prev[section][field[0]],
              [field[1]]: value,
            },
          },
        }
      }
    })
  }

  const handleSaveSection = (section) => {
    console.log(`Saving ${section} section:`, investmentDeclaration[section])
    // Implement the actual save logic here
  }

  const handleDocumentUpload = (documentData) => {
    setUploadedDocuments((prev) => [...prev, documentData])
  }

  const renderHouseRentDetails = () => (
    <div className="space-y-2 grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="flex space-x-10">
        <label className="flex items-center">
          <input
            type="radio"
            name="cityType"
            value="metro"
            checked={investmentDeclaration.houseRent.cityType === "metro"}
            onChange={(e) => handleInputChange("houseRent", "cityType", e.target.value)}
            className="mr-2"
          />
          Metro
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="cityType"
            value="non-metro"
            checked={investmentDeclaration.houseRent.cityType === "non-metro"}
            onChange={(e) => handleInputChange("houseRent", "cityType", e.target.value)}
            className="mr-2"
          />
          Non-Metro
        </label>
      </div>
      <FloatingInput
        id="rentPaid"
        label="Total Rent Paid/Payable"
        type="number"
        value={investmentDeclaration.houseRent.rentPaid}
        onChange={(e) => handleInputChange("houseRent", "rentPaid", e.target.value)}
        required
      />
      <FloatingInput
        id="landlordPan"
        label="Landlord PAN"
        value={investmentDeclaration.houseRent.landlordPan}
        onChange={(e) => handleInputChange("houseRent", "landlordPan", e.target.value)}
        required
      />
      <FloatingInput
        id="houseRentAddress"
        label="Address"
        value={investmentDeclaration.houseRent.address}
        onChange={(e) => handleInputChange("houseRent", "address", e.target.value)}
        required
      />
    </div>
  )

  const renderSection80C = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <FloatingInput
          id="lifeInsurance"
          label="Life Insurance Premium"
          type="number"
          value={investmentDeclaration.section80C.lifeInsurance}
          onChange={(e) => handleInputChange("section80C", "lifeInsurance", e.target.value)}
        />
        <FloatingInput
          id="ppf"
          label="Public Provident Fund (PPF)"
          type="number"
          value={investmentDeclaration.section80C.ppf}
          onChange={(e) => handleInputChange("section80C", "ppf", e.target.value)}
        />
        <FloatingInput
          id="vpf"
          label="Voluntary Provident Fund (VPF)"
          type="number"
          value={investmentDeclaration.section80C.vpf}
          onChange={(e) => handleInputChange("section80C", "vpf", e.target.value)}
        />
        <FloatingInput
          id="pensionFund"
          label="Pension Fund Contribution"
          type="number"
          value={investmentDeclaration.section80C.pensionFund}
          onChange={(e) => handleInputChange("section80C", "pensionFund", e.target.value)}
        />
        <FloatingInput
          id="nsc"
          label="National Savings Certificate (NSC)"
          type="number"
          value={investmentDeclaration.section80C.nsc}
          onChange={(e) => handleInputChange("section80C", "nsc", e.target.value)}
        />
        <FloatingInput
          id="nscInterest"
          label="Interest Accrued on NSC (Reinvested)"
          type="number"
          value={investmentDeclaration.section80C.nscInterest}
          onChange={(e) => handleInputChange("section80C", "nscInterest", e.target.value)}
        />
        <FloatingInput
          id="ulip"
          label="Unit Linked Insurance Policy (ULIP)"
          type="number"
          value={investmentDeclaration.section80C.ulip}
          onChange={(e) => handleInputChange("section80C", "ulip", e.target.value)}
        />
        <FloatingInput
          id="elss"
          label="Equity Linked Savings Schemes (ELSS)"
          type="number"
          value={investmentDeclaration.section80C.elss}
          onChange={(e) => handleInputChange("section80C", "elss", e.target.value)}
        />
        <FloatingInput
          id="tuitionFees"
          label="Payment of Tuition Fees (Max 2 Children)"
          type="number"
          value={investmentDeclaration.section80C.tuitionFees}
          onChange={(e) => handleInputChange("section80C", "tuitionFees", e.target.value)}
        />
        <FloatingInput
          id="houseLoanPrincipal"
          label="Principal Repayment of Housing Loan"
          type="number"
          value={investmentDeclaration.section80C.houseLoanPrincipal}
          onChange={(e) => handleInputChange("section80C", "houseLoanPrincipal", e.target.value)}
        />
        <FloatingInput
          id="registrationCharges"
          label="Registration Charges for Buying House (1 Year Only)"
          type="number"
          value={investmentDeclaration.section80C.registrationCharges}
          onChange={(e) => handleInputChange("section80C", "registrationCharges", e.target.value)}
        />
        <FloatingInput
          id="sukanyaSamriddhi"
          label="Sukanya Samriddhi Yojana"
          type="number"
          value={investmentDeclaration.section80C.sukanyaSamriddhi}
          onChange={(e) => handleInputChange("section80C", "sukanyaSamriddhi", e.target.value)}
        />
        <FloatingInput
          id="infrastructureBonds"
          label="Infrastructure Bonds"
          type="number"
          value={investmentDeclaration.section80C.infrastructureBonds}
          onChange={(e) => handleInputChange("section80C", "infrastructureBonds", e.target.value)}
        />
        <FloatingInput
          id="fixedDeposit"
          label="Bank Fixed Deposit (5+ Years)"
          type="number"
          value={investmentDeclaration.section80C.fixedDeposit}
          onChange={(e) => handleInputChange("section80C", "fixedDeposit", e.target.value)}
        />
      </div>
    </div>
  )

  const renderSectionVIA = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Section 80D</h4>
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <FloatingInput
              id="section80DSelf"
              label="Self"
              type="number"
              value={investmentDeclaration.sectionVIA.section80D.self}
              onChange={(e) => handleInputChange("sectionVIA", ["section80D", "self"], e.target.value)}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selfSeniorCitizen"
                checked={investmentDeclaration.sectionVIA.section80D.isSelfSeniorCitizen}
                onChange={(e) =>
                  handleInputChange("sectionVIA", ["section80D", "isSelfSeniorCitizen"], e.target.checked)
                }
                className="mr-2"
              />
              <label htmlFor="selfSeniorCitizen">Senior Citizen</label>
            </div>
            <FloatingInput
              id="section80DParents"
              label="Parents"
              type="number"
              value={investmentDeclaration.sectionVIA.section80D.parents}
              onChange={(e) => handleInputChange("sectionVIA", ["section80D", "parents"], e.target.value)}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="parentsSeniorCitizen"
                checked={investmentDeclaration.sectionVIA.section80D.isParentsSeniorCitizen}
                onChange={(e) =>
                  handleInputChange("sectionVIA", ["section80D", "isParentsSeniorCitizen"], e.target.checked)
                }
                className="mr-2"
              />
              <label htmlFor="parentsSeniorCitizen">Senior Citizen</label>
            </div>
            <FloatingInput
              id="PreventiveHealthCheckup"
              label="Preventive Health Checkup"
              type="number"
              value={investmentDeclaration.sectionVIA.section80D.preventiveHealthCheckup}
              onChange={(e) =>
                handleInputChange("sectionVIA", ["section80D", "preventiveHealthCheckup"], e.target.value)
              }
            />
          </div>
        </div>
        <div className="border p-2 rounded-lg col-span-2">
          <h4 className="font-semibold mb-2">Other VI-A Deductions</h4>

          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <FloatingInput
              id="section80DD"
              label="Sec 80DD (Dependent Medical Treatment)"
              type="number"
              value={investmentDeclaration.sectionVIA.section80DD}
              onChange={(e) => handleInputChange("sectionVIA", "section80DD", e.target.value)}
            />
            <FloatingInput
              id="section80DDB"
              label="Sec 80DDB (Medical Treatment)"
              type="number"
              value={investmentDeclaration.sectionVIA.section80DDB}
              onChange={(e) => handleInputChange("sectionVIA", "section80DDB", e.target.value)}
            />
            <FloatingInput
              id="section80E"
              label="Sec 80E (Education Loan Interest)"
              type="number"
              value={investmentDeclaration.sectionVIA.section80E}
              onChange={(e) => handleInputChange("sectionVIA", "section80E", e.target.value)}
            />
            <FloatingInput
              id="section80EE"
              label="Sec 80EE (Interest on Home Loan)"
              type="number"
              value={investmentDeclaration.sectionVIA.section80EE}
              onChange={(e) => handleInputChange("sectionVIA", "section80EE", e.target.value)}
            />
            <FloatingInput
              id="section80U"
              label="Sec 80U (For Disability)"
              type="number"
              value={investmentDeclaration.sectionVIA.section80U}
              onChange={(e) => handleInputChange("sectionVIA", "section80U", e.target.value)}
            />
            <FloatingInput
              id="section80CCD1B"
              label="Sec 80CCD(1B) (National Pension Scheme)"
              type="number"
              value={investmentDeclaration.sectionVIA.section80CCD1B}
              onChange={(e) => handleInputChange("sectionVIA", "section80CCD1B", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderHousePropertyDetails = () => (
    <div className="space-y-4">
      {/* Property Type Selection */}
      <div className="flex space-x-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="propertyType"
            value="self-occupied"
            checked={investmentDeclaration.houseProperty.propertyType === "self-occupied"}
            onChange={(e) => handleInputChange("houseProperty", "propertyType", e.target.value)}
            className="mr-2"
          />
          Self Occupied Property
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="propertyType"
            value="let-out"
            checked={investmentDeclaration.houseProperty.propertyType === "let-out"}
            onChange={(e) => handleInputChange("houseProperty", "propertyType", e.target.value)}
            className="mr-2"
          />
          Let Out (Rental) Property
        </label>
      </div>

      {/* Loan Checkbox */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="loanTakenBeforeApril1999"
          checked={investmentDeclaration.houseProperty.loanTakenBeforeApril1999}
          onChange={(e) => handleInputChange("houseProperty", "loanTakenBeforeApril1999", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="loanTakenBeforeApril1999">Loan taken before April 1999</label>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FloatingInput
          id="interestPaid"
          label="Interest paid on borrowed capital"
          type="number"
          value={investmentDeclaration.houseProperty.interest}
          onChange={(e) => handleInputChange("houseProperty", "interest", e.target.value)}
        />
        {investmentDeclaration.houseProperty.propertyType === "let-out" && (
          <FloatingInput
            id="rentalIncome"
            label="Annual rental income"
            type="number"
            value={investmentDeclaration.houseProperty.rentalIncome}
            onChange={(e) => handleInputChange("houseProperty", "rentalIncome", e.target.value)}
          />
        )}
      </div>

      {/* Address Field */}
      <FloatingInput
        id="propertyAddress"
        label="Address of the property"
        value={investmentDeclaration.houseProperty.address}
        onChange={(e) => handleInputChange("houseProperty", "address", e.target.value)}
      />
    </div>
  )

  const renderProofDocuments = () => (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Proof Documents</h3>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="text-green-500 flex items-center hover:text-green-600 text-sm"
        >
          <FileUp className="mr-1" size={16} />
          Drop Files Here
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ maxHeight: "300px", overflowY: "auto" }}>
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sr. No.</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Document Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">File Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Updated</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Comments</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {uploadedDocuments.map((doc, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm">{doc.documentName}</td>
                <td className="px-4 py-2 text-sm">{doc.fileName}</td>
                <td className="px-4 py-2 text-sm">{format(new Date(doc.lastUpdated), "dd-MMM-yyyy")}</td>
                <td className="px-4 py-2 text-sm">{doc.comment}</td>
                <td className="px-4 py-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Uploaded</span>
                </td>
              </tr>
            ))}
            {uploadedDocuments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No documents uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-8xl h-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${
              activeTab === "investment-declaration"
                ? "bg-gray-100 font-semibold border-b-2 border-blue-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("investment-declaration")}
          >
            Investment Declaration
          </button>
          {/* Additional tabs can be added here in the future */}
        </div>
        <div className="flex space-x-4 m-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
          <select
            value={taxRegime}
            onChange={(e) => setTaxRegime(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="new">New Tax Regime</option>
            <option value="old">Old Tax Regime</option>
          </select>
        </div>

        {activeTab === "investment-declaration" && (
          <div>
            {taxRegime === "new" ? (
              <div className="text-center py-8">
                <p className="text-lg font-semibold">Default New tax regime will be considered here.</p>
                <p className="text-gray-600 mt-2">
                  If you have any tax saving investments, select old tax regime and save your investments.
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <input
                    type="checkbox"
                    id="confirmNewRegime"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="confirmNewRegime" className="text-sm text-gray-700">
                    I confirm that I want to opt for the new tax regime
                  </label>
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    // Add your save logic for new tax regime here
                    console.log("New tax regime selection saved");
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="flex border-b">
                    {["House Rent", "Section 80C", "Chapter VI-A", "House Property"].map((tab) => (
                      <button
                        key={tab}
                        className={`py-2 px-6 ${
                          activeInnerTab === tab.toLowerCase().replace(" ", "-")
                            ? "bg-gray-100 font-semibold border-b-2 border-blue-500"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveInnerTab(tab.toLowerCase().replace(" ", "-"))}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  {activeInnerTab === "house-rent" && renderHouseRentDetails()}
                  {activeInnerTab === "section-80c" && renderSection80C()}
                  {activeInnerTab === "chapter-vi-a" && renderSectionVIA()}
                  {activeInnerTab === "house-property" && renderHousePropertyDetails()}
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    onClick={() => {
                      const tabs = ["house-rent", "section-80c", "chapter-vi-a", "house-property"]
                      const currentIndex = tabs.indexOf(activeInnerTab)
                      if (currentIndex > 0) {
                        setActiveInnerTab(tabs[currentIndex - 1])
                      }
                    }}
                    className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  {activeInnerTab === "house-property" ? (
                    <>
                      <button
                        onClick={() => {
                          handleSaveSection(activeInnerTab)
                        }}
                        className="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          // Add your final submission logic here
                          handleSaveSection(activeInnerTab)
                        }}
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Final Submission
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          handleSaveSection(activeInnerTab)
                        }}
                        className="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          const tabs = ["house-rent", "section-80c", "chapter-vi-a", "house-property"]
                          const currentIndex = tabs.indexOf(activeInnerTab)
                          if (currentIndex < tabs.length - 1) {
                            setActiveInnerTab(tabs[currentIndex + 1])
                          }
                        }}
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Next
                      </button>
                    </>
                  )}
                </div>

                {renderProofDocuments()}

                <ProofDocumentModal 
                  isOpen={isUploadModalOpen}
                  onClose={() => setIsUploadModalOpen(false)}
                  onUpload={handleDocumentUpload}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const ProofDocumentModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedDocument, setSelectedDocument] = useState("")
  const [file, setFile] = useState(null)
  const [comment, setComment] = useState("")

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) {
      // 10MB limit
      setFile(selectedFile)
    } else {
      alert("File size should not exceed 10MB")
    }
  }

  const handleUpload = () => {
    if (selectedDocument && file) {
      onUpload({
        documentName: selectedDocument,
        fileName: file.name,
        size: file.size,
        lastUpdated: new Date().toISOString(),
        comment,
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Document</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="">Select document type</option>
              <option value="Upload House Rent Details">Upload House Rent Details</option>
              <option value="Upload Section 80C">Upload Section 80C</option>
              <option value="Section 80D">Section 80D</option>
              <option value="Section 80DD">Section 80DD</option>
              <option value="Section 80DDB">Section 80DDB</option>
              <option value="Section 80E">Section 80E</option>
              <option value="Section 80EE">Section 80EE</option>
              <option value="Section 80U">Section 80U</option>
              <option value="Section 80CCD(1B)">Section 80CCD(1B)</option>
              <option value="House Property Documents">House Property Documents</option>
            </select>
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Select Document
            </label>
          </div>

          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              File
            </label>
            <p className="text-xs text-gray-500 mt-1">Max limit for each file is 10 MB</p>
          </div>

          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              rows="2"
              placeholder=" "
            ></textarea>
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Comment
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

