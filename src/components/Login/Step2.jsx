import React, { useState, useEffect } from 'react';
import LoanLogo from '../../assets/loan-logo.png';
import ProgressBar from '../ProgressBar';
import ProgressSteps from '../ProgressSteps';
import { saveUserDetails } from '../../utils/auth';

const Step2 = ({ nextStep, prevStep, formData, setFormData, isReturningUser }) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isReturningUser || !formData.isAuthenticated) {
      const { mobile, otp, isAuthenticated } = formData;
      setFormData({ mobile, otp, isAuthenticated });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dob') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        setErrors({ ...errors, dob: "You must be at least 18 years old" });
        return;
      }
      if (age > 100) {
        setErrors({ ...errors, dob: "Age cannot exceed 100 years" });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.profession) newErrors.profession = "Profession is required";
    if (!formData.income || isNaN(formData.income)) newErrors.income = "Valid income is required";
    if (!formData.incomeType) newErrors.income = "Please select income type";
    if (!formData.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = "Valid PAN is required (e.g., ABCDE1234F)";
    }
    if (!formData.aadhar || !/^\d{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = "Aadhar must be a 12-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      saveUserDetails(formData);
      nextStep();
    }
  };

  return (
    <div className="p-2 text-center">
      <div className="mb-6">
        <img src={LoanLogo} alt="Loan Logo" className="mx-auto mb-6 w-32 h-auto" />
      </div>

      <ProgressBar formData={formData} currentStep={2} />
      <ProgressSteps currentStep={2} />

      <div className="mb-6 mt-4 text-left">
        <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
        <p className="text-gray-600 text-sm mt-1">
          {isReturningUser 
            ? "Please review your personal details" 
            : "Please provide your personal details"}
        </p>
      </div>

      <div className="space-y-4 text-left">
        {/* Name */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input 
              name="firstName" 
              placeholder="First" 
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
              onChange={handleChange} 
              value={formData.firstName || ''} 
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <input 
            name="middleName" 
            placeholder="Middle" 
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
            onChange={handleChange} 
            value={formData.middleName || ''} 
          />
          <div>
            <input 
              name="lastName" 
              placeholder="Last" 
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
              onChange={handleChange} 
              value={formData.lastName || ''} 
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Gender */}
        <div>
          <select
            name="gender"
            className={`w-full p-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
              !formData.gender ? 'text-gray-400' : 'text-gray-700'
            }`}
            value={formData.gender || ''}
            onChange={handleChange}
          >
            <option value="" disabled hidden>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        {/* DOB */}
        <div>
          <input
            name="dob"
            placeholder="Date of Birth"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white appearance-none ${
              !formData.dob ? 'text-gray-400' : 'text-gray-700'
            }`}
            onChange={handleChange}
            value={formData.dob || ''}
            pattern="\d{4}-\d{2}-\d{2}"
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>

        {/* Profession */}
        <div>
          <select
            name="profession"
            className={`w-full p-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
              !formData.profession ? 'text-gray-400' : 'text-gray-700'
            }`}
            value={formData.profession || ''}
            onChange={handleChange}
          >
            <option value="" disabled hidden>Select Profession</option>
            <option value="Salaried">Salaried</option>
            <option value="Professional">Professional</option>
            <option value="Self Employed">Self Employed</option>
          </select>
          {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession}</p>}
        </div>

        {/* Income + Dropdown */}
        <div className="grid grid-cols-2 gap-2">
          <input 
            name="income" 
            placeholder="Income" 
            type="number" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
            onChange={handleChange} 
            value={formData.income || ''} 
          />
          <select
            name="incomeType"
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            onChange={handleChange}
            value={formData.incomeType || ''}
          >
            <option value="" disabled>Select Type</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
        {errors.income && <p className="text-red-500 text-xs mt-1">{errors.income}</p>}

        {/* PAN */}
        <div>
          <input 
            name="pan" 
            placeholder="PAN (ABCDE1234F)" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
            onChange={handleChange} 
            value={formData.pan || ''} 
          />
          {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
        </div>

        {/* Aadhar */}
        <div>
          <input 
            name="aadhar" 
            placeholder="Aadhar Number (12 digits)" 
            maxLength={12} 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
            onChange={handleChange} 
            value={formData.aadhar || ''} 
          />
          {errors.aadhar && <p className="text-red-500 text-xs mt-1">{errors.aadhar}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={prevStep}
          className="w-1/3 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
        >
          Back
        </button>
        
        <button
          onClick={handleNext}
          className="w-2/3 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 active:bg-green-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
