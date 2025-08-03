// import FloatingInput from './FloatingInput'; // Assuming AddressForm is in a separate file


// // Address Form Component
// const AddressForm = ({ formData, handleInputChange, formErrors, darkMode = false }) => {
//     return (
//         <>
//             {/* Present Address Section */}
//             <div className="space-y-2">
//                 <h3 className="font-semibold text-lg">Present Address</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     {/* <FloatingInput
//                         id="presentHouseNumber"
//                         label="House Number/Street/Flat No"
//                         value={formData.presentHouseNumber || ''}
//                         onChange={handleInputChange}
//                         error={formErrors.presentHouseNumber}
//                     /> */}
//                     <FloatingInput
//                         id="presentCity"
//                         label="City"
//                         value={formData.presentCity || ''}
//                         onChange={handleInputChange}
//                         error={formErrors.presentCity}
//                     />
//                     <FloatingInput
//                         id="presentState"
//                         label="State"
//                         value={formData.presentState || ''}
//                         onChange={handleInputChange}
//                         error={formErrors.presentState}
//                     />
//                     <FloatingInput
//                         id="presentPincode"
//                         label="Pincode"
//                         value={formData.presentPincode || ''}
//                         onChange={handleInputChange}
//                         error={formErrors.presentPincode}
//                         type="text" // Using text to allow flexibility, can change to 'number' if only digits are needed
//                     />
//                 </div>
//             </div>

//             {/* Permanent Address Section */}
//             <div className="space-y-2">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <FloatingInput
//                         id="permanentHouseNumber"
//                         label="House Number/Street/Flat No"
//                         value={formData.permanentHouseNumber || ''}
//                         onChange={handleInputChange}
//                         error={formErrors.permanentHouseNumber}
//                         darkMode={darkMode}
//                     />
//                     <FloatingInput
//                         id="permanentCity"
//                         label="City"
//                         value={formData.permanentCity || ''}
//                         onChange={handleInputChange}
//                         error={formErrors.permanentCity}
//                         darkMode={darkMode}
//                     />
//                     <FloatingInput
//                         id="permanentState"
//                         label="State"
//                         value={formData.permanentState || ''}
//                         onChange={handleInputChange}
//                         error={formErrors.permanentState}
//                         darkMode={darkMode}
//                     />
//                     <FloatingInput
//                         id="permanentPincode"
//                         label="Pincode"
//                         value={formData.permanentPincode || ''}
//                         onChange={handleInputChange}
//                         error={formErrors.permanentPincode}
//                         type="text" // Using text, can change to 'number' if needed
//                         darkMode={darkMode}
//                     />
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddressForm;