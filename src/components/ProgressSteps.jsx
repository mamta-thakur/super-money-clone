import React from 'react';

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Register' },
    { id: 2, label: 'Verify' },
    { id: 3, label: 'Details' },
    { id: 4, label: 'Loan' },
    { id: 5, label: 'Offers' }
  ];

  return (
    <div className="flex justify-center space-x-2 mb-6">
      {steps.map(step => (
        <button
          key={step.id}
          className={`px-3 py-2 rounded-full text-sm transition ${
            currentStep === step.id
              ? 'bg-green-100 text-green-700 font-medium'
              : currentStep > step.id
                ? 'bg-gray-100 text-gray-600'
                : 'bg-gray-100 text-gray-500'
          }`}
        >
          {step.label}
        </button>
      ))}
    </div>
  );
};

export default ProgressSteps;