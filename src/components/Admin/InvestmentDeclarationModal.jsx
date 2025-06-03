import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, FileUp } from 'lucide-react';
import { format } from 'date-fns';

// --------------------- FloatingInput Component ---------------------
const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  error = null,
}) => (
  <div className="relative mb-4">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      disabled={disabled}
      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border ${
        error ? 'border-red-500' : 'border-gray-300'
      } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:bg-gray-100 disabled:text-gray-500`}
    />
    <label
      htmlFor={id}
      className={`absolute text-sm ${
        error ? 'text-red-500' : 'text-gray-500'
      } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
        peer-focus:px-2 peer-focus:text-blue-600 
        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// --------------------- InvestmentDeclarationModal ---------------------
export default function InvestmentDeclarationModal({ employee, mode, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('section80C');
  const [declarationData, setDeclarationData] = useState({
    houseRent: {
      cityType: 'metro',
      rentPaid: '',
      periods: [],
      landlordPan: '',
      address: '',
    },
    section80C: {
      lifeInsurance: '',
      ppf: '',
      vpf: '',
      pensionFund: '',
      nsc: '',
      nscInterest: '',
      ulip: '',
      elss: '',
      tuitionFees: '',
      houseLoanPrincipal: '',
      registrationCharges: '',
      sukanyaSamriddhi: '',
      infrastructureBonds: '',
      fixedDeposit: '',
    },
    sectionVIA: {
      section80D: {
        self: '',
        parents: '',
        isSelfSeniorCitizen: false,
        isParentsSeniorCitizen: false,
        preventiveHealthCheckup: '',
      },
      section80DD: '',
      section80DDB: '',
      section80E: '',
      section80EE: '',
      section80EEA: '',
      section80EEB: '',
      section80G: '',
      section80GG: '',
      section80GGA: '',
      section80GGC: '',
      section80TTA: '',
      section80TTB: '',
      section80U: '',
      section80CCD1B: '',
    },
    houseProperty: {
      propertyType: 'self-occupied',
      loanTakenBeforeApril1999: false,
      interest: '',
      rentalIncome: '',
      address: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // --------------------- NEW: For Proof Documents ---------------------
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleDocumentUpload = (docData) => {
    setUploadedDocuments((prev) => [...prev, docData]);
  };

  // Example "renderProofDocuments" similar to your first snippet
  const renderProofDocuments = () => (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Proof Documents</h3>
        {mode !== 'view' && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="text-green-500 flex items-center hover:text-green-600 text-sm"
          >
            <FileUp className="mr-1" size={16} />
            Drop Files Here
          </button>
        )}
      </div>

      <div
        className="border rounded-lg overflow-hidden"
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      >
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
                <td className="px-4 py-2 text-sm">
                  {format(new Date(doc.lastUpdated), 'dd-MMM-yyyy')}
                </td>
                <td className="px-4 py-2 text-sm">{doc.comment}</td>
                <td className="px-4 py-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Uploaded
                  </span>
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
  );
  // -------------------------------------------------------------

  // Fetch or load existing data (mocked for demonstration)
  useEffect(() => {
    // You might replace this with an API call to fetch existing data
    setDeclarationData({
      houseRent: {
        cityType: 'metro',
        rentPaid: '120000',
        periods: [],
        landlordPan: 'ABCDE1234F',
        address: '123 Main St, City',
      },
      section80C: {
        lifeInsurance: '50000',
        ppf: '150000',
        vpf: '20000',
        pensionFund: '50000',
        nsc: '25000',
        nscInterest: '2000',
        ulip: '30000',
        elss: '50000',
        tuitionFees: '100000',
        houseLoanPrincipal: '200000',
        registrationCharges: '10000',
        sukanyaSamriddhi: '15000',
        infrastructureBonds: '20000',
        fixedDeposit: '50000',
      },
      sectionVIA: {
        section80D: {
          self: '25000',
          parents: '50000',
          isSelfSeniorCitizen: false,
          isParentsSeniorCitizen: true,
          preventiveHealthCheckup: '5000',
        },
        section80DD: '75000',
        section80DDB: '40000',
        section80E: '150000',
        section80EE: '50000',
        section80EEA: '150000',
        section80EEB: '150000',
        section80G: '10000',
        section80GG: '60000',
        section80GGA: '10000',
        section80GGC: '10000',
        section80TTA: '10000',
        section80TTB: '50000',
        section80U: '75000',
        section80CCD1B: '50000',
      },
      houseProperty: {
        propertyType: 'self-occupied',
        loanTakenBeforeApril1999: false,
        interest: '200000',
        rentalIncome: '',
        address: '456 Home St, City',
      },
    });
  }, []);

  // --------------------- HANDLERS ---------------------
  const handleInputChange = (section, subsection, field, value) => {
    setDeclarationData((prev) => ({
      ...prev,
      [section]: subsection
        ? {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [field]: value,
            },
          }
        : {
            ...prev[section],
            [field]: value,
          },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate House Rent
    if (!declarationData.houseRent.rentPaid) {
      newErrors.rentPaid = 'Rent paid is required';
    }
    if (!declarationData.houseRent.landlordPan) {
      newErrors.landlordPan = 'Landlord PAN is required';
    }

    // Validate Section 80C
    if (parseInt(declarationData.section80C.lifeInsurance) > 150000) {
      newErrors.lifeInsurance = 'Life Insurance premium cannot exceed ₹1,50,000';
    }

    // Validate Section 80D self insurance
    if (parseInt(declarationData.sectionVIA.section80D.self) > 25000) {
      newErrors.selfMedicalInsurance = 'Self Medical Insurance cannot exceed ₹25,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(declarationData);
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    }
  };

  // --------------------- RENDER TABS ---------------------
  // 1. Section 80C
  const renderSection80C = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Section 80C Deductions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingInput
          id="lifeInsurance"
          label="Life Insurance Premium"
          type="number"
          value={declarationData.section80C.lifeInsurance}
          onChange={(e) => handleInputChange('section80C', null, 'lifeInsurance', e.target.value)}
          disabled={mode === 'view'}
          error={errors.lifeInsurance}
        />
        <FloatingInput
          id="ppf"
          label="Public Provident Fund (PPF)"
          type="number"
          value={declarationData.section80C.ppf}
          onChange={(e) => handleInputChange('section80C', null, 'ppf', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="vpf"
          label="Voluntary Provident Fund (VPF)"
          type="number"
          value={declarationData.section80C.vpf}
          onChange={(e) => handleInputChange('section80C', null, 'vpf', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="pensionFund"
          label="Pension Fund Contribution"
          type="number"
          value={declarationData.section80C.pensionFund}
          onChange={(e) => handleInputChange('section80C', null, 'pensionFund', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="nsc"
          label="National Savings Certificate (NSC)"
          type="number"
          value={declarationData.section80C.nsc}
          onChange={(e) => handleInputChange('section80C', null, 'nsc', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="nscInterest"
          label="Interest Accrued on NSC (Reinvested)"
          type="number"
          value={declarationData.section80C.nscInterest}
          onChange={(e) => handleInputChange('section80C', null, 'nscInterest', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="ulip"
          label="Unit Linked Insurance Policy (ULIP)"
          type="number"
          value={declarationData.section80C.ulip}
          onChange={(e) => handleInputChange('section80C', null, 'ulip', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="elss"
          label="Equity Linked Savings Schemes (ELSS)"
          type="number"
          value={declarationData.section80C.elss}
          onChange={(e) => handleInputChange('section80C', null, 'elss', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="tuitionFees"
          label="Payment of Tuition Fees (Max 2 Children)"
          type="number"
          value={declarationData.section80C.tuitionFees}
          onChange={(e) => handleInputChange('section80C', null, 'tuitionFees', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="houseLoanPrincipal"
          label="Principal Repayment of Housing Loan"
          type="number"
          value={declarationData.section80C.houseLoanPrincipal}
          onChange={(e) => handleInputChange('section80C', null, 'houseLoanPrincipal', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="registrationCharges"
          label="Registration Charges for Buying House (1 Year Only)"
          type="number"
          value={declarationData.section80C.registrationCharges}
          onChange={(e) => handleInputChange('section80C', null, 'registrationCharges', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="sukanyaSamriddhi"
          label="Sukanya Samriddhi Yojana"
          type="number"
          value={declarationData.section80C.sukanyaSamriddhi}
          onChange={(e) => handleInputChange('section80C', null, 'sukanyaSamriddhi', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="infrastructureBonds"
          label="Infrastructure Bonds"
          type="number"
          value={declarationData.section80C.infrastructureBonds}
          onChange={(e) => handleInputChange('section80C', null, 'infrastructureBonds', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="fixedDeposit"
          label="Bank Fixed Deposit (5+ Years)"
          type="number"
          value={declarationData.section80C.fixedDeposit}
          onChange={(e) => handleInputChange('section80C', null, 'fixedDeposit', e.target.value)}
          disabled={mode === 'view'}
        />
      </div>
    </div>
  );

  // 2. Section 80D & HRA (House Rent)
  const renderSection80DAndHRA = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Section 80D and HRA</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 80D */}
        <FloatingInput
          id="section80DSelf"
          label="Self Medical Insurance (80D)"
          type="number"
          value={declarationData.sectionVIA.section80D.self}
          onChange={(e) => handleInputChange('sectionVIA', 'section80D', 'self', e.target.value)}
          disabled={mode === 'view'}
          error={errors.selfMedicalInsurance}
        />
        <FloatingInput
          id="section80DParents"
          label="Parents Medical Insurance (80D)"
          type="number"
          value={declarationData.sectionVIA.section80D.parents}
          onChange={(e) => handleInputChange('sectionVIA', 'section80D', 'parents', e.target.value)}
          disabled={mode === 'view'}
        />

        {/* Senior Citizen Checkboxes */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="selfSeniorCitizen"
            checked={declarationData.sectionVIA.section80D.isSelfSeniorCitizen}
            onChange={(e) =>
              handleInputChange('sectionVIA', 'section80D', 'isSelfSeniorCitizen', e.target.checked)
            }
            className="mr-2"
            disabled={mode === 'view'}
          />
          <label htmlFor="selfSeniorCitizen">Self Senior Citizen</label>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="parentsSeniorCitizen"
            checked={declarationData.sectionVIA.section80D.isParentsSeniorCitizen}
            onChange={(e) =>
              handleInputChange(
                'sectionVIA',
                'section80D',
                'isParentsSeniorCitizen',
                e.target.checked,
              )
            }
            className="mr-2"
            disabled={mode === 'view'}
          />
          <label htmlFor="parentsSeniorCitizen">Parents Senior Citizen</label>
        </div>

        <FloatingInput
          id="preventiveHealthCheckup"
          label="Preventive Health Checkup"
          type="number"
          value={declarationData.sectionVIA.section80D.preventiveHealthCheckup}
          onChange={(e) =>
            handleInputChange('sectionVIA', 'section80D', 'preventiveHealthCheckup', e.target.value)
          }
          disabled={mode === 'view'}
        />
      </div>

      {/* House Rent */}
      <h4 className="text-md font-semibold mb-2">House Rent Details (HRA)</h4>
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City Type Radio Buttons */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="cityType"
              value="metro"
              checked={declarationData.houseRent.cityType === 'metro'}
              onChange={(e) => handleInputChange('houseRent', null, 'cityType', e.target.value)}
              className="mr-2"
              disabled={mode === 'view'}
            />
            Metro
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="cityType"
              value="non-metro"
              checked={declarationData.houseRent.cityType === 'non-metro'}
              onChange={(e) => handleInputChange('houseRent', null, 'cityType', e.target.value)}
              className="mr-2"
              disabled={mode === 'view'}
            />
            Non-Metro
          </label>
        </div>

        <FloatingInput
          id="rentPaid"
          label="Total Rent Paid/Payable"
          type="number"
          value={declarationData.houseRent.rentPaid}
          onChange={(e) => handleInputChange('houseRent', null, 'rentPaid', e.target.value)}
          disabled={mode === 'view'}
          error={errors.rentPaid}
        />
        <FloatingInput
          id="landlordPan"
          label="Landlord PAN"
          value={declarationData.houseRent.landlordPan}
          onChange={(e) => handleInputChange('houseRent', null, 'landlordPan', e.target.value)}
          disabled={mode === 'view'}
          error={errors.landlordPan}
        />
        <FloatingInput
          id="address"
          label="Rental Address"
          value={declarationData.houseRent.address}
          onChange={(e) => handleInputChange('houseRent', null, 'address', e.target.value)}
          disabled={mode === 'view'}
        />
      </div>
    </div>
  );

  // 3. Other Investments (80E, 80CCD(1B), 80EE, etc.)
  const renderOtherInvestments = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Other Investments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingInput
          id="section80E"
          label="Education Loan Interest (80E)"
          type="number"
          value={declarationData.sectionVIA.section80E}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80E', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80CCD1B"
          label="National Pension Scheme (80CCD(1B))"
          type="number"
          value={declarationData.sectionVIA.section80CCD1B}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80CCD1B', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80EE"
          label="Additional Interest on Housing Loan (80EE)"
          type="number"
          value={declarationData.sectionVIA.section80EE}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80EE', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80EEA"
          label="Interest on Home Loan for Affordable Housing (80EEA)"
          type="number"
          value={declarationData.sectionVIA.section80EEA}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80EEA', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80EEB"
          label="Interest on Loan for Electric Vehicle (80EEB)"
          type="number"
          value={declarationData.sectionVIA.section80EEB}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80EEB', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80G"
          label="Donations (80G)"
          type="number"
          value={declarationData.sectionVIA.section80G}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80G', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80GG"
          label="Rent Paid (80GG)"
          type="number"
          value={declarationData.sectionVIA.section80GG}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80GG', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80GGA"
          label="Donations for Scientific Research (80GGA)"
          type="number"
          value={declarationData.sectionVIA.section80GGA}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80GGA', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80GGC"
          label="Donations to Political Parties (80GGC)"
          type="number"
          value={declarationData.sectionVIA.section80GGC}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80GGC', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80TTA"
          label="Interest on Savings Account (80TTA)"
          type="number"
          value={declarationData.sectionVIA.section80TTA}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80TTA', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80TTB"
          label="Interest for Senior Citizens (80TTB)"
          type="number"
          value={declarationData.sectionVIA.section80TTB}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80TTB', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80U"
          label="For Disability (80U)"
          type="number"
          value={declarationData.sectionVIA.section80U}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80U', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80DD"
          label="Dependent Medical Treatment (80DD)"
          type="number"
          value={declarationData.sectionVIA.section80DD}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80DD', e.target.value)}
          disabled={mode === 'view'}
        />
        <FloatingInput
          id="section80DDB"
          label="Medical Treatment (80DDB)"
          type="number"
          value={declarationData.sectionVIA.section80DDB}
          onChange={(e) => handleInputChange('sectionVIA', null, 'section80DDB', e.target.value)}
          disabled={mode === 'view'}
        />
      </div>
    </div>
  );

  // 4. House Property
  const renderHousePropertyDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">House Property Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="propertyType"
              value="self-occupied"
              checked={declarationData.houseProperty.propertyType === 'self-occupied'}
              onChange={(e) => handleInputChange('houseProperty', null, 'propertyType', e.target.value)}
              className="mr-2"
              disabled={mode === 'view'}
            />
            Self Occupied
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="propertyType"
              value="let-out"
              checked={declarationData.houseProperty.propertyType === 'let-out'}
              onChange={(e) => handleInputChange('houseProperty', null, 'propertyType', e.target.value)}
              className="mr-2"
              disabled={mode === 'view'}
            />
            Let Out
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="loanTakenBeforeApril1999"
            checked={declarationData.houseProperty.loanTakenBeforeApril1999}
            onChange={(e) =>
              handleInputChange('houseProperty', null, 'loanTakenBeforeApril1999', e.target.checked)
            }
            className="mr-2"
            disabled={mode === 'view'}
          />
          <label htmlFor="loanTakenBeforeApril1999">Loan taken before April 1999</label>
        </div>
        <FloatingInput
          id="interest"
          label="Interest paid on borrowed capital"
          type="number"
          value={declarationData.houseProperty.interest}
          onChange={(e) => handleInputChange('houseProperty', null, 'interest', e.target.value)}
          disabled={mode === 'view'}
        />
        {declarationData.houseProperty.propertyType === 'let-out' && (
          <FloatingInput
            id="rentalIncome"
            label="Annual rental income"
            type="number"
            value={declarationData.houseProperty.rentalIncome}
            onChange={(e) => handleInputChange('houseProperty', null, 'rentalIncome', e.target.value)}
            disabled={mode === 'view'}
          />
        )}
        <FloatingInput
          id="propertyAddress"
          label="Property Address"
          value={declarationData.houseProperty.address}
          onChange={(e) => handleInputChange('houseProperty', null, 'address', e.target.value)}
          disabled={mode === 'view'}
        />
      </div>
    </div>
  );

  // --------------------- TABS DEFINITION ---------------------
  const tabs = [
    { id: 'section80C', label: 'Section 80C', content: renderSection80C },
    { id: 'section80DAndHRA', label: 'Section 80D & HRA', content: renderSection80DAndHRA },
    { id: 'otherInvestments', label: 'Other Investments', content: renderOtherInvestments },
    { id: 'houseProperty', label: 'House Property', content: renderHousePropertyDetails },
    // You can add a tab for "Proof Documents," or simply render below
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl w-[900px] h-[700px] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Investment Declaration - {employee.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 ${
                activeTab === tab.id
                  ? 'bg-gray-100 font-semibold border-b-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-grow overflow-y-auto p-4">
          {employee.taxRegime === 'old' ? (
            tabs.find((tab) => tab.id === activeTab)?.content()
          ) : (
            <p className="text-lg text-center py-8">
              New tax regime selected. No additional deductions applicable.
            </p>
          )}

          {/* Always render Proof Documents below (or create a separate tab for them) */}
          {mode !== 'view' && renderProofDocuments()}
        </div>

        {/* Footer Buttons */}
        <div className="border-t p-4 flex justify-end space-x-4">
          {mode === 'edit' && employee.taxRegime === 'old' && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
        </div>

        {/* Success Notification */}
        {showSuccessNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            Changes saved successfully!
          </div>
        )}
      </div>

      {/* ProofDocumentModal (for uploading documents) */}
      <ProofDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
}

// --------------------- ProofDocumentModal ---------------------
function ProofDocumentModal({ isOpen, onClose, onUpload }) {
  const [selectedDocument, setSelectedDocument] = useState('');
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) {
      // 10MB limit
      setFile(selectedFile);
    } else {
      alert('File size should not exceed 10MB');
    }
  };

  const handleUpload = () => {
    if (selectedDocument && file) {
      onUpload({
        documentName: selectedDocument,
        fileName: file.name,
        size: file.size,
        lastUpdated: new Date().toISOString(),
        comment,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

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
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="">Select document type</option>
              <option value="House Rent (HRA)">House Rent (HRA)</option>
              <option value="Section 80C">Section 80C</option>
              <option value="Section 80D">Section 80D</option>
              <option value="Section 80DD">Section 80DD</option>
              <option value="Section 80DDB">Section 80DDB</option>
              <option value="Section 80E">Section 80E</option>
              <option value="Section 80EE">Section 80EE</option>
              <option value="Section 80U">Section 80U</option>
              <option value="Section 80CCD(1B)">Section 80CCD(1B)</option>
              <option value="House Property Documents">House Property Documents</option>
            </select>
            <label
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                peer-focus:px-2 peer-focus:text-blue-600 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
                peer-focus:-translate-y-4 left-1"
            >
              Select Document
            </label>
          </div>

          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                peer-focus:px-2 peer-focus:text-blue-600 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
                peer-focus:-translate-y-4 left-1"
            >
              File
            </label>
            <p className="text-xs text-gray-500 mt-1">Max limit for each file is 10 MB</p>
          </div>

          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="2"
              placeholder=" "
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            ></textarea>
            <label
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                peer-focus:px-2 peer-focus:text-blue-600 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
                peer-focus:-translate-y-4 left-1"
            >
              Comment
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
